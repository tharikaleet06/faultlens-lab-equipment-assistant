import React, { useState } from 'react';
import { 
  Wrench, 
  Package, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  User, 
  Check
} from 'lucide-react';

export const TicketCard = ({
  ticket,
  onStatusChange,
  id
}) => {
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const priorityStyles = {
    'P1 - CRITICAL': 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    'P2 - HIGH': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    'P3 - MEDIUM': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    'P4 - LOW': 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  const statusColors = {
    OPEN: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
    SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
  };

  const handleResolve = () => {
    onStatusChange(ticket.id, 'RESOLVED', resolutionNotes || 'Service completed. Baseline sensors verified.');
    setIsResolving(false);
  };

  return (
    <div
      id={id || `ticket-card-${ticket.id.toLowerCase()}`}
      className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              {ticket.id}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-bold border ${priorityStyles[ticket.priority] || priorityStyles['P4 - LOW']}`}>
              {ticket.priority}
            </span>
            {ticket.generatedByAI && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-300 font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>AI Auto-Generated</span>
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {ticket.title}
          </h3>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Target Equipment: <span className="font-semibold text-slate-900 dark:text-slate-100">{ticket.equipmentName}</span> ({ticket.equipmentId})
          </p>
        </div>

        {/* Dynamic Read-only Status Badge (Manual status changes forbidden) */}
        <div className="flex items-center gap-2">
          <span
            title="Status changes dynamically based on technician repair logging and AI health verification"
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${statusColors[ticket.status] || statusColors.OPEN} ${
              ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : ''
            }`}
          >
            Status: {ticket.status === 'IN_PROGRESS' ? 'IN PROGRESS' : ticket.status} {ticket.status === 'RESOLVED' ? '(Locked)' : ''}
          </span>
        </div>
      </div>

      {/* Problem Description */}
      <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
        <strong className="text-slate-900 dark:text-white block mb-1">Problem Description:</strong>
        {ticket.problemDescription}
      </div>

      {/* Suggested Spare Parts */}
      {ticket.suggestedSpareParts && ticket.suggestedSpareParts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Package className="w-3.5 h-3.5 text-indigo-500" />
            <span>Required Spare Parts (Auto-Queried from Inventory):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ticket.suggestedSpareParts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white font-mono">{p.partNumber}</div>
                  <div className="text-slate-500 text-[11px]">{p.name}</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.inStock ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'}`}>
                    {p.inStock ? 'In Stock' : 'Ordered'}
                  </span>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">${p.estimatedCost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Technician Actions */}
      {ticket.recommendedTechnicianAction && ticket.recommendedTechnicianAction.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
            <span>Recommended Technician Action Checklist:</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            {ticket.recommendedTechnicianAction.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>Assigned: <strong>{ticket.assignedTechnician || 'Unassigned'}</strong></span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled: {ticket.scheduledDate || 'TBD'}</span>
          </span>
        </div>

        {ticket.status === 'RESOLVED' ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Repair Logged &amp; Verified</span>
          </span>
        ) : (
          <button
            onClick={() => onStatusChange && onStatusChange(ticket.id, 'RESOLVED', 'Service completed. Baseline sensors verified.')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Complete service and run AI condition verification model"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete &amp; Run AI Verification</span>
          </button>
        )}
      </div>
    </div>
  );
};
