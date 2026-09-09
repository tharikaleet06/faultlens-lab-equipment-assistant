import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Server, 
  Zap, 
  Flame, 
  Waves,
  LogOut,
  Home,
  UserPlus,
  Bell
} from 'lucide-react';

export const Navbar = ({
  currentUser,
  onSwitchUser,
  onInjectAnomaly,
  onNavigateToArchitecture,
  onNavigateToLanding,
  onNavigateToNotifications,
  unreadNotificationCount = 0,
  onLogout,
  id
}) => {
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const rawRole = currentUser?.role || '';
  const roleStr = typeof rawRole === 'string' ? rawRole : String(rawRole);
  const isAdmin = roleStr === 'ADMIN' || roleStr === 'ROLE_ADMIN';

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'ADMIN':
      case 'ROLE_ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'TECHNICIAN':
      case 'ROLE_TECHNICIAN':
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <header
      id={id || 'app-navbar'}
      className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & System Title */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20"
          >
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-mono"
              >
                FaultLens
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wide">
                SLM • IoT • RAG
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Laboratory Equipment Failure Prediction &amp; Maintenance Assistant
            </p>
          </div>
        </div>

        {/* Center Live Alert Strip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">Live Warning:</span>
          <span className="text-slate-700 dark:text-slate-300">
            EQ-3D-01 (Form 4L) E45 Chiller delta &amp; EQ-CEN-05 (Optima XPN) E77 Vacuum leak
          </span>
        </div>

        {/* Right Tools: Notifications + Anomaly Simulation + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Bell Icon */}
          <button
            id="btn-nav-notifications"
            onClick={onNavigateToNotifications}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="System Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-xs">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              id="btn-nav-user-profile"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {currentUser?.role ? currentUser.role.replace('ROLE_', '').replace('_', ' ') : 'User'}
                </div>
              </div>
              <span className={`hidden sm:inline text-[9px] font-bold px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(currentUser?.role)}`}>
                {currentUser?.role ? currentUser.role.replace('ROLE_', '') : ''}
              </span>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 text-xs"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{currentUser?.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(currentUser?.role)}`}>
                      {currentUser?.role ? currentUser.role.replace('ROLE_', '') : ''}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Badge: {currentUser?.badge} • Dept: {currentUser?.dept}
                  </div>
                </div>

                <div className="py-2.5 px-2 space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Active Session Identity
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{currentUser?.email || `${currentUser?.username}@lab.internal`}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Username:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{currentUser?.username || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Database Role:</span>
                      <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] border ${getRoleBadgeStyle(currentUser?.role)}`}>
                        {currentUser?.role ? currentUser.role.replace('ROLE_', '') : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out &amp; Exit Console</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
