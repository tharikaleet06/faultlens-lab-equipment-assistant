import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { EquipmentPage } from './pages/Equipment';
import { EquipmentDetails } from './pages/EquipmentDetails';
import { PredictionsPage } from './pages/Predictions';
import { AssistantPage } from './pages/Assistant';
import { MaintenancePage } from './pages/Maintenance';
import { ReplacementPage } from './pages/ReplacementPage';
import { AdminPage } from './pages/AdminPage';
import { NotificationsPage } from './pages/Notifications';
import { equipmentService, maintenanceService, authService, aiService, notificationService } from './services/api';
import { ROLE_DEFINITIONS } from './types';
import { AlertTriangle, CheckCircle2, Sparkles, X, ShieldCheck, Zap, Wrench, Bot, Gauge, Package, ShieldAlert, Lock } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [equipmentList, setEquipmentList] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [notification, setNotification] = useState(null);
  const [executionModal, setExecutionModal] = useState(null);

  const loadNotifications = async () => {
    try {
      const list = await notificationService.getNotifications(currentUser);
      setNotificationsList(list);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  };

  // Load fleet data
  const loadData = async () => {
    try {
      const [eqs, tkts, parts] = await Promise.all([
        equipmentService.getAll(),
        maintenanceService.getTickets(),
        maintenanceService.getSpareParts()
      ]);
      setEquipmentList(eqs);
      setTickets(tkts);
      setSpareParts(parts);
      if (!selectedEquipment && eqs.length > 0) {
        setSelectedEquipment(eqs[0]);
      }
    } catch (e) {
      console.error('Failed to load initial data:', e);
    }
  };

  useEffect(() => {
    loadData();
    loadNotifications();
    // Check if user already logged in previously
    const existingToken = authService.getToken();
    if (existingToken) {
      const stored = authService.getCurrentUser();
      if (stored) setCurrentUser(stored);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const handleMarkNotificationAsRead = async (id) => {
    await notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllNotificationsAsRead = async () => {
    await notificationService.markAllAsRead(currentUser);
    loadNotifications();
  };

  // Periodic sensor telemetry pulse to demonstrate dynamic real-time behavior
  useEffect(() => {
    if (currentView !== 'app') return;

    const interval = setInterval(async () => {
      if (selectedEquipment) {
        try {
          const streamData = await fetch(`/api/sensors/stream/${selectedEquipment.id}`).then(r => r.json());
          if (streamData && streamData.telemetry) {
            setEquipmentList(prev => prev.map(item => {
              if (item.id === selectedEquipment.id) {
                const updated = { ...item, currentTelemetry: streamData.telemetry };
                return updated;
              }
              return item;
            }));
          }
        } catch (e) {
          // ignore stream fluctuation
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedEquipment, currentView]);

  // Handle switching active RBAC user
  const handleSwitchUser = async (username) => {
    try {
      const res = await authService.login(username);
      if (res && res.user) {
        setCurrentUser(res.user);
        const userRole = res.user.role || 'ROLE_TECHNICIAN';
        const targetTab = ROLE_DEFINITIONS[userRole]?.defaultTab || 'dashboard';
        setActiveTab(targetTab);
        loadNotifications();
        const roleLabel = String(userRole).replace('ROLE_', '');
        setNotification({
          title: 'RBAC Security Context Switched',
          message: `Active session authenticated as ${res.user.name || 'Personnel'} (${roleLabel}). Directing to ${ROLE_DEFINITIONS[userRole]?.title || 'Workspace'}.`,
          type: 'info'
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      console.error('Switch user failed:', e);
    }
  };

  // Handle Dynamic Telemetry & Anomaly Injection
  const handleInjectAnomaly = async (equipmentId, payloadOrType) => {
    const eq = equipmentList.find(e => e.id === equipmentId);
    if (!eq) return;

    let telemetryPayload = {};
    if (typeof payloadOrType === 'object' && payloadOrType !== null) {
      telemetryPayload = payloadOrType;
    } else if (payloadOrType === 'thermal') {
      telemetryPayload = { temperature: 84.5, CHILLER_DELTA: 22.0, BED_TEMP: 88.0 };
    } else if (payloadOrType === 'vacuum') {
      telemetryPayload = { VAC: 28.5, RPM: 95000, vibration: 5.2 };
    } else {
      telemetryPayload = { vibration: 6.4, VIB: 6.2, SPINDLE_RPM: 14800, CPU_UTIL: 96.5 };
    }

    try {
      const res = await equipmentService.injectTelemetry(equipmentId, telemetryPayload);
      let updatedEq = eq;
      if (res && res.equipment) {
        updatedEq = res.equipment;
        setEquipmentList(prev => prev.map(e => e.id === equipmentId ? { ...res.equipment } : e));
        if (selectedEquipment?.id === equipmentId) {
          setSelectedEquipment({ ...res.equipment });
        }
      }

      // Create notification for critical anomaly
      await notificationService.createNotification({
        recipientRole: 'ROLE_ADMIN',
        type: 'CRITICAL_EQUIPMENT_ALERT',
        title: `Telemetry Anomaly: ${updatedEq.name}`,
        message: `Sensor values exceeded normal limits for ${updatedEq.id}. Active risk: ${updatedEq.failureRisk}.`,
        relatedEquipmentId: updatedEq.id,
        severity: updatedEq.failureRisk === 'CRITICAL' ? 'CRITICAL' : 'WARNING'
      });
      loadNotifications();

      // Automatically generate an autonomous ticket if failureRisk is CRITICAL or HIGH
      let generatedTkt = null;
      if (updatedEq.failureRisk === 'CRITICAL' || updatedEq.failureRisk === 'HIGH') {
        try {
          generatedTkt = await aiService.generateAutonomousTicket(equipmentId);
          if (generatedTkt) {
            setTickets(prev => [generatedTkt, ...prev.filter(t => t.id !== generatedTkt.id)]);
            await notificationService.createNotification({
              recipientRole: 'ROLE_TECHNICIAN',
              recipientUsername: 'technician',
              type: 'TICKET_ASSIGNED',
              title: `Work Order Assigned: ${generatedTkt.id}`,
              message: `Autonomous ticket created for ${updatedEq.name}. Priority: ${generatedTkt.priority}.`,
              relatedEquipmentId: updatedEq.id,
              relatedTicketId: generatedTkt.id,
              severity: 'WARNING'
            });
            loadNotifications();
          }
        } catch (tktErr) {
          console.error('Auto ticket generation failed:', tktErr);
        }
      }

      // Open Execution Pop-Up Dialog Modal
      setExecutionModal({
        type: 'ANOMALY_INJECTED',
        title: '⚡ Sensor Telemetry Anomaly Injected & Evaluated!',
        equipmentName: updatedEq.name,
        equipmentId: updatedEq.id,
        healthScore: updatedEq.healthScore,
        failureRisk: updatedEq.failureRisk,
        priorityScore: updatedEq.priorityScore,
        activeErrorCode: updatedEq.activeErrorCode,
        predictedIssue: updatedEq.predictedIssue,
        injectedValues: telemetryPayload,
        generatedTicket: generatedTkt
      });
    } catch (e) {
      console.error('Failed to inject anomaly:', e);
    }
  };

  // Handlers for equipment selection and actions
  const handleSelectEquipment = (eq) => {
    setSelectedEquipment(eq);
    setActiveTab('details');
  };

  const handleDiagnoseEquipment = (eq) => {
    setSelectedEquipment(eq);
    setActiveTab('assistant');
  };

  const handleGenerateTicket = async (eq) => {
    if (!eq) return;
    try {
      const newTkt = await aiService.generateAutonomousTicket(eq.id);

      setTickets(prev => [newTkt, ...prev.filter(t => t.id !== newTkt.id)]);

      // Open Execution Pop-Up Dialog Modal
      setExecutionModal({
        type: 'TICKET_GENERATED',
        title: '🎫 Autonomous Work Order Ticket Created!',
        equipmentName: eq.name,
        equipmentId: eq.id,
        healthScore: eq.healthScore,
        failureRisk: eq.failureRisk,
        priorityScore: eq.priorityScore,
        activeErrorCode: eq.activeErrorCode,
        generatedTicket: newTkt
      });
    } catch (e) {
      console.error('Failed to generate ticket:', e);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status, notes) => {
    const existingTicket = tickets.find(t => t.id === ticketId);
    if (existingTicket?.status === 'RESOLVED') return;
    try {
      const updated = await maintenanceService.updateTicketStatus(ticketId, status, notes);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status, resolutionNotes: notes } : t));

      if (status === 'RESOLVED') {
        // Refresh fleet
        const refreshed = await equipmentService.getAll();
        setEquipmentList(refreshed);

        await notificationService.createNotification({
          recipientRole: 'ROLE_ADMIN',
          type: 'TICKET_RESOLVED',
          title: `Ticket Resolved: ${ticketId}`,
          message: `Technician resolved maintenance ticket ${ticketId}. Machine health restored.`,
          relatedTicketId: ticketId,
          severity: 'INFO'
        });
        loadNotifications();

        setNotification({
          title: 'Work Order Resolved',
          message: `Ticket ${ticketId} resolved. Equipment health score restored.`,
          type: 'success'
        });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      console.error('Failed to update ticket status:', e);
    }
  };

  const handleAddNewTicket = async (ticketData) => {
    try {
      const created = await maintenanceService.createTicket(ticketData);
      setTickets(prev => [created, ...prev]);
      setNotification({
        title: 'New Maintenance Ticket Created',
        message: `Ticket ${created.id} scheduled for ${created.equipmentName}.`,
        type: 'success'
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      console.error('Failed to create ticket:', e);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentView('landing');
    setNotification({
      title: 'Signed Out',
      message: 'You have been safely signed out of the laboratory console.',
      type: 'info'
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Launching Page View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => setCurrentView('login')}
        onGoToLogin={() => setCurrentView('login')}
      />
    );
  }

  // 2. Login Page View
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          if (!user) return;
          setCurrentUser(user);
          loadData();
          loadNotifications();
          setActiveTab('dashboard');
          setCurrentView('app');
          const userRole = user.role || 'ROLE_TECHNICIAN';
          const roleLabel = String(userRole).replace('ROLE_', '');
          setNotification({
            title: `Authenticated as ${user.name || user.username || 'Personnel'}`,
            message: `Welcome to FaultLens! Loaded equipment telemetry dashboard for ${roleLabel}.`,
            type: 'success'
          });
          setTimeout(() => setNotification(null), 4000);
        }}
        onGoToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // 3. Main Lab Application Console View
  const safeTicketsList = Array.isArray(tickets) ? tickets : [];
  const safeEquipmentList = Array.isArray(equipmentList) ? equipmentList : [];
  const safeNotificationsList = Array.isArray(notificationsList) ? notificationsList : [];

  const openTicketsCount = safeTicketsList.filter(t => t && (t.status === 'OPEN' || t.status === 'IN_PROGRESS')).length;
  const criticalCount = safeEquipmentList.filter(e => e && (e.failureRisk === 'CRITICAL' || e.failureRisk === 'HIGH')).length;
  const unreadNotificationCount = safeNotificationsList.filter(n => n && !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onInjectAnomaly={handleInjectAnomaly}
        onNavigateToLanding={() => setCurrentView('landing')}
        onNavigateToNotifications={() => setActiveTab('notifications')}
        unreadNotificationCount={unreadNotificationCount}
        onLogout={handleLogout}
      />

      {/* Main Layout: Sidebar + Page Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab === 'details' ? 'equipment' : activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          openTicketCount={openTicketsCount}
          criticalCount={criticalCount}
          unreadNotificationCount={unreadNotificationCount}
          currentUser={currentUser}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Notification Alert Banner */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-xl border flex items-start justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                notification.type === 'alert'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : notification.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {notification.type === 'alert' ? (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                ) : notification.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold">{notification.title}</div>
                  <div className="text-xs opacity-90 mt-0.5">{notification.message}</div>
                </div>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Page Routing */}
          {activeTab === 'dashboard' && (
            <Dashboard
              equipmentList={equipmentList}
              tickets={tickets}
              currentUser={currentUser}
              onSelectEquipment={handleSelectEquipment}
              onDiagnoseEquipment={handleDiagnoseEquipment}
              onGenerateTicket={handleGenerateTicket}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentPage
              equipmentList={equipmentList}
              currentUser={currentUser}
              onSelectEquipment={handleSelectEquipment}
              onDiagnoseEquipment={handleDiagnoseEquipment}
              onGenerateTicket={handleGenerateTicket}
              onNavigateToAdmin={() => setActiveTab('admin')}
            />
          )}

          {activeTab === 'details' && (
            <EquipmentDetails
              equipment={selectedEquipment || equipmentList[0] || {}}
              onBack={() => setActiveTab('equipment')}
              onDiagnose={handleDiagnoseEquipment}
              onGenerateTicket={handleGenerateTicket}
              onInjectTelemetry={(eqId, telem) => handleInjectAnomaly(eqId, telem)}
            />
          )}

          {activeTab === 'predictions' && (
            <PredictionsPage
              equipmentList={equipmentList}
              onDiagnose={handleDiagnoseEquipment}
              onGenerateTicket={handleGenerateTicket}
              onSelectEquipment={handleSelectEquipment}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantPage
              equipmentList={equipmentList}
              preselectedEquipment={selectedEquipment}
              onTicketCreated={(ticket) => {
                setTickets(prev => [ticket, ...prev]);
                setNotification({
                  title: 'Preventive Ticket Created from SLM Diagnosis',
                  message: `Ticket ${ticket.id} successfully queued with suggested parts and action steps.`,
                  type: 'success'
                });
                setTimeout(() => setNotification(null), 4000);
              }}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenancePage
              tickets={tickets}
              equipmentList={equipmentList}
              spareParts={spareParts}
              currentUser={currentUser}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onAddNewTicket={handleAddNewTicket}
              onRepairLogged={loadData}
            />
          )}

          {activeTab === 'replacement' && (
            <ReplacementPage
              equipmentList={equipmentList}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPage
              notifications={notificationsList}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onSelectEquipment={handleSelectEquipment}
            />
          )}

          {['admin', 'admin-add-user', 'admin-add-equipment', 'addUser', 'addEquipment'].includes(activeTab) && (
            (currentUser?.role === 'ADMIN' || currentUser?.role === 'ROLE_ADMIN') ? (
              <AdminPage
                equipmentList={equipmentList}
                currentUser={currentUser}
                onEquipmentRefresh={loadData}
                onRefreshEquipment={loadData}
                initialTab={
                  activeTab === 'admin-add-user' || activeTab === 'addUser' ? 'addUser' :
                  activeTab === 'admin-add-equipment' || activeTab === 'addEquipment' ? 'addEquipment' : 'users'
                }
              />
            ) : (
              <div className="p-8 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 mx-auto flex items-center justify-center text-rose-600 font-bold">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-rose-900 dark:text-rose-200">
                  HTTP 403 Forbidden: Admin Authorization Required
                </h2>
                <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
                  Technicians are restricted from accessing System Administration, User Management, and Equipment Registration.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 cursor-pointer"
                >
                  Return to My Dashboard
                </button>
              </div>
            )
          )}
        </main>
      </div>

      {/* Pop-Up Execution Dialog Modal */}
      {executionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-500/40 space-y-4 text-xs">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                  {executionModal.type === 'ANOMALY_INJECTED' ? <Zap className="w-6 h-6" /> : <Wrench className="w-6 h-6" />}
                </span>
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    System Execution Confirmed
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {executionModal.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setExecutionModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Instrument Snapshot */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{executionModal.equipmentName}</span>
                <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">{executionModal.equipmentId}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Health Score</div>
                  <div className="font-mono font-black text-sm text-slate-900 dark:text-white">{executionModal.healthScore}%</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Failure Risk</div>
                  <div className={`font-extrabold text-xs ${executionModal.failureRisk === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`}>
                    {executionModal.failureRisk}
                  </div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Priority Score</div>
                  <div className="font-mono font-black text-sm text-purple-600 dark:text-purple-400">{executionModal.priorityScore}/100</div>
                </div>
              </div>

              {executionModal.activeErrorCode && (
                <div className="pt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-mono font-bold text-[10px]">
                    Error: {executionModal.activeErrorCode}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">{executionModal.predictedIssue}</span>
                </div>
              )}
            </div>

            {/* Injected Sensor Telemetry Values */}
            {executionModal.injectedValues && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Injected Telemetry Values:
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(executionModal.injectedValues).map(([k, v]) => (
                    <span key={k} className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 font-mono text-xs font-bold">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Autonomous Ticket Generated Snapshot */}
            {executionModal.generatedTicket && (
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Autonomous Ticket Logged: {executionModal.generatedTicket.id}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                    {executionModal.generatedTicket.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  {executionModal.generatedTicket.title}
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Assigned: {executionModal.generatedTicket.assignedTechnician}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setExecutionModal(null);
                  setActiveTab('maintenance');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold"
              >
                View Maintenance Work Orders
              </button>
              <button
                onClick={() => setExecutionModal(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-md shadow-orange-500/20"
              >
                Acknowledge &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
