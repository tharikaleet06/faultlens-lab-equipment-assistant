import React from 'react';
import { EquipmentCard } from '../components/EquipmentCard';
import { RiskBadge } from '../components/RiskBadge';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Wrench, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  Zap,
  TrendingDown
} from 'lucide-react';

export const Dashboard = ({
  equipmentList = [],
  tickets = [],
  currentUser,
  onSelectEquipment,
  onDiagnoseEquipment,
  onGenerateTicket,
  onNavigateToTab,
  id
}) => {
  const safeEquipment = Array.isArray(equipmentList) ? equipmentList : [];
  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const roleStr = currentUser?.role || 'TECHNICIAN';
  const cleanRole = typeof roleStr === 'string' ? roleStr.replace('ROLE_', '') : 'TECHNICIAN';
  const isAdmin = cleanRole === 'ADMIN';

  // For Technician, filter equipment/tickets to assigned items where applicable
  const assignedEquipment = isAdmin ? safeEquipment : safeEquipment.filter(e => 
    !e || 
    e.assignedTechnician === currentUser?.email || 
    e.assignedTechnician === currentUser?.name ||
    !e.assignedTechnician // show unassigned or assigned
  );

  const usernameStr = (currentUser?.username || '').toLowerCase();
  const nameStr = (currentUser?.name || '').toLowerCase();

  const assignedTickets = isAdmin ? safeTickets : safeTickets.filter(t => {
    if (!t) return false;
    const tech = typeof t.assignedTechnician === 'string' ? t.assignedTechnician.toLowerCase() : String(t.assignedTechnician || '').toLowerCase();
    return (
      (usernameStr && tech.includes(usernameStr)) ||
      (nameStr && tech.includes(nameStr)) ||
      tech.includes('elena') ||
      tech.includes('alex vance') ||
      !t.assignedTechnician
    );
  });

  const displayEquipment = isAdmin ? safeEquipment : (assignedEquipment.length > 0 ? assignedEquipment : safeEquipment);
  const displayTickets = isAdmin ? safeTickets : (assignedTickets.length > 0 ? assignedTickets : safeTickets);

  const criticalList = displayEquipment.filter(e => e?.failureRisk === 'CRITICAL' || e?.failureRisk === 'HIGH');
  const openTickets = displayTickets.filter(t => t?.status === 'OPEN' || t?.status === 'IN_PROGRESS');

  const avgHealth = Math.round(
    displayEquipment.reduce((acc, curr) => acc + (curr?.healthScore || 0), 0) / (displayEquipment.length || 1)
  );

  const riskCounts = {
    CRITICAL: displayEquipment.filter(e => e?.failureRisk === 'CRITICAL').length,
    HIGH: displayEquipment.filter(e => e?.failureRisk === 'HIGH').length,
    MEDIUM: displayEquipment.filter(e => e?.failureRisk === 'MEDIUM').length,
    LOW: displayEquipment.filter(e => e?.failureRisk === 'LOW').length
  };

  return (
    <div id={id || 'dashboard-page'} className="space-y-6">
      {/* Top Banner: Shift from Reactive to Predictive Maintenance */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdmin ? 'System Admin Control Paradigm Active' : 'Technician Work Order Console Active'}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              {isAdmin 
                ? 'System-Wide Laboratory Equipment Management & Reliability' 
                : 'My Assigned Equipment & Maintenance Work Orders'}
            </h1>
            <p className="text-xs text-slate-300">
              {isAdmin ? (
                <span>Overview of all {safeEquipment.length} laboratory assets, failure risk predictions, technician work order queues, and repair-vs-replace decision analytics.</span>
              ) : (
                <span>Focused console for assigned equipment monitoring, IoT sensor alerts, SLM maintenance assistance, and repair completion.</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab('assistant')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch SLM Assistant</span>
            </button>
            <button
              onClick={() => onNavigateToTab('predictions')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>View Predictions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lab Fleet Health */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fleet Reliability
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {avgHealth}%
              </span>
              <span className="text-xs text-slate-500">Mean Health</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>{equipmentList.length} Connected Instruments</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* High / Critical Risk Assets */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              At-Risk Equipment
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {criticalList.length}
              </span>
              <span className="text-xs text-slate-500">of {equipmentList.length} units</span>
            </div>
            <div className="text-[11px] text-rose-500 mt-1 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{riskCounts.CRITICAL} Critical • {riskCounts.HIGH} High</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Active Predictive Tickets */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Maintenance Tickets
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {openTickets.length}
              </span>
              <span className="text-xs text-slate-500">Pending Action</span>
            </div>
            <div className="text-[11px] text-amber-600 mt-1 font-semibold flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              <span>Auto-generated by AI engine</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        {/* Shortest Remaining Useful Life */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Minimum Est. RUL
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
                19 <span className="text-sm font-normal">hrs</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              EQ-CEN-05 (Optima XPN)
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* At-Risk Assets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Critical &amp; High Failure Risk Assets (Requires Immediate Preventive Service)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sensor anomaly detection algorithms have detected degradation before complete functional breakdown.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('equipment')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View all {displayEquipment.length} equipment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalList.map((eq) => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              onSelect={onSelectEquipment}
              onDiagnose={onDiagnoseEquipment}
              onGenerateTicket={onGenerateTicket}
              hideSlmSummary={true}
            />
          ))}
        </div>
      </div>

      {/* Fleet Failure Risk Breakdown & Recent Open Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Matrix */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Reliability Risk Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Classified by multi-parameter predictive ML model
            </p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'CRITICAL RISK', count: riskCounts.CRITICAL, color: 'bg-rose-500', text: 'text-rose-600' },
              { label: 'HIGH RISK', count: riskCounts.HIGH, color: 'bg-orange-500', text: 'text-orange-600' },
              { label: 'MEDIUM RISK', count: riskCounts.MEDIUM, color: 'bg-amber-500', text: 'text-amber-600' },
              { label: 'LOW RISK (OPTIMAL)', count: riskCounts.LOW, color: 'bg-emerald-500', text: 'text-emerald-600' }
            ].map(r => {
              const totalEq = displayEquipment.length || 1;
              const pct = Math.round((r.count / totalEq) * 100);
              return (
                <div key={r.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={r.text}>{r.label}</span>
                    <span className="font-mono">{r.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${r.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
            <strong className="text-slate-900 dark:text-white block mb-1">Predictive ML Architecture:</strong>
            Combined telemetry (temp, vibration, voltage, operating hours) + Random Forest classifier + SLM domain RAG groundings.
          </div>
        </div>

        {/* Open Predictive Maintenance Tickets */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Preventive Maintenance Queue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tickets scheduled to prevent laboratory interruptions
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('maintenance')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Manage Tickets
            </button>
          </div>

          <div className="space-y-3">
            {displayTickets.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{t.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {t.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.title}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {t.equipmentName} ({t.equipmentId}) • Assigned: {t.assignedTechnician}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {t.status}
                  </span>
                  <button
                    onClick={() => {
                      const eq = equipmentList.find(e => e.id === t.equipmentId);
                      if (eq) onDiagnoseEquipment(eq);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-100"
                  >
                    SLM Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
