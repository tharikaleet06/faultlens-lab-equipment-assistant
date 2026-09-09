import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Check, 
  CheckCheck, 
  Filter, 
  Clock, 
  Cpu, 
  Wrench, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';

export const NotificationsPage = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectEquipment,
  id
}) => {
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ'
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const filteredNotifications = safeNotifications.filter(n => {
    const matchesReadTab = 
      filterTab === 'ALL' ? true :
      filterTab === 'UNREAD' ? !n.isRead :
      filterTab === 'READ' ? n.isRead : true;

    const matchesSeverity = 
      severityFilter === 'ALL' ? true : n.severity === severityFilter;

    return matchesReadTab && matchesSeverity;
  });

  const unreadCount = safeNotifications.filter(n => !n.isRead).length;

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
          icon: <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        };
      case 'INFO':
      default:
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60',
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300',
          icon: <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
        };
    }
  };

  return (
    <div id={id || 'notifications-page'} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500" />
            <span>Role-Based Notifications &amp; System Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time event alerts filtered by user role, equipment assignments, and maintenance ticket lifecycles
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All ({unreadCount}) as Read</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Read State Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg font-semibold">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filterTab === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({safeNotifications.length})
          </button>
          <button
            onClick={() => setFilterTab('UNREAD')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filterTab === 'UNREAD'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilterTab('READ')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filterTab === 'READ'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Read ({safeNotifications.length - unreadCount})
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-500">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="WARNING">WARNING</option>
            <option value="INFO">INFO</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const style = getSeverityStyle(item.severity);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${style.bg} ${
                  !item.isRead ? 'ring-1 ring-indigo-400/40 shadow-sm' : 'opacity-85'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{style.icon}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${style.badge}`}>
                          {item.severity}
                        </span>
                        {item.recipientRole && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.recipientRole.replace('ROLE_', '')}
                          </span>
                        )}
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" title="Unread notification" />
                        )}
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {item.message}
                      </p>

                      {/* Associated References & Timestamp */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        {item.relatedEquipmentId && (
                          <span className="flex items-center gap-1 font-mono font-semibold text-slate-800 dark:text-slate-200">
                            <Cpu className="w-3 h-3 text-indigo-500" />
                            <span>{item.relatedEquipmentId}</span>
                          </span>
                        )}
                        {item.relatedTicketId && (
                          <span className="flex items-center gap-1 font-mono font-semibold text-purple-600 dark:text-purple-400">
                            <Wrench className="w-3 h-3 text-purple-500" />
                            <span>{item.relatedTicketId}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.timestamp || 'Just now'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!item.isRead && (
                    <button
                      onClick={() => onMarkAsRead(item.id)}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Read</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No notifications available.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You are all caught up! Real-time alerts for critical threshold breaches, machine anomalies, and ticket assignments will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
