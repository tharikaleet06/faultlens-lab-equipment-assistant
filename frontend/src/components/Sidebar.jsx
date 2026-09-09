import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  TrendingUp, 
  Bot, 
  Wrench, 
  Server, 
  Layers,
  ShieldCheck,
  Building2,
  Brain,
  Sliders,
  Bell,
  UserPlus,
  Plus,
  RefreshCw
} from 'lucide-react';
import { ROLE_DEFINITIONS } from '../types';

export const Sidebar = ({
  activeTab,
  onSelectTab,
  openTicketCount,
  criticalCount,
  unreadNotificationCount = 0,
  currentUser,
  id
}) => {
  const role = currentUser?.role || 'TECHNICIAN';
  const roleStr = typeof role === 'string' ? role : String(role);
  const isAdmin = roleStr === 'ADMIN' || roleStr === 'ROLE_ADMIN';
  const roleDef = ROLE_DEFINITIONS[roleStr] || ROLE_DEFINITIONS[`ROLE_${roleStr.replace('ROLE_', '')}`] || ROLE_DEFINITIONS.TECHNICIAN;

  const additionalRoleItems = [];

  // Role dedicated items (ADMIN ONLY)
  const adminWorkspaceItems = isAdmin ? [
    {
      id: 'admin',
      label: 'Admin Console',
      icon: Sliders,
      badge: 'Control',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
    },
    {
      id: 'admin-add-user',
      label: 'Add New User',
      icon: UserPlus,
      badge: 'Provision',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
    },
    {
      id: 'admin-add-equipment',
      label: 'Add New Equipment',
      icon: Plus,
      badge: 'Onboard',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    }
  ] : [];

  const standardNavItems = [
    {
      id: 'dashboard',
      label: isAdmin ? 'System Dashboard' : 'My Dashboard',
      icon: LayoutDashboard,
      badge: criticalCount > 0 ? `${criticalCount} alert` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
    },
    {
      id: 'equipment',
      label: isAdmin ? 'Equipment Fleet' : 'My Assigned Equipment',
      icon: Cpu
    },
    {
      id: 'predictions',
      label: 'Failure Predictions',
      icon: TrendingUp,
      badge: 'ML Engine',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    },
    {
      id: 'assistant',
      label: 'SLM Maintenance Assistant',
      icon: Bot,
      badge: 'RAG Grounded',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
    },
    {
      id: 'maintenance',
      label: isAdmin ? 'Work Orders & Inventory' : 'My Maintenance Tickets',
      icon: Wrench,
      badge: openTicketCount > 0 ? `${openTicketCount}` : undefined,
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
    },
    {
      id: 'replacement',
      label: 'Replacement & OEM Analytics',
      icon: RefreshCw,
      badge: 'Procurement',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? `${unreadNotificationCount} unread` : undefined,
      badgeColor: 'bg-rose-500 text-white font-black animate-pulse'
    }
  ];

  return (
    <aside
      id={id || 'app-sidebar'}
      className="w-64 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 hidden md:flex md:flex-col md:justify-between"
    >
      <div className="space-y-4">
        {/* Primary Role Workspace */}
        {isAdmin && adminWorkspaceItems.length > 0 && (
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-3 flex items-center justify-between">
              <span>My Role Workspace</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                {roleStr.replace('ROLE_', '')}
              </span>
            </div>
            <div className="space-y-1">
              {adminWorkspaceItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || 
                  (item.id === 'admin-add-user' && activeTab === 'addUser') ||
                  (item.id === 'admin-add-equipment' && activeTab === 'addEquipment');
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive ? 'bg-purple-700 text-purple-100' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
            System Fleet Modules
          </div>
          <nav className="space-y-1">
            {standardNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-indigo-700 text-indigo-100' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Additional cross-role links for authorized roles */}
            {additionalRoleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* RBAC Role Card in Sidebar */}
      <div className="space-y-3 pt-4">
        {currentUser && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>RBAC Authorized</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="font-bold text-slate-900 dark:text-white">{roleDef?.displayName || roleDef?.shortTitle || 'User'}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[10px] leading-tight">
                {roleDef?.responsibilities || ''}
              </div>
            </div>
          </div>
        )}

        {/* Quick Specs Callout */}
        <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-mono">
          <div className="flex items-center gap-1 font-sans font-bold text-slate-700 dark:text-slate-300">
            <Layers className="w-3 h-3 text-indigo-500" />
            <span>Architecture</span>
          </div>
          <div>• Spring Cloud Gateway :3000</div>
          <div>• MySQL 8.0 Persistence</div>
          <div>• Python AI &amp; SLM RAG</div>
        </div>
      </div>
    </aside>
  );
};
