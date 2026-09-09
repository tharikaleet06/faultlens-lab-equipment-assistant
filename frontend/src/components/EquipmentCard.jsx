import React, { useState } from 'react';
import { RiskBadge } from './RiskBadge';
import { 
  Wrench, 
  Bot, 
  MapPin, 
  Clock, 
  Sparkles, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  X,
  FileText,
  CheckCircle2
} from 'lucide-react';

export const getSLMShortDescription = (equipment) => {
  if (!equipment) return '';
  const err = equipment.activeErrorCode;
  if (err === 'E45' || equipment.id === 'EQ-3D-01') {
    return 'SLM AI Diagnosis (E45): Thermal gradient delta exceeds 18.5°C due to micro-channel chiller loop restriction. Perform closed-loop glycol flush (CLN-GLY-44) and clean radiator fins.';
  }
  if (err === 'E12' || equipment.id === 'EQ-CNC-04') {
    return 'SLM AI Diagnosis (E12): Spindle bearing radial harmonic resonance (>5.1 mm/s) indicates raceway micro-spalling. Replace angular contact ceramic bearing set (SPN-BRG-88).';
  }
  if (err === 'E77' || equipment.id === 'EQ-CEN-05') {
    return 'SLM AI Diagnosis (E77): Vacuum diffusion pump seal degradation causing vacuum loss. Replace oil-mist coalescing exhaust filter (FLT-VAK-19) and re-seal flange.';
  }
  if (err === 'E24' || equipment.id === 'EQ-OSC-07') {
    return 'SLM AI Diagnosis (E24): Channel 5-8 power stage DC ripple voltage drift exceeding 600mV. Replace low-ESR 2200uF capacitor pack (CAP-48V-220).';
  }
  if (err === 'E88' || equipment.id === 'EQ-NMR-06') {
    return 'SLM AI Diagnosis (E88): Superconducting magnet cryoprobe thermal shield delta > 12.4°C causing accelerated helium boil-off. Replace liquid helium transfer line vacuum gasket (CRYO-GST-99) and re-pump vacuum jacket.';
  }
  if (err === 'E92' || equipment.id === 'EQ-LMS-10') {
    return 'SLM AI Diagnosis (E92): Ion mobility drift cell RF multipole phase instability & ESI capillary erosion. Replace ESI emitter assembly (ESI-CAP-12) and recalibrate RF generator.';
  }
  if (err === 'E63' || equipment.id === 'EQ-XRD-08') {
    return 'SLM AI Diagnosis (E63): Rotating anode ferrofluidic vacuum seal leak causing target overheating. Replace ferrofluidic seal cartridge (FER-VAK-88) and flush anode chiller loop.';
  }
  if (equipment.predictedIssue) {
    return `SLM AI Diagnosis: ${equipment.predictedIssue}. Real-time edge telemetry monitoring active. Inspect primary subsystem during next scheduled maintenance window.`;
  }
  return `SLM AI Diagnosis: Nominal operating parameters. Health Score: ${equipment.healthScore || 90}%. No active error codes or immediate maintenance actions required.`;
};

