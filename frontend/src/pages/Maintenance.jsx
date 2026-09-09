import React, { useState } from 'react';
import { TicketCard } from '../components/TicketCard';
import { maintenanceService, equipmentService } from '../services/api';
import { 
  Wrench, 
  Plus, 
  Package, 
  CheckCircle, 
  Filter, 
  Search, 
  Clock, 
  Boxes,
  ShieldCheck,
  AlertTriangle,
  X,
  Bot,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const MaintenancePage = ({
  tickets = [],
  equipmentList = [],
  spareParts = [],
  onUpdateTicketStatus,
  onAddNewTicket,
  onRepairLogged,
  id
}) => {
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const safeEquipment = Array.isArray(equipmentList) ? equipmentList : [];
  const safeParts = Array.isArray(spareParts) ? spareParts : [];

  const [activeTab, setActiveTab] = useState('tickets');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // AI Health & Condition Verification Modal State
  const [aiVerificationModal, setAiVerificationModal] = useState(null);

  // Technician Repair Modal State
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [selectedTicketForRepair, setSelectedTicketForRepair] = useState(null);
  const [repairNotes, setRepairNotes] = useState('');
  const [downtimeHours, setDowntimeHours] = useState(1.5);
  const [selectedPartsUsed, setSelectedPartsUsed] = useState([]);
  const [selectedPartToAdd, setSelectedPartToAdd] = useState(safeParts[0]?.partNumber || '');
  const [partQuantityToAdd, setPartQuantityToAdd] = useState(1);
  const [isSubmittingRepair, setIsSubmittingRepair] = useState(false);

  // New ticket state
  const [newTitle, setNewTitle] = useState('');
  const [newEqId, setNewEqId] = useState(safeEquipment[0]?.id || '');
  const [newPriority, setNewPriority] = useState('P2 - HIGH');
  const [newDescription, setNewDescription] = useState('');

  const filteredTickets = safeTickets.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t?.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleStatusChangeWithAiVerification = (ticketId, newStatus, notes) => {
    const ticket = safeTickets.find(t => t.id === ticketId);
    if (ticket?.status === 'RESOLVED') return;
    const eq = safeEquipment.find(e => e.id === ticket?.equipmentId || e.name === ticket?.equipmentName) || null;

    if (newStatus === 'RESOLVED') {
      const isBreaching = eq ? (
        eq.failureRisk === 'CRITICAL' ||
        eq.failureRisk === 'HIGH' ||
        (typeof eq.healthScore === 'number' && eq.healthScore < 65) ||
        (eq.activeErrorCode && String(eq.activeErrorCode).trim().length > 0)
      ) : (ticket?.priority === 'P1 - CRITICAL');

      if (isBreaching) {
        // Equipment has an active unresolved failure; update ticket status to proper status (IN_PROGRESS) and block RESOLVED
        onUpdateTicketStatus(ticketId, 'IN_PROGRESS', 'AI Telemetry Verification: Active machine failure detected. Status set to IN_PROGRESS.');

        setAiVerificationModal({
          passed: false,
          ticketId,
          ticket: ticket ? { ...ticket, status: 'IN_PROGRESS' } : null,
          newStatus,
          notes,
          eqId: eq?.id || ticket?.equipmentId || 'EQ-001',
          eqName: eq?.name || ticket?.equipmentName || 'Equipment',
          healthScore: eq?.healthScore ?? 60,
          failureRisk: eq?.failureRisk || 'HIGH',
          errorCode: eq?.activeErrorCode || 'ACTIVE_FAILURE',
          issue: eq?.predictedIssue || 'Sensor values exceed acceptable operating ranges.'
        });
        return;
      } else {
        setAiVerificationModal({
          passed: true,
          ticketId,
          newStatus,
          notes,
          eqId: eq?.id || ticket?.equipmentId || 'EQ-001',
          eqName: eq?.name || ticket?.equipmentName || 'Equipment',
          healthScore: eq?.healthScore || 95,
          failureRisk: eq?.failureRisk || 'LOW',
          errorCode: null,
          issue: 'Nominal operating conditions verified by AI sensor model.'
        });
      }
    }

    onUpdateTicketStatus(ticketId, newStatus, notes);
  };

  const handleOpenRepairModal = (ticket) => {
    setSelectedTicketForRepair(ticket);
    setRepairNotes(`Replaced worn components on ${ticket.equipmentName}. Recalibrated sensor baselines and verified operational vibration under load.`);
    setDowntimeHours(1.5);
    // Pre-populate with suggested parts if any
    if (ticket.suggestedSpareParts && ticket.suggestedSpareParts.length > 0) {
      setSelectedPartsUsed(
        ticket.suggestedSpareParts.map(p => ({
          partNumber: p.partNumber,
          name: p.name,
          quantity: p.quantity || 1
        }))
      );
    } else {
      setSelectedPartsUsed([]);
    }
    setShowRepairModal(true);
  };

  const handleAddPartToRepair = () => {
    const part = spareParts.find(p => p.partNumber === selectedPartToAdd);
    if (!part) return;
    if (selectedPartsUsed.some(p => p.partNumber === part.partNumber)) {
      setSelectedPartsUsed(selectedPartsUsed.map(p => 
        p.partNumber === part.partNumber ? { ...p, quantity: p.quantity + partQuantityToAdd } : p
      ));
    } else {
      setSelectedPartsUsed([...selectedPartsUsed, {
        partNumber: part.partNumber,
        name: part.name,
        quantity: partQuantityToAdd
      }]);
    }
  };

  const handleRemovePartFromRepair = (partNumber) => {
    setSelectedPartsUsed(selectedPartsUsed.filter(p => p.partNumber !== partNumber));
  };

  const handleRecordRepairSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicketForRepair) return;
    setIsSubmittingRepair(true);

    try {
      const targetTicketId = selectedTicketForRepair.id;
      const targetNotes = repairNotes;

      await maintenanceService.recordRepair(targetTicketId, {
        partsUsed: selectedPartsUsed,
        downtimeHours,
        resolutionNotes: targetNotes,
        technicianBadge: 'TECH-4109'
      });
      setShowRepairModal(false);
      if (onRepairLogged) onRepairLogged();

      // Trigger AI Condition Verification Modal immediately upon repair submission
      handleStatusChangeWithAiVerification(targetTicketId, 'RESOLVED', targetNotes);
    } catch (err) {
      console.error('Failed to log repair:', err);
    } finally {
      setIsSubmittingRepair(false);
    }
  };

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    const eq = equipmentList.find((item) => item.id === newEqId);
    onAddNewTicket({
      equipmentId: newEqId,
      equipmentName: eq?.name || 'Laboratory Instrument',
      title: newTitle || 'Preventive Maintenance Inspection',
      priority: newPriority,
      problemDescription: newDescription,
      status: 'OPEN',
      assignedTechnician: 'Dr. Elena Rostova',
      generatedByAI: false,
      recommendedTechnicianAction: ['Inspect physical assemblies and sensor harnesses', 'Perform zero-calibration test']
    });
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div id={id || 'maintenance-page'} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-500" />
            <span>Laboratory Maintenance Work Orders &amp; Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Predictive work orders, automated ticket generation, and spare parts inventory tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Work Orders ({safeTickets.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Spare Parts ({safeParts.length})
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'tickets' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-500">Filter By:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value )}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">OPEN</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="ALL">All Priorities</option>
                <option value="P1 - CRITICAL">P1 - Critical</option>
                <option value="P2 - HIGH">P2 - High</option>
                <option value="P3 - MEDIUM">P3 - Medium</option>
                <option value="P4 - LOW">P4 - Low</option>
              </select>
            </div>

            <div className="text-slate-500">
              Showing <strong>{filteredTickets.length}</strong> of {safeTickets.length} tickets
            </div>
          </div>

          {/* Ticket Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map((t) => (
              <div key={t.id} className="space-y-2">
                <TicketCard
                  ticket={t}
                  onStatusChange={handleStatusChangeWithAiVerification}
                />
                {t.status !== 'RESOLVED' && (
                  <div className="bg-amber-50/60 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-600" />
                      <span>Technician Actions</span>
                    </span>
                    <button
                      onClick={() => handleOpenRepairModal(t)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Record Repair &amp; Parts Replacement</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Spare Parts Inventory Table */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-500" />
              <span>Critical Spare Parts Inventory Catalog</span>
            </h2>
            <span className="text-xs text-slate-500">Linked to Predictive Maintenance Service Bulletins</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Part Number</th>
                  <th className="p-3">Part Name</th>
                  <th className="p-3">Applicable Equipment</th>
                  <th className="p-3">In Stock</th>
                  <th className="p-3">Bin Location</th>
                  <th className="p-3">Unit Cost</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {safeParts.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{sp.partNumber}</td>
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{sp.name}</td>
                    <td className="p-3 font-mono text-slate-500">{sp.applicableEquipmentIds.join(', ')}</td>
                    <td className="p-3 font-bold font-mono text-slate-800 dark:text-slate-200">{sp.quantityInStock} units</td>
                    <td className="p-3 font-mono text-slate-500">{sp.binLocation}</td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">${sp.unitCost}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          sp.quantityInStock > sp.reorderThreshold
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {sp.quantityInStock > sp.reorderThreshold ? 'Nominal' : 'Reorder Needed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Schedule Laboratory Maintenance Ticket
            </h3>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Equipment</label>
                <select
                  value={newEqId}
                  onChange={(e) => setNewEqId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {safeEquipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ticket Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Preventative Bearing & Heat Exchanger Flush"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="P1 - CRITICAL">P1 - CRITICAL</option>
                  <option value="P2 - HIGH">P2 - HIGH</option>
                  <option value="P3 - MEDIUM">P3 - MEDIUM</option>
                  <option value="P4 - LOW">P4 - LOW</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe abnormal noise, thermal drift, or maintenance requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Technician Record Repair & Replacement Modal */}
      {showRepairModal && selectedTicketForRepair && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  <span>Technician Repair &amp; Replacement Log</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record repair completion, replacement components deducted from inventory, and actual downtime.
                </p>
              </div>
            </div>

            <form onSubmit={handleRecordRepairSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-[11px] text-slate-500">Ticket Reference:</div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {selectedTicketForRepair.id} — {selectedTicketForRepair.title}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Target Instrument: <strong>{selectedTicketForRepair.equipmentName}</strong> ({selectedTicketForRepair.equipmentId})
                </div>
              </div>

              {/* Downtime Hours */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Actual Machine Downtime (Hours)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={downtimeHours}
                  onChange={(e) => setDowntimeHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Replaced Parts Section */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Replacement Parts Consumed from Inventory
                </label>

                {/* Parts Selector Bar */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedPartToAdd}
                    onChange={(e) => setSelectedPartToAdd(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {safeParts.map((sp) => (
                      <option key={sp.partNumber} value={sp.partNumber}>
                        {sp.partNumber} - {sp.name} ({sp.quantityInStock} in stock)
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={partQuantityToAdd}
                    onChange={(e) => setPartQuantityToAdd(Number(e.target.value))}
                    className="w-16 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-center"
                  />

                  <button
                    type="button"
                    onClick={handleAddPartToRepair}
                    className="px-3 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white rounded-xl font-bold"
                  >
                    Add Part
                  </button>
                </div>

                {/* List of parts being replaced */}
                {selectedPartsUsed.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                    {selectedPartsUsed.map((pu) => (
                      <div key={pu.partNumber} className="p-2.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white font-mono">{pu.partNumber}</div>
                          <div className="text-[11px] text-slate-500">{pu.name} (Qty: {pu.quantity})</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePartFromRepair(pu.partNumber)}
                          className="text-rose-500 hover:text-rose-700 font-bold px-2 py-1 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    No spare parts added. (Click Add Part if physical components were swapped).
                  </div>
                )}
              </div>

              {/* Technician Resolution Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Technician Action &amp; Sensor Calibration Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRepairModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRepair}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{isSubmittingRepair ? 'Recording...' : 'Complete Repair & Restore Instrument'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: AI Condition Verification Dialog */}
      {aiVerificationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            {aiVerificationModal.passed ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      AI Health Verification PASSED
                    </h3>
                    <p className="text-xs text-slate-500">
                      Machine telemetry and health conditions verified nominal
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{aiVerificationModal.eqName} ({aiVerificationModal.eqId})</span>
                  </div>
                  <p className="leading-relaxed">
                    AI telemetry inspection model verified that sensor operating parameters have returned to normal bounds. Health score restored to <strong>{aiVerificationModal.healthScore}%</strong>. Work order successfully resolved.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setAiVerificationModal(null)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/30"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      AI Health Verification FAILED
                    </h3>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                      Machine conditions unresolved! Work order closure blocked.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <Bot className="w-4 h-4 text-rose-600" />
                    <span>Machine: {aiVerificationModal.eqName} ({aiVerificationModal.eqId})</span>
                  </div>
                  <div className="font-mono text-[11px] bg-rose-100/60 dark:bg-rose-900/40 p-2 rounded">
                    Current Health: {aiVerificationModal.healthScore}% • Risk: {aiVerificationModal.failureRisk} • Code: {aiVerificationModal.errorCode}
                  </div>
                  <p className="leading-relaxed font-medium">
                    {aiVerificationModal.issue}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Proper Status Updated: <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 font-bold text-amber-950 dark:text-amber-100 ml-1">IN_PROGRESS</span></span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                    The work order cannot be resolved until equipment repairs are completed and sensor telemetry normalizes. Ticket status is updated to <strong>IN_PROGRESS</strong>.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => setAiVerificationModal(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Close &amp; Keep IN_PROGRESS
                  </button>
                  {aiVerificationModal.ticket && (
                    <button
                      onClick={() => {
                        const tkt = aiVerificationModal.ticket;
                        setAiVerificationModal(null);
                        handleOpenRepairModal(tkt);
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/30"
                    >
                      <Wrench className="w-4 h-4 text-white" />
                      <span>Record Repair &amp; Replace Parts</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
