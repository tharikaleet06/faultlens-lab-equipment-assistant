import React, { useState } from 'react';
import { HealthCard } from '../components/HealthCard';
import { SensorChart } from '../components/SensorChart';
import { RiskBadge } from '../components/RiskBadge';
import { 
  ArrowLeft, 
  Wrench, 
  Bot, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Sliders, 
  Zap, 
  FileText,
  CheckCircle,
  Thermometer,
  Waves,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Gauge,
  HelpCircle
} from 'lucide-react';

import { getSLMShortDescription } from '../components/EquipmentCard';
import { DEVICE_TAXONOMY, DEFAULT_EQUIPMENT } from '../services/api';
import { INITIAL_EQUIPMENT } from '../data/labData';

export const EquipmentDetails = ({
  equipment = {},
  onBack,
  onDiagnose,
  onGenerateTicket,
  onInjectTelemetry,
  id
}) => {
  const safeEq = equipment || {};

  const deviceTypeCode = safeEq.deviceTypeCode || '3D_PRINTER';
  const activeSensors = DEVICE_TAXONOMY[deviceTypeCode]?.sensors || safeEq.deviceSensors || [];

  // Dynamic telemetry simulator state for active device sensors
  const [simValues, setSimValues] = useState(() => {
    const initial = {};
    activeSensors.forEach((s) => {
      initial[s.code] = safeEq.currentTelemetryValues?.[s.code] ?? ((s.defaultNormal[0] + s.defaultNormal[1]) / 2);
    });
    return initial;
  });

  const safeThresholds = safeEq.thresholds || {
    tempWarning: 65,
    tempCritical: 80,
    vibrationWarning: 2.5,
    vibrationCritical: 4.5,
    voltageMin: 110,
    voltageMax: 130,
    currentMax: 15
  };

  const matchId = (safeEq.id || '').toUpperCase();
  const labMatch = INITIAL_EQUIPMENT.find(e => (e.id || '').toUpperCase() === matchId);
  const apiMatch = DEFAULT_EQUIPMENT.find(e => (e.id || '').toUpperCase() === matchId);
  const matchedEq = labMatch || apiMatch || {};

  const safeTelemetryHistory = (Array.isArray(safeEq.telemetryHistory) && safeEq.telemetryHistory.length > 0)
    ? safeEq.telemetryHistory
    : (Array.isArray(matchedEq.telemetryHistory) && matchedEq.telemetryHistory.length > 0)
    ? matchedEq.telemetryHistory
    : [
        { timestamp: '08:00', temperature: 42, vibration: 1.1, voltage: 120, current: 8.0 },
        { timestamp: '09:00', temperature: 45, vibration: 1.2, voltage: 120.2, current: 8.2 },
        { timestamp: '10:00', temperature: 48, vibration: 1.3, voltage: 120.1, current: 8.4 },
        { timestamp: '11:00', temperature: 52, vibration: 1.5, voltage: 120.4, current: 8.6 },
        { timestamp: '12:00', temperature: 55, vibration: 1.7, voltage: 120.3, current: 8.8 },
        { timestamp: '13:00', temperature: 58, vibration: 1.8, voltage: 120.0, current: 9.0 }
      ];

  const safeMaintenanceHistory = (Array.isArray(safeEq.maintenanceHistory) && safeEq.maintenanceHistory.length > 0)
    ? safeEq.maintenanceHistory
    : (Array.isArray(matchedEq.maintenanceHistory) && matchedEq.maintenanceHistory.length > 0)
    ? matchedEq.maintenanceHistory
    : [
        {
          id: `MNT-${matchId.replace('EQ-', '') || 'GEN'}-101`,
          date: safeEq.installationDate || '2025-03-15',
          type: 'PREVENTIVE',
          technician: 'Dr. Elena Rostova',
          description: `Scheduled preventive maintenance and NIST traceable sensor calibration for ${safeEq.name || 'Equipment'}.`,
          partsReplaced: [`${safeEq.manufacturer || 'OEM'} Maintenance Kit`],
          downtimeHours: 2.0,
          costEstimate: 250
        }
      ];

  const slmShortDescription = getSLMShortDescription(safeEq);

  // Financial Repair vs Replace Decision Engine Calculation
  const originalCost = safeEq.originalCostUsd || 35000.0;
  const repairCost = safeEq.cumulativeRepairCostUsd || 4500.0;
  const costRatio = Math.round((repairCost / originalCost) * 100);
  const recommendation = safeEq.recommendation || (costRatio > 100 ? 'REPLACE EQUIPMENT' : costRatio > 65 ? 'REPLACE COMPONENT' : costRatio > 40 ? 'REPAIR WITH CAUTION' : 'REPAIR');
  const priorityScore = safeEq.priorityScore ?? 75;

  const handleApplySimulation = () => {
    if (onInjectTelemetry && safeEq.id) {
      onInjectTelemetry(safeEq.id, simValues);
    }
  };

  const getRecommendationBadgeStyle = (rec) => {
    switch (rec) {
      case 'REPLACE EQUIPMENT':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800';
      case 'REPLACE COMPONENT':
        return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-800';
      case 'REPAIR WITH CAUTION':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800';
      case 'REPAIR':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800';
      case 'MONITOR':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div id={id || `equipment-details-${(safeEq.id || 'eq').toLowerCase()}`} className="space-y-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Equipment Fleet</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Priority Score Pill */}
          <div className="px-3 py-1.5 rounded-lg bg-purple-900/10 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Priority Score: {priorityScore}/100</span>
          </div>

          <button
            onClick={() => onDiagnose && onDiagnose(safeEq)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Diagnose with SLM</span>
          </button>
          <button
            onClick={() => onGenerateTicket && onGenerateTicket(safeEq)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Generate Ticket</span>
          </button>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {safeEq.id || 'EQ-001'}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono">
                {deviceTypeCode}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {safeEq.category || 'Laboratory Instrument'}
              </span>
              <RiskBadge risk={safeEq.failureRisk || 'LOW'} size="md" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {safeEq.name || 'Laboratory Equipment'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Manufacturer: <strong>{safeEq.manufacturer || 'Lab OEM'}</strong></span>
              <span>Model: <strong>{safeEq.model || 'Standard Edition'}</strong></span>
              <span>Serial: <strong className="font-mono">{safeEq.serialNumber || 'SN-2023-000'}</strong></span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{safeEq.labRoom || 'Lab 101'} ({safeEq.location || safeEq.labLocation || 'Main Core'})</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Installed: {safeEq.installDate || safeEq.installationDate || '2023-01-15'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Financial Decision Engine: REPAIR vs REPLACE Recommendation Banner */}
        <div className={`p-4 rounded-xl border ${getRecommendationBadgeStyle(recommendation)} space-y-2`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-wider">
                Financial Decision Engine: {recommendation}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span>Asset Cost: ${originalCost.toLocaleString()}</span>
              <span>•</span>
              <span>Repairs: ${repairCost.toLocaleString()}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                Repair Ratio: {costRatio}%
              </span>
            </div>
          </div>
          <p className="text-xs font-medium leading-relaxed opacity-90">
            {costRatio > 100 
              ? `CRITICAL CAPITAL ALLOCATION: Cumulative maintenance repair expenditure ($${repairCost.toLocaleString()}) has exceeded 100% of the original asset acquisition cost ($${originalCost.toLocaleString()}). Full equipment replacement recommended to minimize unplanned laboratory downtime.`
              : costRatio > 65
              ? `WARNING: High repair cost ratio (${costRatio}% of original asset value). Targeted component replacement (subsystem rebuild) advised over recurring patch repairs.`
              : `STABLE ASSET METRICS: Maintenance repair ratio is nominal (${costRatio}%). Standard preventive maintenance protocol recommended.`}
          </p>
        </div>

        {/* SLM Short Description Banner */}
        <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Bot className="w-5 h-5" />
          </span>
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
              <span>SLM AI Short Description &amp; Grounded Technical Diagnostics</span>
              <span className="text-[10px] font-semibold bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                Grounded Knowledge Base
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {slmShortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Diagnostics & Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HealthCard
            score={safeEq.healthScore ?? 85}
            risk={safeEq.failureRisk || 'LOW'}
            rulHours={safeEq.predictedRulHours || safeEq.remainingUsefulLifeHours || 240}
            operatingHours={safeEq.operatingHours || 3200}
            activeErrorCode={safeEq.activeErrorCode}
          />

          {/* Predicted issue card */}
          <div className="mt-4 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs">
            <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Predictive ML Root Cause Diagnosis:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {safeEq.predictedIssue || 'Nominal operating parameters; continuous real-time edge telemetry normal.'}
            </p>
          </div>
        </div>

        {/* Live Chart */}
        <div className="lg:col-span-2">
          <SensorChart
            telemetry={safeTelemetryHistory}
            thresholds={safeThresholds}
            equipmentName={safeEq.name || 'Equipment'}
          />
        </div>
      </div>

      {/* Dynamic Device-Specific Sensor Telemetry Injector */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Real-Time Edge Telemetry Simulator ({DEVICE_TAXONOMY[deviceTypeCode]?.name || deviceTypeCode})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only applicable physical sensors for this device type are loaded. No universal/generic metrics.
            </p>
          </div>
          <button
            onClick={handleApplySimulation}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Inject Sensor Telemetry</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {activeSensors.length === 0 ? (
            <div className="col-span-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 font-mono text-center">
              Threshold unavailable for this sensor/device
            </div>
          ) : (
            activeSensors.map((sensor) => {
              const currentVal = simValues[sensor.code] ?? sensor.defaultNormal[0];
              const minVal = Math.min(sensor.defaultNormal[0], sensor.defaultCritical[0]);
              const maxVal = Math.max(sensor.defaultNormal[1], sensor.defaultCritical[1]);
              const rangeSpan = Math.abs(maxVal - minVal) || 10;
              const sliderMin = Math.max(0, Math.floor(minVal - rangeSpan * 0.2));
              const sliderMax = Math.ceil(maxVal + rangeSpan * 0.2);

              return (
                <div key={sensor.code} className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start text-xs font-semibold">
                    <div>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[10px] font-bold">
                        {sensor.code}
                      </span>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 font-bold mt-1 line-clamp-1">
                        {sensor.name}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      {currentVal} <span className="text-xs text-slate-400 font-normal">{sensor.unit}</span>
                    </span>
                  </div>

                  <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    step={sensor.unit === 'Pa' ? '0.0001' : sensor.unit === 'mm/s' ? '0.05' : '0.5'}
                    value={currentVal}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSimValues((prev) => ({ ...prev, [sensor.code]: val }));
                    }}
                    className="w-full accent-indigo-600"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Warn: {sensor.defaultWarning[0]}-{sensor.defaultWarning[1]}</span>
                    <span>Crit: {sensor.defaultCritical[0]}+</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Maintenance History Records */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span>Historical Maintenance &amp; Service Records</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Record ID</th>
                <th className="p-3">Service Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Description &amp; Action</th>
                <th className="p-3">Technician</th>
                <th className="p-3">Parts Replaced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {safeMaintenanceHistory.map((rec, idx) => (
                <tr key={rec.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-mono font-semibold text-slate-700 dark:text-slate-300">{rec.id}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{rec.date}</td>
                  <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">{rec.type}</td>
                  <td className="p-3 text-slate-800 dark:text-slate-200">{rec.description}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{rec.technician}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{Array.isArray(rec.partsReplaced) ? rec.partsReplaced.join(', ') : (rec.partsReplaced || 'None')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