export const EquipmentCard = ({
  equipment,
  onSelect,
  onDiagnose,
  onGenerateTicket,
  hideSlmSummary = false,
  id
}) => {
  const [showSlmModal, setShowSlmModal] = useState(false);

  const getHealthBorder = (score) => {
    if (score >= 80) return 'border-emerald-200 dark:border-emerald-800/60';
    if (score >= 65) return 'border-amber-200 dark:border-amber-800/60';
    if (score >= 50) return 'border-orange-200 dark:border-orange-800/60';
    return 'border-rose-300 dark:border-rose-800';
  };

  const slmSummary = getSLMShortDescription(equipment);

  return (
    <>
      <div
        id={id || `equipment-card-${equipment?.id?.toLowerCase()}`}
        className={`bg-white dark:bg-slate-900 rounded-xl p-5 border transition-all duration-200 hover:shadow-md ${getHealthBorder(equipment?.healthScore)} flex flex-col justify-between cursor-pointer`}
        onClick={(e) => {
          if (!e.target.closest('button')) {
            setShowSlmModal(true);
          }
        }}
      >
        <div>
          {/* Header with Risk, Priority Score & Category */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {equipment?.id}
                </span>
                {equipment?.deviceTypeCode && (
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {equipment.deviceTypeCode}
                  </span>
                )}
                {equipment?.priorityScore !== undefined && (
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Priority: {equipment.priorityScore}
                  </span>
                )}
              </div>
              <h3 
                className="text-base font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Click to view SLM Short Description"
              >
                {equipment?.name}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <RiskBadge risk={equipment?.failureRisk} size="sm" />
              {equipment?.recommendation && (
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                  equipment.recommendation === 'REPLACE EQUIPMENT' ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800' :
                  equipment.recommendation === 'REPLACE COMPONENT' ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800' :
                  equipment.recommendation === 'REPAIR WITH CAUTION' ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' :
                  'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                }`}>
                  {equipment.recommendation}
                </span>
              )}
            </div>
          </div>

          {/* Details snippet */}
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">Manufacturer:</span>
              <span>{equipment?.manufacturer} ({equipment?.model})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{equipment?.labRoom} • {equipment?.location || equipment?.labLocation || 'Lab Core'}</span>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{equipment?.operatingHours ? equipment.operatingHours.toLocaleString() : 0} hrs</span>
              </span>
            </div>
          </div>

          {/* SLM Short Description Box */}
          {!hideSlmSummary && (
            <div 
              className="bg-indigo-50/70 dark:bg-indigo-950/40 p-3 rounded-lg mb-4 border border-indigo-100 dark:border-indigo-900/50 cursor-pointer hover:bg-indigo-100/60 dark:hover:bg-indigo-950/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowSlmModal(true);
              }}
              title="Click to view full SLM AI Diagnostic Note"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>SLM Short Description:</span>
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.5 rounded">
                  AI Grounded
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {slmSummary}
              </p>
            </div>
          )}

          {/* Live Health and Anomaly status block */}
          <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-lg mb-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Health Score</span>
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                {equipment?.healthScore}%
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  (equipment?.healthScore || 0) >= 80
                    ? 'bg-emerald-500'
                    : (equipment?.healthScore || 0) >= 65
                    ? 'bg-amber-500'
                    : (equipment?.healthScore || 0) >= 50
                    ? 'bg-orange-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${equipment?.healthScore || 0}%` }}
              />
            </div>

            {/* Active Error Code banner */}
            {equipment?.activeErrorCode && (
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Active Error Code: {equipment.activeErrorCode}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className={`grid ${hideSlmSummary ? 'grid-cols-2' : 'grid-cols-3'} gap-2 pt-2 border-t border-slate-100 dark:border-slate-800`}>
          <button
            id={`btn-view-${equipment?.id?.toLowerCase()}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(equipment);
            }}
            className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {!hideSlmSummary && (
            <button
              id={`btn-diagnose-${equipment?.id?.toLowerCase()}`}
              onClick={(e) => {
                e.stopPropagation();
                onDiagnose(equipment);
              }}
              className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>SLM Assist</span>
            </button>
          )}

          <button
            id={`btn-ticket-${equipment?.id?.toLowerCase()}`}
            onClick={(e) => {
              e.stopPropagation();
              onGenerateTicket(equipment);
            }}
            className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/60 transition-colors"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>AI Ticket</span>
          </button>
        </div>
      </div>

      {/* Quick SLM Short Description Modal */}
      {showSlmModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowSlmModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-indigo-200 dark:border-indigo-900 space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    SLM AI Diagnostic Short Summary
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {equipment?.name} ({equipment?.id})
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setShowSlmModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal SLM Content */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {slmSummary}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Health &amp; Risk</div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{equipment?.healthScore}% Health</span>
                    <RiskBadge risk={equipment?.failureRisk} size="sm" />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Active Error Code</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {equipment?.activeErrorCode ? (
                      <span className="text-rose-600 dark:text-rose-400 font-mono">{equipment.activeErrorCode}</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> None (Nominal)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setShowSlmModal(false);
                  onSelect(equipment);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Telemetry &amp; Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
