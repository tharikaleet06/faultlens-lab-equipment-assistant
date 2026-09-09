import React from 'react';

export const RiskBadge = ({ risk, size = 'md', id }) => {
  const styles = {
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse'
  };

  const dotColors = {
    LOW: 'bg-emerald-500',
    MEDIUM: 'bg-amber-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-rose-600'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  };

  return (
    <span
      id={id || `risk-badge-${risk ? risk.toLowerCase() : 'unknown'}`}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${styles[risk] || styles.LOW} ${sizeClasses[size]} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[risk] || dotColors.LOW}`} />
      <span>{risk} RISK</span>
    </span>
  );
};
