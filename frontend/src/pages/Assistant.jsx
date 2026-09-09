import React, { useState } from 'react';
import { aiService, DEVICE_TAXONOMY } from '../services/api';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Wrench, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileText,
  Clock,
  Check,
  Package,
  Layers,
  Gauge,
  ShieldAlert,
  DollarSign
} from 'lucide-react';

export const AssistantPage = ({
  equipmentList = [],
  preselectedEquipment,
  onTicketCreated,
  id
}) => {
  const safeEquipment = Array.isArray(equipmentList) ? equipmentList : [];

  const [selectedEqId, setSelectedEqId] = useState(
    preselectedEquipment?.id || safeEquipment[0]?.id || 'EQ-3D-01'
  );
  const [query, setQuery] = useState(
    preselectedEquipment?.activeErrorCode
      ? `Equipment ${preselectedEquipment.name || ''} (${preselectedEquipment.id}) is throwing error code ${preselectedEquipment.activeErrorCode}. What are the root causes and step-by-step resolution?`
      : `How do I diagnose and perform preventive maintenance on ${preselectedEquipment?.name || '3D Printer'} (${preselectedEquipment?.id || 'EQ-3D-01'})?`
  );
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  React.useEffect(() => {
    if (preselectedEquipment?.id) {
      setSelectedEqId(preselectedEquipment.id);
      if (preselectedEquipment.activeErrorCode) {
        setQuery(`Equipment ${preselectedEquipment.name || ''} (${preselectedEquipment.id}) is throwing error code ${preselectedEquipment.activeErrorCode}. What are the root causes and step-by-step resolution?`);
      } else {
        setQuery(`How do I diagnose and perform preventive maintenance on ${preselectedEquipment.name || ''} (${preselectedEquipment.id})?`);
      }
    }
  }, [preselectedEquipment]);

  const selectedEquipment = safeEquipment.find((e) => e?.id === selectedEqId);

  const sampleQueries = [
    {
      eqId: 'EQ-3D-01',
      title: '3D Printer Error E45 (Chiller failure)',
      prompt: 'The Formlabs 3D printer is showing error E45. What should I check?'
    },
    {
      eqId: 'EQ-CNC-04',
      title: 'CNC Mill Error E12 (Spindle harmonics)',
      prompt: 'Haas CNC mill has high vibration on the spindle (error E12). How do I diagnose?'
    },
    {
      eqId: 'EQ-CEN-05',
      title: 'Centrifuge Error E77 (Vacuum pump trip)',
      prompt: 'Ultracentrifuge vacuum pump failure (error E77) - what parts do I need?'
    },
    {
      eqId: 'EQ-OSC-07',
      title: 'Oscilloscope Error E24 (DC ripple drift)',
      prompt: 'Keysight Oscilloscope shows error E24 power stage ripple. What is the repair procedure?'
    }
  ];

  const handleAskAssistant = async (customQuery) => {
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setTicketSuccess(false);

    try {
      const res = await aiService.diagnose(
        activeQuery,
        selectedEqId,
        selectedEquipment?.activeErrorCode
      );
      setDiagnosisResult(res);
    } catch (err) {
      console.error('Diagnosis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCreateTicket = async () => {
    if (!diagnosisResult || !selectedEquipment) return;

    try {
      const ticket = await aiService.generateAutonomousTicket(selectedEquipment.id);
      onTicketCreated(ticket);
      setTicketSuccess(true);
      setTimeout(() => setTicketSuccess(false), 4000);
    } catch (e) {
      console.error('Failed to create ticket:', e);
    }
  };

  return (
    <div id={id || 'assistant-page'} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-7 h-7 text-indigo-600" />
            <span>SLM Maintenance &amp; Diagnostic Assistant</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Combines Sensor Data + Maintenance History + Equipment Manuals (RAG) + Error Logs + Small Language Model
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-300">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manuals Grounded (RAG)</span>
        </div>
      </div>

      {/* Query Bar & Equipment Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Equipment Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Laboratory Equipment:
            </label>
            <select
              value={selectedEqId}
              onChange={(e) => {
                setSelectedEqId(e.target.value);
                setDiagnosisResult(null);
              }}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {safeEquipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.id} - {eq.name} ({eq.failureRisk} RISK)
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Input & Send */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Technician Problem / Symptom Query:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
                placeholder="Ask SLM: 'The 3D printer is showing error E45. What should I check?'"
                className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                id="btn-ask-slm"
                onClick={() => handleAskAssistant()}
                disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                {loading ? (
                  <span>Synthesizing...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Run SLM Assistant</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick query chips */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 mb-2">
            Quick Diagnostic Scenarios (Problem Statement Pre-sets):
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedEqId(sq.eqId);
                  setQuery(sq.prompt);
                  setDiagnosisResult(null);
                }}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-left"
              >
                {sq.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Equipment Snapshot Card */}
      {selectedEquipment && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedEquipment.id}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedEquipment.name}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">{selectedEquipment.location || selectedEquipment.labLocation || 'Lab Core'}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-600 dark:text-slate-300">
              Temp: <strong>{selectedEquipment.currentTelemetry?.temperature ?? 45.0}°C</strong>
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              Vibration: <strong>{selectedEquipment.currentTelemetry?.vibration ?? 1.5} mm/s</strong>
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              Runtime: <strong>{selectedEquipment.operatingHours ? selectedEquipment.operatingHours.toLocaleString() : 0} hrs</strong>
            </span>
            {selectedEquipment.activeErrorCode && (
              <span className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                Active: {selectedEquipment.activeErrorCode}
              </span>
            )}
          </div>
        </div>
      )}

      {/* SLM Structured Response Output */}
      {diagnosisResult && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-indigo-200 dark:border-indigo-900/60 shadow-md space-y-6">
          {/* Header & Urgency Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Bot className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  SLM Diagnostic &amp; Resolution Report
                </h2>
                <p className="text-xs text-slate-500">
                  Target: {diagnosisResult.equipmentName || selectedEquipment?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  diagnosisResult.urgencyLevel === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {diagnosisResult.urgencyLevel} URGENCY
              </span>

              <button
                id="btn-auto-create-ticket"
                onClick={handleAutoCreateTicket}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {ticketSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ticket Logged!</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4" />
                    <span>Auto-Schedule Maintenance Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Decision Engine & Priority Score Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority Score Card */}
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-purple-600" />
                  <span>Multi-Factor Priority Score</span>
                </span>
                <span className="text-sm font-black font-mono px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
                  {selectedEquipment?.priorityScore ?? 82} / 100
                </span>
              </div>
              <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 leading-relaxed font-medium">
                Combines sensor threshold breach severity + ML anomaly confidence + asset health decline + criticality tier + repair cost ratio.
              </p>
            </div>

            {/* Repair vs Replace Recommendation Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Repair vs. Replace Engine</span>
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                  selectedEquipment?.recommendation === 'REPLACE EQUIPMENT' ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300' :
                  selectedEquipment?.recommendation === 'REPLACE COMPONENT' ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300' :
                  'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {selectedEquipment?.recommendation || 'REPAIR'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Original Cost: ${selectedEquipment?.originalCostUsd ? selectedEquipment.originalCostUsd.toLocaleString() : '18,500'} • Cumulative Repairs: ${selectedEquipment?.cumulativeRepairCostUsd ? selectedEquipment.cumulativeRepairCostUsd.toLocaleString() : '4,200'} ({Math.round(((selectedEquipment?.cumulativeRepairCostUsd || 4200) / (selectedEquipment?.originalCostUsd || 18500)) * 100)}% ratio).
              </p>
            </div>
          </div>

          {/* Section 1: Diagnosis */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Root-Cause Diagnosis
            </span>
            <div className="text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {diagnosisResult.diagnosis}
            </div>
          </div>

          {/* Section 2: Possible Causes */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Possible Causes (Ranked by Likelihood)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {diagnosisResult.possibleCauses?.map((cause, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{cause}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recommended Checks */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Recommended Technician Checks (Before Disassembly)
            </span>
            <div className="space-y-1.5">
              {diagnosisResult.recommendedChecks?.map((check, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Resolution Steps */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              4. Step-by-Step Resolution Protocol
            </span>
            <div className="space-y-2">
              {diagnosisResult.resolution?.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-800 dark:text-slate-200 font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Suggested Spare Parts & Official Manual Citations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Spare Parts */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Package className="w-4 h-4 text-indigo-500" />
                <span>Suggested Consumables &amp; Spare Parts:</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {diagnosisResult.suggestedSpareParts?.map((part, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{part}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Manual Citations */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>RAG Verified Manual Citations:</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {diagnosisResult.manualCitations?.map((cit, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cit.title}:</span>{' '}
                    <span>{cit.section}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
