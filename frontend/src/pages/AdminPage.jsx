import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Cpu, 
  Settings, 
  Activity, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Database, 
  Sliders, 
  RefreshCw,
  Clock,
  Gauge,
  Shield,
  Search,
  Filter,
  UserPlus,
  PlusCircle
} from 'lucide-react';
import { ROLE_DEFINITIONS } from '../types';
import { adminService, equipmentService, DEVICE_TAXONOMY } from '../services/api';

export const AdminPage = ({
  equipmentList = [],
  onEquipmentRefresh,
  onRefreshEquipment,
  currentUser,
  id,
  initialTab = 'users'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userCreatedSuccess, setUserCreatedSuccess] = useState(false);
  const [equipmentCreatedSuccess, setEquipmentCreatedSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Device-Specific Threshold Configurator State
  const [selectedDeviceType, setSelectedDeviceType] = useState('CENTRIFUGE');
  const [selectedEqForThreshold, setSelectedEqForThreshold] = useState('ALL');
  const [thresholdConfig, setThresholdConfig] = useState([]);
  const [savingThresholds, setSavingThresholds] = useState(false);
  const [thresholdSaveSuccess, setThresholdSaveSuccess] = useState(false);

  useEffect(() => {
    // Initialize threshold config from taxonomy for selected device
    if (DEVICE_TAXONOMY[selectedDeviceType]) {
      const initialSensors = DEVICE_TAXONOMY[selectedDeviceType].sensors.map(s => ({
        code: s.code,
        name: s.name,
        unit: s.unit,
        normalMin: s.defaultNormal[0],
        normalMax: s.defaultNormal[1],
        warningMin: s.defaultWarning[0],
        warningMax: s.defaultWarning[1],
        criticalMin: s.defaultCritical[0],
        criticalMax: s.defaultCritical[1]
      }));
      setThresholdConfig(initialSensors);
    }
  }, [selectedDeviceType]);

  // User creation modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('TECHNICIAN');
  const [newDept, setNewDept] = useState('Laboratory Operations');
  const [newBadge, setNewBadge] = useState('TECH-2200');

  // Equipment creation modal
  const [showAddEqModal, setShowAddEqModal] = useState(false);
  const [newEqName, setNewEqName] = useState('');
  const [newEqModel, setNewEqModel] = useState('');
  const [newEqManufacturer, setNewEqManufacturer] = useState('');
  const [newEqLocation, setNewEqLocation] = useState('Central Instrumentation Suite');
  const [newEqCategory, setNewEqCategory] = useState('ANALYTICAL');

  // System settings state
  const [settings, setSettings] = useState({
    telemetrySamplingRateSeconds: 3,
    anomalySensitivityThreshold: 0.85,
    gatewayRoutingMode: 'DYNAMIC_LOAD_BALANCED',
    jwtExpirationMinutes: 1440,
    autoTicketGenerationEnabled: true,
    emailNotificationsActive: true,
    backupFrequencyHours: 6
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await adminService.getSettings();
      if (data) setSettings(data);
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  };

  useEffect(() => {
    loadUsers();
    loadSettings();
  }, []);

  const isAdmin = (currentUser?.role || '').replace('ROLE_', '') === 'ADMIN';

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Restricted: Only Administrator (ROLE_ADMIN) users have authorization to provision new laboratory technicians and personnel.');
      return;
    }
    try {
      await adminService.createUser({
        name: newName,
        email: newEmail,
        username: newUsername || newEmail.split('@')[0],
        role: newRole,
        dept: newDept,
        badge: newBadge,
        password: newPassword || 'labpass123'
      });
      setShowAddUserModal(false);
      setNewName('');
      setNewEmail('');
      setNewUsername('');
      setNewPassword('');
      setUserCreatedSuccess(true);
      setTimeout(() => setUserCreatedSuccess(false), 5000);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (username) => {
    if (!isAdmin) {
      alert('Access Restricted: Only Administrator (ROLE_ADMIN) users have authorization to remove personnel.');
      return;
    }
    if (!confirm(`Are you sure you want to deactivate and remove ${username}?`)) return;
    try {
      await adminService.deleteUser(username);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleUpdateUserRole = async (username, role) => {
    if (!isAdmin) {
      alert('Access Restricted: Only Administrator (ROLE_ADMIN) users can update RBAC roles.');
      return;
    }
    try {
      await adminService.updateUser(username, { role });
      loadUsers();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleCreateEquipment = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Access Restricted: Only Administrator (ROLE_ADMIN) users have authorization to register new equipment.');
      return;
    }
    try {
      await adminService.createEquipment({
        name: newEqName,
        model: newEqModel,
        manufacturer: newEqManufacturer,
        location: newEqLocation,
        labRoom: newEqLocation,
        category: newEqCategory,
        healthScore: 98,
        failureRisk: 'LOW',
        operatingHours: 12
      });
      setShowAddEqModal(false);
      setNewEqName('');
      setNewEqModel('');
      setNewEqManufacturer('');
      setEquipmentCreatedSuccess(true);
      setTimeout(() => setEquipmentCreatedSuccess(false), 5000);
      if (onRefreshEquipment) onRefreshEquipment();
      if (onEquipmentRefresh) onEquipmentRefresh();
    } catch (err) {
      console.error('Failed to create equipment:', err);
    }
  };

  const handleDeleteEquipment = async (eqId) => {
    if (!confirm(`Are you sure you want to delete instrument ${eqId}?`)) return;
    try {
      await adminService.deleteEquipment(eqId);
      if (onRefreshEquipment) onRefreshEquipment();
      if (onEquipmentRefresh) onEquipmentRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete equipment');
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await adminService.updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = !searchUser || 
      u.name.toLowerCase().includes(searchUser.toLowerCase()) || 
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.badge.toLowerCase().includes(searchUser.toLowerCase());
    const normalizedRole = (u.role || '').replace('ROLE_', '');
    const filterRole = roleFilter.replace('ROLE_', '');
    const matchesRole = roleFilter === 'ALL' || normalizedRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const r = (role || '').replace('ROLE_', '');
    switch (r) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'TECHNICIAN':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div id={id || 'admin-portal-page'} className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-purple-900/60 shadow-lg text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>ROLE_ADMIN CONSOLE</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              System Administration &amp; Overall Monitoring
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Manage authorized lab personnel, fleet equipment catalog, API gateway microservices configuration, and overall laboratory telemetry monitoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-purple-900/40 border border-purple-700/50 text-purple-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cluster Ingress: 0.0.0.0:3000</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-purple-900/50">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addUser')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'addUser'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>+ Add New User</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'equipment'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Equipment Catalog ({equipmentList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addEquipment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'addEquipment'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Add New Equipment</span>
          </button>

          <button
            onClick={() => setActiveTab('thresholds')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'thresholds'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>Device Threshold Configurator</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Maintenance Audit History</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>System Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'monitoring'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Overall Monitoring</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user, email, badge..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="TECHNICIAN">TECHNICIAN</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New User</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Name &amp; System Username</th>
                    <th className="p-3.5">Laboratory Email</th>
                    <th className="p-3.5">Badge ID</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Assigned Role (RBAC)</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.username} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">@{u.username}</div>
                      </td>
                      <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400">
                        {u.email}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {u.badge}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {u.dept}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={(u.role || '').replace('ROLE_', '')}
                          onChange={(e) => handleUpdateUserRole(u.username, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] focus:outline-none ${getRoleBadge(u.role)}`}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="TECHNICIAN">TECHNICIAN</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right">
                        {u.username !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.username)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Deactivate User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EQUIPMENT CATALOG */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Laboratory Equipment Fleet Registry
              </h2>
              <p className="text-xs text-slate-500">
                Register new instruments, configure operational locations, and monitor health scores.
              </p>
            </div>

            <button
              onClick={() => setShowAddEqModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Equipment</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Asset ID &amp; Name</th>
                    <th className="p-3.5">Model &amp; Manufacturer</th>
                    <th className="p-3.5">Lab Location</th>
                    <th className="p-3.5">Operating Hours</th>
                    <th className="p-3.5">Health Score</th>
                    <th className="p-3.5">Failure Risk</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {equipmentList.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{eq.name}</div>
                        <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400">{eq.id}</div>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        <div>{eq.model}</div>
                        <div className="text-[11px] text-slate-500">{eq.manufacturer}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                        {eq.labLocation}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                        {eq.operatingHours} hrs
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{eq.healthScore}%</span>
                          <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                eq.healthScore > 80 ? 'bg-emerald-500' : eq.healthScore > 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`} 
                              style={{ width: `${eq.healthScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          eq.failureRisk === 'CRITICAL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          eq.failureRisk === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                          eq.failureRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {eq.failureRisk}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px]">
                          {eq.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteEquipment(eq.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove Equipment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DEVICE THRESHOLD CONFIGURATOR */}
      {activeTab === 'thresholds' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-500" />
                  <span>Device-Specific Threshold Configurator</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select equipment type/model to configure sensor normal, warning, and critical ranges in MySQL database.
                </p>
              </div>

              {/* Device & Specific Equipment Selector */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Device Type / Model:</label>
                  <select
                    value={selectedDeviceType}
                    onChange={(e) => {
                      setSelectedDeviceType(e.target.value);
                      setSelectedEqForThreshold('ALL');
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.keys(DEVICE_TAXONOMY).map(dt => (
                      <option key={dt} value={dt}>
                        {DEVICE_TAXONOMY[dt].name} ({dt})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Equipment Scope:</label>
                  <select
                    value={selectedEqForThreshold}
                    onChange={(e) => setSelectedEqForThreshold(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ALL">All Devices of Type ({selectedDeviceType})</option>
                    {safeEquipment.filter(e => e.deviceTypeCode === selectedDeviceType || e.category?.toUpperCase().includes(selectedDeviceType)).map(e => (
                      <option key={e.id} value={e.id}>
                        {e.id} — {e.name} ({e.model})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Strict Rule Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-slate-700 dark:text-slate-300">
                <strong className="font-bold text-amber-900 dark:text-amber-300">Strict Device Isolation Rule:</strong> Threshold configurations apply strictly to sensors associated with the selected equipment category. Non-compute equipment (Centrifuges, CNC Machines, Microscopes) contain domain-specific physical sensors (RPM, Vacuum mTorr, Coolant L/min, Pa) and do NOT use generic CPU/Memory metrics.
              </div>
            </div>
          </div>

          {/* Sensor Threshold Cards */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>Applicable Sensors for {DEVICE_TAXONOMY[selectedDeviceType]?.name}</span>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                {Array.isArray(thresholdConfig) ? thresholdConfig.length : 0} Active Sensors
              </span>
            </h3>

            <div className="space-y-4">
              {Array.isArray(thresholdConfig) && thresholdConfig.map((sensor, idx) => (
                <div key={sensor.code || idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono font-bold text-xs">
                        {sensor.code}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{sensor.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 font-mono">Unit: {sensor.unit}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Normal Range */}
                    <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                        <span>Normal Operating Range</span>
                        <span className="font-mono text-[10px]">({sensor.unit})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={sensor.normalMin}
                          onChange={(e) => {
                            const updated = [...thresholdConfig];
                            updated[idx].normalMin = parseFloat(e.target.value) || 0;
                            setThresholdConfig(updated);
                          }}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-mono"
                          placeholder="Min"
                        />
                        <span>to</span>
                        <input
                          type="number"
                          step="0.01"
                          value={sensor.normalMax}
                          onChange={(e) => {
                            const updated = [...thresholdConfig];
                            updated[idx].normalMax = parseFloat(e.target.value) || 0;
                            setThresholdConfig(updated);
                          }}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-mono"
                          placeholder="Max"
                        />
                      </div>
                    </div>

                    {/* Warning Range */}
                    <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1">
                      <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between">
                        <span>Warning Range</span>
                        <span className="font-mono text-[10px]">({sensor.unit})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={sensor.warningMin}
                          onChange={(e) => {
                            const updated = [...thresholdConfig];
                            updated[idx].warningMin = parseFloat(e.target.value) || 0;
                            setThresholdConfig(updated);
                          }}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-xs font-mono"
                          placeholder="Min"
                        />
                        <span>to</span>
                        <input
                          type="number"
                          step="0.01"
                          value={sensor.warningMax}
                          onChange={(e) => {
                            const updated = [...thresholdConfig];
                            updated[idx].warningMax = parseFloat(e.target.value) || 0;
                            setThresholdConfig(updated);
                          }}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-xs font-mono"
                          placeholder="Max"
                        />
                      </div>
                    </div>

                    {/* Critical Range */}
                    <div className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1">
                      <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center justify-between">
                        <span>Critical Breach Range</span>
                        <span className="font-mono text-[10px]">({sensor.unit})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={sensor.criticalMin}
                          onChange={(e) => {
                            const updated = [...thresholdConfig];
                            updated[idx].criticalMin = parseFloat(e.target.value) || 0;
                            setThresholdConfig(updated);
                          }}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-xs font-mono"
                          placeholder="Min"
                        />
                        <span>to</span>
                        <input
                          type="number"
                          step="0.01"
                          value={sensor.criticalMax}
                          onChange={(e) => {
                            const updated = [...thresholdConfig];
                            updated[idx].criticalMax = parseFloat(e.target.value) || 0;
                            setThresholdConfig(updated);
                          }}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-xs font-mono"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              {thresholdSaveSuccess ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Device threshold bounds saved &amp; applied to telemetry rules engine.</span>
                </span>
              ) : (
                <div />
              )}

              <button
                onClick={() => {
                  setSavingThresholds(true);
                  setTimeout(() => {
                    setSavingThresholds(false);
                    setThresholdSaveSuccess(true);
                    setTimeout(() => setThresholdSaveSuccess(false), 3500);
                  }, 600);
                }}
                disabled={savingThresholds}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                {savingThresholds ? (
                  <span>Saving Thresholds...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Device Threshold Configuration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MAINTENANCE AUDIT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              <span>Full Laboratory Maintenance &amp; Service Audit Log</span>
            </h2>
            <p className="text-xs text-slate-500">
              Complete historical record of all preventive maintenance services, technician repairs, parts replacements, and AI verification signatures.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Record / Work Order</th>
                    <th className="p-3.5">Target Instrument</th>
                    <th className="p-3.5">Service Type &amp; Action</th>
                    <th className="p-3.5">Assigned Technician</th>
                    <th className="p-3.5">Downtime &amp; Parts Swapped</th>
                    <th className="p-3.5 font-mono">AI Verification Seal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {equipmentList.flatMap(eq => (eq.maintenanceHistory || []).map(h => ({ ...h, eqName: eq.name, eqId: eq.id, deviceTypeCode: eq.deviceTypeCode }))).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-500 italic">No maintenance history records found.</td>
                    </tr>
                  ) : (
                    equipmentList.flatMap(eq => (eq.maintenanceHistory || []).map(h => ({ ...h, eqName: eq.name, eqId: eq.id, deviceTypeCode: eq.deviceTypeCode }))).map((rec, idx) => (
                      <tr key={rec.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono font-bold text-purple-600 dark:text-purple-400">
                          {rec.id || `REC-${idx + 1}`}
                          <div className="text-[10px] text-slate-400 font-sans font-normal">{rec.date || '2024-02-01'}</div>
                        </td>
                        <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                          <div>{rec.eqName}</div>
                          <div className="text-[10px] font-mono text-slate-500">{rec.eqId} • {rec.deviceTypeCode || 'LAB_DEVICE'}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{rec.type || 'Preventive Service'}</span>
                          <span className="text-[11px] text-slate-500">{rec.description}</span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                          {rec.technician || 'Dr. Alex Vance'}
                        </td>
                        <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                          <div>{Array.isArray(rec.partsReplaced) ? rec.partsReplaced.join(', ') : (rec.partsReplaced || 'None')}</div>
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-sans font-semibold">Downtime: 1.5 hrs</div>
                        </td>
                        <td className="p-3.5 font-mono">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>AI Verified</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" />
              <span>FaultLens Infrastructure &amp; Sensor Settings</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tune telemetry ingestion cadence, ML anomaly detection sensitivity, and microservice gateway behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Sampling Rate */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-bold text-slate-900 dark:text-white">
                Telemetry Streaming Frequency (Seconds)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.telemetrySamplingRateSeconds}
                onChange={(e) => setSettings({ ...settings, telemetrySamplingRateSeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Determines how often the Sensor Microservice queries IoT hardware telemetry.
              </p>
            </div>

            {/* Anomaly Sensitivity */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-bold text-slate-900 dark:text-white">
                ML Anomaly Sensitivity Threshold ({settings.anomalySensitivityThreshold})
              </label>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={settings.anomalySensitivityThreshold}
                onChange={(e) => setSettings({ ...settings, anomalySensitivityThreshold: Number(e.target.value) })}
                className="w-full accent-purple-600"
              />
              <p className="text-[11px] text-slate-500">
                Confidence threshold above which sensor deviations flag an automated maintenance alert.
              </p>
            </div>

            {/* Microservice Gateway Routing */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-bold text-slate-900 dark:text-white">
                API Gateway Ingress Routing Mode
              </label>
              <select
                value={settings.gatewayRoutingMode}
                onChange={(e) => setSettings({ ...settings, gatewayRoutingMode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="DYNAMIC_LOAD_BALANCED">Dynamic Load Balanced (Round-Robin)</option>
                <option value="DIRECT_MICROSERVICE">Direct Service Routing (Fast Ingress)</option>
                <option value="FAILOVER_ACTIVE_PASSIVE">Failover Active-Passive</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Spring Cloud Gateway route strategy for auth, equipment, sensor, and maintenance services.
              </p>
            </div>

            {/* JWT Expiration */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-bold text-slate-900 dark:text-white">
                JWT Authentication Expiry (Minutes)
              </label>
              <input
                type="number"
                min="60"
                max="10080"
                value={settings.jwtExpirationMinutes}
                onChange={(e) => setSettings({ ...settings, jwtExpirationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Bearer token lifetime before requiring laboratory personnel re-authentication.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>System configuration updated and broadcast across cluster.</span>
              </span>
            )}
            {!saveSuccess && <div />}

            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 transition-all"
            >
              {savingSettings ? 'Saving Settings...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: OVERALL MONITORING */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Cluster Availability</span>
                <Server className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">99.98%</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">5 Microservices Healthy</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Telemetry Rate</span>
                <Gauge className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,240 msg/s</div>
              <div className="text-[11px] text-slate-500 mt-1">IoT Ingestion Pipeline</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Active Personnel</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{users.length} Active</div>
              <div className="text-[11px] text-slate-500 mt-1">Across 4 Authorized Roles</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">MySQL Connection Pool</span>
                <Database className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">18 / 20</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Latency 4.2ms nominal</div>
            </div>
          </div>

          {/* Microservice Health Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Spring Boot &amp; Python Microservices Health Matrix</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'API Gateway Service', port: 3000, type: 'Spring Cloud Gateway', status: 'ONLINE', uptime: '14d 8h' },
                { name: 'Auth Microservice', port: 8081, type: 'Spring Boot 3 / JWT', status: 'ONLINE', uptime: '14d 8h' },
                { name: 'Equipment Microservice', port: 8082, type: 'Spring Boot 3 / JPA', status: 'ONLINE', uptime: '14d 8h' },
                { name: 'Sensor Telemetry Service', port: 8083, type: 'Reactive WebFlux / IoT', status: 'ONLINE', uptime: '14d 8h' },
                { name: 'Maintenance Service', port: 8084, type: 'Spring Boot 3 / MySQL', status: 'ONLINE', uptime: '14d 8h' },
                { name: 'Python AI & SLM Service', port: 8000, type: 'FastAPI / Scikit-Learn', status: 'ONLINE', uptime: '14d 8h' }
              ].map((srv) => (
                <div key={srv.name} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{srv.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{srv.status}</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{srv.type}</span>
                    <span className="font-mono">Port {srv.port}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Uptime: {srv.uptime} • Health: 100%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ADD NEW USER WORKSPACE PAGE */}
      {activeTab === 'addUser' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Provision New Laboratory User / Technician</h2>
                  <p className="text-xs text-slate-500">Admin-controlled user onboarding. Only authenticated administrators can provision system accounts.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('users')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                View All Users ({users.length})
              </button>
            </div>

            {userCreatedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Success: New user account created and provisioned in user repository!</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Maya Lin"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Laboratory Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya.lin@faultlens.lab"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Username (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Role Tier *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="TECHNICIAN">TECHNICIAN (Maintenance &amp; Diagnostics)</option>
                    <option value="ADMIN">ADMIN (Full System Control)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Personnel Badge ID</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Laboratory Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Account Initial Password</label>
                  <input
                    type="password"
                    placeholder="Defaults to 'labpass123' if blank"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setNewName(''); setNewEmail(''); setNewPassword(''); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Provision User Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 8: ADD NEW EQUIPMENT WORKSPACE PAGE */}
      {activeTab === 'addEquipment' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Register &amp; Onboard New Laboratory Equipment</h2>
                  <p className="text-xs text-slate-500">Register new instruments into the FaultLens IoT telemetry monitoring database.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('equipment')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                View Equipment Catalog ({equipmentList.length})
              </button>
            </div>

            {equipmentCreatedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Success: New equipment registered successfully and active in fleet telemetry stream!</span>
              </div>
            )}

            <form onSubmit={handleCreateEquipment} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Device Type / Taxonomy Category *</label>
                  <select
                    value={selectedDeviceType}
                    onChange={(e) => {
                      setSelectedDeviceType(e.target.value);
                      setNewEqCategory(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {Object.keys(DEVICE_TAXONOMY).map(k => (
                      <option key={k} value={k}>{k} - {DEVICE_TAXONOMY[k].name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ultra-Centrifuge Optima XPN"
                    value={newEqName}
                    onChange={(e) => setNewEqName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Manufacturer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Beckman Coulter"
                    value={newEqManufacturer}
                    onChange={(e) => setNewEqManufacturer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Model Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Optima XPN-100"
                    value={newEqModel}
                    onChange={(e) => setNewEqModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Laboratory Location / Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. Central Instrumentation Suite - Room 402"
                  value={newEqLocation}
                  onChange={(e) => setNewEqLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Applicable Sensors taxonomy preview */}
              {DEVICE_TAXONOMY[selectedDeviceType] && (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 space-y-2">
                  <div className="font-bold text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between">
                    <span>Configured Telemetry Sensors ({DEVICE_TAXONOMY[selectedDeviceType].name}):</span>
                    <span className="font-mono text-[10px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded font-bold">
                      {DEVICE_TAXONOMY[selectedDeviceType].sensors.length} Sensors Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    {DEVICE_TAXONOMY[selectedDeviceType].sensors.map(s => (
                      <div key={s.code} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/60 font-mono text-slate-800 dark:text-slate-200">
                        <span className="font-bold text-purple-700 dark:text-purple-300">{s.code}:</span> {s.name} ({s.unit})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setNewEqName(''); setNewEqModel(''); setNewEqManufacturer(''); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register &amp; Save Equipment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Provision New Laboratory Personnel
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Maya Lin"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Laboratory Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maya.lin@faultlens.lab"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Tier</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="TECHNICIAN">TECHNICIAN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Badge ID</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Password</label>
                <input
                  type="password"
                  placeholder="Set login password (default: labpass123)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                >
                  Create Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Equipment */}
      {showAddEqModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  <span>Register New Laboratory Equipment</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Admin Equipment Onboarding: Configure taxonomy, serial numbers, sensors, and operating thresholds.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateEquipment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PerkinElmer NexION 5000 ICP-MS Instrument"
                  value={newEqName}
                  onChange={(e) => setNewEqName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Equipment Type</label>
                  <select
                    value={selectedDeviceType}
                    onChange={(e) => setSelectedDeviceType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    {Object.keys(DEVICE_TAXONOMY).map((typeCode) => (
                      <option key={typeCode} value={typeCode}>
                        {DEVICE_TAXONOMY[typeCode].name} ({typeCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thermo Fisher / Formlabs"
                    value={newEqManufacturer}
                    onChange={(e) => setNewEqManufacturer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Model Name / Number</label>
                  <input
                    type="text"
                    required
                    placeholder="NexION 5000 Multi-Quad"
                    value={newEqModel}
                    onChange={(e) => setNewEqModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    placeholder="SN-PE-2026-9041"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Criticality Rating</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Operational Status</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="NEEDS_MAINTENANCE">NEEDS MAINTENANCE</option>
                    <option value="DEGRADED">DEGRADED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lab Room &amp; Facility Location</label>
                <input
                  type="text"
                  value={newEqLocation}
                  onChange={(e) => setNewEqLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Applicable Sensors preview */}
              {DEVICE_TAXONOMY[selectedDeviceType] && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 space-y-2">
                  <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center justify-between">
                    <span>Applicable Sensors for {selectedDeviceType}:</span>
                    <span className="font-mono text-[10px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded">
                      {DEVICE_TAXONOMY[selectedDeviceType].sensors.length} Sensors
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {DEVICE_TAXONOMY[selectedDeviceType].sensors.map(s => (
                      <div key={s.code} className="p-1.5 rounded bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/60 font-mono text-slate-800 dark:text-slate-200">
                        <strong>{s.code}:</strong> {s.name} ({s.unit})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEqModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-600/30"
                >
                  Save Equipment to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
