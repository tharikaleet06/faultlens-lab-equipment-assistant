import React, { useState } from 'react';
import { EquipmentCard } from '../components/EquipmentCard';
import { Search, Filter, Cpu, Plus, SlidersHorizontal } from 'lucide-react';

export const EquipmentPage = ({
  equipmentList = [],
  currentUser,
  onSelectEquipment,
  onDiagnoseEquipment,
  onGenerateTicket,
  onNavigateToAdmin,
  id
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  const safeEquipment = Array.isArray(equipmentList) ? equipmentList : [];
  const roleStr = currentUser?.role || '';
  const isAdmin = String(roleStr).replace('ROLE_', '') === 'ADMIN';

  const categories = [
    'ALL',
    '3D Printer',
    'CNC Machine',
    'Electron Microscope',
    'Centrifuge',
    'Oscilloscope',
    'Server',
    'Chromatography'
  ];

  const filteredEquipment = safeEquipment.filter((eq) => {
    const matchesSearch =
      (eq?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eq?.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eq?.manufacturer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eq?.activeErrorCode && eq.activeErrorCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || (eq?.category || '').toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesRisk = selectedRisk === 'ALL' || eq?.failureRisk === selectedRisk;

    return matchesSearch && matchesCategory && matchesRisk;
  });

  return (
    <div id={id || 'equipment-page'} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isAdmin ? 'Laboratory Equipment Management & Catalog' : 'My Assigned Equipment'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAdmin 
              ? 'View available lab equipment, search assets, review operating history, and register new instruments' 
              : 'Real-time telemetry, failure history, operating limits, and predictive RUL tracking for assigned assets'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Equipment</span>
            </button>
          )}
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {filteredEquipment.length} Assets Listed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by equipment name, ID, or error code (e.g., E45)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Categories</option>
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Dropdown */}
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Failure Risk Levels</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk (Nominal)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Cpu className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No equipment matches your filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing the search query or risk filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEquipment.map((eq) => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              onSelect={onSelectEquipment}
              onDiagnose={onDiagnoseEquipment}
              onGenerateTicket={onGenerateTicket}
            />
          ))}
        </div>
      )}
    </div>
  );
};
