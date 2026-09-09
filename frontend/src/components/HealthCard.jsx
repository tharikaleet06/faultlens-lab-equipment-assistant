import React from 'react';
import { Activity, Clock, AlertTriangle } from 'lucide-react';

export const HealthCard = ({
  score,
  risk,
  rulHours,
  operatingHours,
  activeErrorCode,
  id
}) => {
  // Score color spectrum
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (val >= 65) return 'text-amber-600 dark:text-amber-400';
    if (val >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getStrokeColor = (val) => {
    if (val >= 80) return '#10b981';
    if (val >= 65) return '#f59e0b';
    if (val >= 50) return '#f97316';
    return '#e11d48';
  };

  const strokeDash = `${(score / 100) * 283} 283`;

  return (
    <div
      id={id || 'health-card'}
      className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Asset Health &amp; Reliability
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            Diagnostic Health Score
          </h4>
        </div>
        {activeErrorCode && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Code {activeErrorCode}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Radial progress ring */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
              className="dark:stroke-slate-800"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getStrokeColor(score)}
              strokeWidth="8"
              strokeDasharray={strokeDash}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-2xl font-black ${getScoreColor(score)}`}>
              {score}%
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500">
              Health
            </span>
          </div>
        </div>

        {/* Predictive metrics */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Est. RUL</span>
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {rulHours} <span className="text-xs font-normal text-slate-500">hrs</span>
            </div>
            <div className="text-[11px] text-slate-400">Remaining useful life</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Runtime</span>
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {operatingHours ? operatingHours.toLocaleString() : 0} <span className="text-xs font-normal text-slate-500">hrs</span>
            </div>
            <div className="text-[11px] text-slate-400">Total logged hours</div>
          </div>
        </div>
      </div>
    </div>
  );
};
