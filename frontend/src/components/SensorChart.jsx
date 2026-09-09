import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { Activity, Thermometer, Waves, Zap } from 'lucide-react';

export const SensorChart = ({
  telemetry,
  thresholds,
  equipmentName,
  id
}) => {
  const [activeMetric, setActiveMetric] = useState('temperature');

  const safeThresholds = thresholds || {
    tempWarning: 65,
    tempCritical: 80,
    vibrationWarning: 2.5,
    vibrationCritical: 4.5,
    voltageMin: 110,
    voltageMax: 130,
    currentMax: 15
  };

  const metricConfigs = {
    temperature: {
      label: 'Temperature',
      unit: '°C',
      dataKey: 'temperature',
      color: '#f97316',
      icon: Thermometer,
      warning: safeThresholds.tempWarning,
      critical: safeThresholds.tempCritical,
      minY: 20,
      maxY: Math.max(90, (safeThresholds.tempCritical || 80) + 10)
    },
    vibration: {
      label: 'Vibration RMS',
      unit: 'mm/s',
      dataKey: 'vibration',
      color: '#8b5cf6',
      icon: Waves,
      warning: safeThresholds.vibrationWarning,
      critical: safeThresholds.vibrationCritical,
      minY: 0,
      maxY: Math.max(6, (safeThresholds.vibrationCritical || 4) + 1.5)
    },
    voltage: {
      label: 'AC/DC Voltage',
      unit: 'V',
      dataKey: 'voltage',
      color: '#0ea5e9',
      icon: Zap,
      warning: safeThresholds.voltageMin,
      critical: safeThresholds.voltageMax,
      minY: Math.floor((safeThresholds.voltageMin || 110) * 0.9),
      maxY: Math.ceil((safeThresholds.voltageMax || 130) * 1.1)
    },
    current: {
      label: 'Current Draw',
      unit: 'A',
      dataKey: 'current',
      color: '#10b981',
      icon: Activity,
      warning: (safeThresholds.currentMax || 15) * 0.85,
      critical: safeThresholds.currentMax || 15,
      minY: 0,
      maxY: Math.ceil((safeThresholds.currentMax || 15) * 1.25)
    }
  };

  const currentConfig = metricConfigs[activeMetric];

  return (
    <div
      id={id || 'sensor-chart-card'}
      className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Sensor Telemetry Ingestion
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {currentConfig.label} Time-Series Waveform
          </h3>
        </div>

        {/* Tab metric selectors */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {['temperature', 'vibration', 'voltage', 'current'].map(key => {
            const cfg = metricConfigs[key];
            const Icon = cfg.icon;
            const isSelected = activeMetric === key;
            return (
              <button
                key={key}
                id={`btn-metric-${key}`}
                onClick={() => setActiveMetric(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={telemetry || []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis
              domain={[currentConfig.minY, currentConfig.maxY]}
              unit={` ${currentConfig.unit}`}
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-lg border border-slate-700">
                      <div className="font-bold text-slate-300 mb-1">{label}</div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-orange-400 font-bold">
                          {currentConfig.label}: {dataPoint[activeMetric]} {currentConfig.unit}
                        </span>
                      </div>
                      {dataPoint.anomalyDetected && (
                        <div className="mt-2 text-rose-400 font-semibold border-t border-slate-700 pt-1">
                          ⚠️ Anomaly: {dataPoint.anomalyReason || 'Out of threshold bounds'}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Warning threshold */}
            {currentConfig.warning && (
              <ReferenceLine
                y={currentConfig.warning}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: `Warning (${currentConfig.warning}${currentConfig.unit})`, fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }}
              />
            )}
            {/* Critical threshold */}
            {currentConfig.critical && (
              <ReferenceLine
                y={currentConfig.critical}
                stroke="#ef4444"
                strokeDasharray="2 2"
                label={{ value: `Critical (${currentConfig.critical}${currentConfig.unit})`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
              />
            )}
            <Line
              type="monotone"
              dataKey={currentConfig.dataKey}
              stroke={currentConfig.color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: currentConfig.color }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Stats footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentConfig.color }} />
            <span>Real-time stream ({equipmentName})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500" />
            <span>Warning Limit: {currentConfig.warning} {currentConfig.unit}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500" />
            <span>Critical Trip: {currentConfig.critical} {currentConfig.unit}</span>
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Sample frequency: 1000ms • Edge Sensor Daemon UP
        </div>
      </div>
    </div>
  );
};
