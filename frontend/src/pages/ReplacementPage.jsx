import React, { useState } from 'react';
import { 
  RefreshCw, 
  ShieldAlert, 
  Award, 
  TrendingDown, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Boxes, 
  ArrowRight,
  Sparkles,
  Bot,
  FileText,
  Building2,
  Check,
  Plus,
  Wrench,
  Sliders
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';

const OEM_COMPARISON_DATA = {
  '3D_PRINTER': {
    categoryName: 'Industrial SLA/SLS 3D Printers',
    models: [
      {
        brand: 'Formlabs',
        model: 'Form 4L Industrial SLA',
        acquisitionCost: 18500,
        annualFailureRatePct: 4.2,
        mtbfHours: 8500,
        avgAnnualMaintenanceUsd: 1200,
        fiveYearTcoUsd: 24500,
        costEfficiencyScore: 92,
        isBestChoice: true,
        bestChoiceRationale: 'Highest MTBF in class, lowest annual maintenance cost ($1,200/yr), and 32% lower 5-year TCO compared to Stratasys.',
        pros: ['Closed-loop resin wiper', 'Fast 4-hour tank swap', 'Low consumable cost'],
        cons: ['Limited build volume compared to industrial powder bed']
      },
      {
        brand: 'Stratasys',
        model: 'Origin One P3 SLA',
        acquisitionCost: 32000,
        annualFailureRatePct: 7.8,
        mtbfHours: 6200,
        avgAnnualMaintenanceUsd: 2800,
        fiveYearTcoUsd: 46000,
        costEfficiencyScore: 74,
        isBestChoice: false,
        bestChoiceRationale: 'Higher initial acquisition cost and $2,800/yr annual service contract.',
        pros: ['High temperature resin support', 'Industrial open material system'],
        cons: ['High annual contract fee', 'Higher laser calibration drift']
      },
      {
        brand: 'Markforged',
        model: 'FX20 Carbon Fiber SLA',
        acquisitionCost: 45000,
        annualFailureRatePct: 6.1,
        mtbfHours: 7100,
        avgAnnualMaintenanceUsd: 3100,
        fiveYearTcoUsd: 60500,
        costEfficiencyScore: 68,
        isBestChoice: false,
        bestChoiceRationale: 'Premium pricing for specialized composite materials.',
        pros: ['Continuous fiber reinforcement', 'High tensile strength parts'],
        cons: ['Proprietary filament lock-in', 'Expensive replacement nozzles']
      }
    ]
  },
  'CNC_MACHINE': {
    categoryName: '3-Axis Precision CNC Machining Centers',
    models: [
      {
        brand: 'Mazak',
        model: 'VCN-430L 3-Axis Vertical Mill',
        acquisitionCost: 52000,
        annualFailureRatePct: 3.1,
        mtbfHours: 14500,
        avgAnnualMaintenanceUsd: 1850,
        fiveYearTcoUsd: 61250,
        costEfficiencyScore: 95,
        isBestChoice: true,
        bestChoiceRationale: 'Recommended Best Choice: Lowest annual failure rate (3.1%), superior ceramic spindle bearing thermal stability, and saves $28,400 over 5 years vs Haas Mini Mill.',
        pros: ['Ceramic hybrid spindle bearings', 'Direct-drive ball screws', 'Automatic thermal compensation'],
        cons: ['Requires 3-phase high amperage line']
      },
      {
        brand: 'Haas Automation',
        model: 'Mini Mill HE-30',
        acquisitionCost: 45000,
        annualFailureRatePct: 9.4,
        mtbfHours: 7800,
        avgAnnualMaintenanceUsd: 4200,
        fiveYearTcoUsd: 66000,
        costEfficiencyScore: 71,
        isBestChoice: false,
        bestChoiceRationale: 'Higher spindle harmonic resonance degradation rate requiring frequent bearing replacements.',
        pros: ['Compact footprint', 'Widely available spare parts network'],
        cons: ['High cumulative repair cost ratio', 'Frequent way-lube filter clogs']
      },
      {
        brand: 'DMG MORI',
        model: 'CMX 600 V Vertical Machining',
        acquisitionCost: 78000,
        annualFailureRatePct: 4.0,
        mtbfHours: 13200,
        avgAnnualMaintenanceUsd: 2400,
        fiveYearTcoUsd: 90000,
        costEfficiencyScore: 82,
        isBestChoice: false,
        bestChoiceRationale: 'Excellent reliability but high initial capital investment.',
        pros: ['Rigid C-frame cast iron body', '3D Siemens Touch CNC control'],
        cons: ['High initial acquisition cost']
      }
    ]
  },
  'CENTRIFUGE': {
    categoryName: 'High-Speed Ultracentrifuges (100k RPM)',
    models: [
      {
        brand: 'Thermo Fisher',
        model: 'Sorvall WX+ 100 Ultra',
        acquisitionCost: 58000,
        annualFailureRatePct: 2.8,
        mtbfHours: 15800,
        avgAnnualMaintenanceUsd: 1400,
        fiveYearTcoUsd: 65000,
        costEfficiencyScore: 94,
        isBestChoice: true,
        bestChoiceRationale: 'Recommended Best Choice: Thermoelectric cooling system eliminates diffusion pump oil leaks, reducing failure rate to 2.8% and saving $14,000 in repairs.',
        pros: ['Solid-state thermoelectric cooling', 'Quiet drive shaft coupling', 'Zero oil mist emissions'],
        cons: ['Rotor buckets sold separately']
      },
      {
        brand: 'Beckman Coulter',
        model: 'Optima XPN-100 Ultra',
        acquisitionCost: 62000,
        annualFailureRatePct: 8.9,
        mtbfHours: 6400,
        avgAnnualMaintenanceUsd: 3700,
        fiveYearTcoUsd: 80500,
        costEfficiencyScore: 69,
        isBestChoice: false,
        bestChoiceRationale: 'Vacuum diffusion pump seal leaks occur every 3.8 operating years under heavy usage.',
        pros: ['15-inch color touch screen', 'Remote monitoring app'],
        cons: ['Diffusion pump oil seal degradation', 'High vacuum filter replacement frequency']
      }
    ]
  },
  'MASS_SPECTROMETER': {
    categoryName: 'Cyclic IMS & Quadrupole Mass Spectrometers',
    models: [
      {
        brand: 'Agilent Technologies',
        model: '6495D Triple Quad LC/MS',
        acquisitionCost: 285000,
        annualFailureRatePct: 3.5,
        mtbfHours: 16200,
        avgAnnualMaintenanceUsd: 4500,
        fiveYearTcoUsd: 307500,
        costEfficiencyScore: 96,
        isBestChoice: true,
        bestChoiceRationale: 'Recommended Best Choice: iFunnel ion sampling technology provides 4x higher sensitivity with 3.5% failure rate and $47,000 lower 5-year TCO.',
        pros: ['Dual-stage ion funnel', 'Low capillary degradation rate', 'Automated tuning'],
        cons: ['Requires high-purity nitrogen generator']
      },
      {
        brand: 'Waters Corporation',
        model: 'SELECT SERIES Cyclic IMS',
        acquisitionCost: 310000,
        annualFailureRatePct: 11.2,
        mtbfHours: 8700,
        avgAnnualMaintenanceUsd: 9800,
        fiveYearTcoUsd: 359000,
        costEfficiencyScore: 64,
        isBestChoice: false,
        bestChoiceRationale: 'RF multipole harmonic distortion requires frequent board replacements.',
        pros: ['Cyclic ion mobility separation', 'High resolution mass spec'],
        cons: ['High cumulative maintenance cost ($325,000)', 'Frequent ESI needle erosion']
      }
    ]
  }
};

const INITIAL_REPLACEMENT_RECORDS = [
  {
    id: 'REP-2026-001',
    equipmentId: 'EQ-CNC-04',
    equipmentName: 'Haas Mini Mill 3-Axis CNC Machining Center',
    retiredOemBrand: 'Haas Automation',
    recommendedOemBrand: 'Mazak (VCN-430L)',
    acquisitionCostUsd: 45000,
    cumulativeRepairCostUsd: 48200,
    costRatioPct: 107,
    replacementReason: 'Cumulative repair costs ($48,200) exceeded 100% of asset value. Spindle bearing harmonic failure (Error E12).',
    status: 'RECOMMENDED_FOR_REPLACEMENT',
    dateLogged: '2026-06-15',
    projectedFiveYearSavingsUsd: 28400,
    loggedBy: 'Dr. Arthur Sterling (Admin)'
  },
  {
    id: 'REP-2026-002',
    equipmentId: 'EQ-LMS-10',
    equipmentName: 'Waters SELECT SERIES Cyclic IMS Mass Spectrometer',
    retiredOemBrand: 'Waters Corporation',
    recommendedOemBrand: 'Agilent (6495D Triple Quad)',
    acquisitionCostUsd: 310000,
    cumulativeRepairCostUsd: 325000,
    costRatioPct: 105,
    replacementReason: 'RF multipole power stage failure (Error E92) and capillary erosion. Maintenance costs surpassed acquisition value.',
    status: 'RECOMMENDED_FOR_REPLACEMENT',
    dateLogged: '2026-07-02',
    projectedFiveYearSavingsUsd: 47000,
    loggedBy: 'Alex Vance (Technician)'
  },
  {
    id: 'REP-2025-004',
    equipmentId: 'EQ-OLD-3D-09',
    equipmentName: 'Formlabs Form 2 Desktop Printer (Legacy)',
    retiredOemBrand: 'Formlabs',
    recommendedOemBrand: 'Formlabs (Form 4L Industrial)',
    acquisitionCostUsd: 3500,
    cumulativeRepairCostUsd: 4100,
    costRatioPct: 117,
    replacementReason: 'Laser galvo optical degradation after 6 years of continuous service. Upgraded to Form 4L SLA.',
    status: 'REPLACED_AND_DECOMMISSIONED',
    dateLogged: '2025-11-20',
    projectedFiveYearSavingsUsd: 8200,
    loggedBy: 'Dr. Elena Rostova (Technician)'
  }
];

export const ReplacementPage = ({
  equipmentList = [],
  currentUser = {},
  id
}) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'comparison' | 'advisor'
  const [selectedCategory, setSelectedCategory] = useState('CNC_MACHINE');
  const [selectedEqId, setSelectedEqId] = useState(equipmentList[0]?.id || 'EQ-CNC-04');
  const [replacementRecords, setReplacementRecords] = useState(INITIAL_REPLACEMENT_RECORDS);
  const [showLogModal, setShowLogModal] = useState(false);

  const safeEquipment = Array.isArray(equipmentList) ? equipmentList : [];
  const selectedEq = safeEquipment.find(e => e.id === selectedEqId) || safeEquipment[0] || {};
  const currentCategoryData = OEM_COMPARISON_DATA[selectedCategory] || OEM_COMPARISON_DATA['CNC_MACHINE'];

  // Form state for logging a replacement decision
  const [logEqId, setLogEqId] = useState(safeEquipment[0]?.id || '');
  const [logReason, setLogReason] = useState('');
  const [logRecommendedBrand, setLogRecommendedBrand] = useState('Mazak (VCN-430L)');

  const handleCreateReplacementRecord = (e) => {
    e.preventDefault();
    const targetEq = safeEquipment.find(e => e.id === logEqId) || safeEquipment[0];
    const newRecord = {
      id: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      equipmentId: targetEq.id,
      equipmentName: targetEq.name,
      retiredOemBrand: targetEq.manufacturer || 'Current OEM',
      recommendedOemBrand: logRecommendedBrand,
      acquisitionCostUsd: targetEq.originalCostUsd || 40000,
      cumulativeRepairCostUsd: targetEq.cumulativeRepairCostUsd || 12000,
      costRatioPct: Math.round(((targetEq.cumulativeRepairCostUsd || 12000) / (targetEq.originalCostUsd || 40000)) * 100),
      replacementReason: logReason || 'Calculated financial repair ratio exceeded replacement threshold.',
      status: 'RECOMMENDED_FOR_REPLACEMENT',
      dateLogged: new Date().toISOString().split('T')[0],
      projectedFiveYearSavingsUsd: 18500,
      loggedBy: `${currentUser.name || 'User'} (${currentUser.role === 'ROLE_ADMIN' ? 'Admin' : 'Technician'})`
    };

    setReplacementRecords([newRecord, ...replacementRecords]);
    setShowLogModal(false);
    setLogReason('');
  };

  const calculateCostRatio = (repCost, origCost) => {
    if (!origCost || origCost === 0) return 0;
    return Math.round((repCost / origCost) * 100);
  };

  return (
    <div id={id || 'replacement-page'} className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Financial Decision Engine &amp; Procurement Hub</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span>Equipment Replacement Records &amp; OEM Brand Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Track equipment retirement ledgers, evaluate similar products across competing manufacturers based on annual failure rates and repair costs, and identify the most cost-efficient replacement alternatives.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Replacement Record</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Replacement Records Ledger ({replacementRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'comparison'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>OEM Brand &amp; Model Comparison ("Which is Best?")</span>
        </button>

        <button
          onClick={() => setActiveTab('advisor')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'advisor'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Replacement &amp; Procurement Advisor</span>
        </button>
      </div>

      {/* TAB 1: REPLACEMENT RECORDS LEDGER */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Replacement Records</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{replacementRecords.length}</div>
              <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Active replacement audit tracking</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-1">
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">Flagged for Replacement (&gt;100% Cost Ratio)</div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {replacementRecords.filter(r => r.status === 'RECOMMENDED_FOR_REPLACEMENT').length} Assets
              </div>
              <div className="text-[11px] text-slate-500">Cumulative repairs exceed original asset value</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-1">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Projected 5-Year TCO Savings</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ${replacementRecords.reduce((sum, r) => sum + (r.projectedFiveYearSavingsUsd || 0), 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">By procuring recommended best-value OEM models</div>
            </div>
          </div>

          {/* Replacement Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Equipment &amp; Component Replacement Ledger</span>
              </h2>
              <span className="text-xs text-slate-500">Accessible by Admin &amp; Technician personas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4 whitespace-nowrap">Record ID &amp; Date</th>
                    <th className="p-4 min-w-[180px]">Target Equipment</th>
                    <th className="p-4 min-w-[220px]">Retired OEM → Recommended OEM</th>
                    <th className="p-4 whitespace-nowrap">Financial Repair Ratio</th>
                    <th className="p-4 min-w-[260px]">Replacement Rationale</th>
                    <th className="p-4 whitespace-nowrap">Projected Savings</th>
                    <th className="p-4 whitespace-nowrap text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 align-top">
                  {replacementRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                        {rec.id}
                        <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">{rec.dateLogged}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">By: {rec.loggedBy}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        <div className="leading-snug">{rec.equipmentName}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">{rec.equipmentId}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-1.5 font-medium leading-snug">
                          <span className="text-slate-400 line-through text-xs">{rec.retiredOemBrand}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{rec.recommendedOemBrand}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] ${
                          rec.costRatioPct >= 100 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}>
                          {rec.costRatioPct}% Ratio
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1.5 font-normal whitespace-nowrap">
                          ${rec.cumulativeRepairCostUsd?.toLocaleString('en-US')} / ${rec.acquisitionCostUsd?.toLocaleString('en-US')}
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300 text-xs leading-relaxed max-w-sm">
                        {rec.replacementReason}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        <div>+${rec.projectedFiveYearSavingsUsd?.toLocaleString('en-US')}</div>
                        <div className="text-[10px] text-slate-400 font-normal font-sans">over 5-yr TCO</div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <span className={`inline-block text-[10px] font-extrabold px-3 py-1 rounded-full border whitespace-nowrap ${
                          rec.status === 'RECOMMENDED_FOR_REPLACEMENT'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                            : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}>
                          {rec.status === 'RECOMMENDED_FOR_REPLACEMENT' ? 'REPLACEMENT REQUIRED' : 'DECOMMISSIONED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OEM BRAND & MODEL COMPARISON ("WHICH ONE IS BEST?") */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Category Selector */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Select Equipment Category Taxonomy:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white font-mono"
            >
              <option value="CNC_MACHINE">3-Axis CNC Machining Centers</option>
              <option value="3D_PRINTER">Industrial 3D Printers (SLA)</option>
              <option value="CENTRIFUGE">Ultracentrifuges (100k RPM)</option>
              <option value="MASS_SPECTROMETER">Cyclic IMS &amp; Mass Spectrometers</option>
            </select>
          </div>

          {/* Comparison Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                <span>OEM Product Reliability &amp; Cost-Efficiency Ranking for: <strong className="text-purple-600">{currentCategoryData.categoryName}</strong></span>
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {currentCategoryData.models.map((m, idx) => (
                <div
                  key={idx}
                  className={`bg-white dark:bg-slate-900 rounded-xl p-5 border transition-all duration-200 space-y-4 relative flex flex-col justify-between ${
                    m.isBestChoice
                      ? 'border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Best Choice Banner */}
                  {m.isBestChoice && (
                    <div className="absolute -top-3.5 left-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 fill-slate-950" />
                      <span>RECOMMENDED BEST VALUE CHOICE</span>
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-500">{m.brand}</span>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">{m.model}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                          Score: {m.costEfficiencyScore}/100
                        </div>
                        <div className="text-[10px] text-slate-400">Efficiency Index</div>
                      </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Annual Failure Rate</div>
                        <div className={`font-bold font-mono text-sm ${m.annualFailureRatePct < 5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {m.annualFailureRatePct}% / year
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">MTBF (Mean Time)</div>
                        <div className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                          {m.mtbfHours.toLocaleString()} hrs
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Avg Repair Cost</div>
                        <div className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                          ${m.avgAnnualMaintenanceUsd.toLocaleString()} / yr
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">5-Year TCO</div>
                        <div className="font-bold font-mono text-sm text-purple-600 dark:text-purple-400">
                          ${m.fiveYearTcoUsd.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Rationale */}
                    <div className={`p-3 rounded-lg text-xs leading-relaxed font-medium ${
                      m.isBestChoice
                        ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      <strong>Rationale:</strong> {m.bestChoiceRationale}
                    </div>

                    {/* Pros & Cons */}
                    <div className="space-y-2 text-xs pt-1">
                      <div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Key Advantages (Pros):
                        </span>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5 pl-1">
                          {m.pros.map((p, pIdx) => <li key={pIdx}>{p}</li>)}
                        </ul>
                      </div>

                      <div>
                        <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Trade-offs (Cons):
                        </span>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5 pl-1">
                          {m.cons.map((c, cIdx) => <li key={cIdx}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setActiveTab('advisor');
                        setLogRecommendedBrand(`${m.brand} (${m.model})`);
                      }}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        m.isBestChoice
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span>Select for Replacement Procurement</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI REPLACEMENT & PROCUREMENT ADVISOR */}
      {activeTab === 'advisor' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span>AI Procurement &amp; Replacement Recommender Engine</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Laboratory Equipment Asset Flagged for Audit:
                </label>
                <select
                  value={selectedEqId}
                  onChange={(e) => setSelectedEqId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {safeEquipment.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.id} — {eq.name} ({eq.failureRisk} Risk • ${eq.cumulativeRepairCostUsd?.toLocaleString() || 0} repairs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Algorithmic Financial Analysis</div>
                  <p className="leading-relaxed text-[11px] opacity-90">
                    Evaluates live cumulative maintenance expenditure against original asset cost. When repair ratio exceeds 65-100%, the AI engine queries OEM market reliability benchmarks to recommend the optimal replacement model.
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Equipment Evaluation Report */}
            {selectedEq && (
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {selectedEq.id}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedEq.name}</h3>
                    <div className="text-xs text-slate-500 font-medium">
                      Manufacturer: {selectedEq.manufacturer} • Model: {selectedEq.model} • Room: {selectedEq.labRoom || 'Lab 101'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <RiskBadge risk={selectedEq.failureRisk || 'LOW'} size="md" />
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                        Repair Ratio: {calculateCostRatio(selectedEq.cumulativeRepairCostUsd, selectedEq.originalCostUsd)}%
                      </div>
                      <div className="text-[10px] text-slate-400">Cumulative / Original</div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span>Current Financial Asset Status</span>
                    </div>
                    <div className="space-y-1 text-slate-600 dark:text-slate-300">
                      <div>Original Acquisition Cost: <strong>${selectedEq.originalCostUsd?.toLocaleString('en-US') || '35,000'}</strong></div>
                      <div>Cumulative Maintenance Cost: <strong>${selectedEq.cumulativeRepairCostUsd?.toLocaleString('en-US') || '4,500'}</strong></div>
                      <div>Engine Status Recommendation: <strong className="text-purple-600">{selectedEq.recommendation || 'MONITOR'}</strong></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>AI Top Recommended Market Replacement</span>
                    </div>
                    <div className="space-y-1">
                      <div>Recommended Model: <strong>Mazak VCN-430L / Agilent 6495D Series</strong></div>
                      <div>Projected Failure Rate Improvement: <strong className="text-emerald-600">62% lower annual failure rate</strong></div>
                      <div>Estimated 5-Year Maintenance Savings: <strong className="text-emerald-600">$28,400 TCO savings</strong></div>
                    </div>
                  </div>
                </div>

                {/* Alternative Replacement Strategies & Ideas for High-Issue Assets */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-purple-600" />
                        <span>Alternative Replacement Strategies &amp; Solutions for High-Issue Equipment</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        When a machine has high failure rates, full brand replacement isn't the only option. Explore modular overhauls, digital retrofits, leasing, or consolidation.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Strategy 1: Modular Component Replacement */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Wrench className="w-4 h-4 text-indigo-500" />
                          <span>1. Modular Subsystem Overhaul</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded">
                          75% CapEx Savings
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Replace only the recurring failing core sub-assembly (e.g. Ceramic Spindle Cartridge, Turbo Vacuum Pump, or Laser Galvo) while keeping the intact structural frame.
                      </p>
                      <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                        Best when: Main frame is structurally sound and failure is isolated to 1 subsystem.
                      </div>
                    </div>

                    {/* Strategy 2: OEM Digital Retrofit */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-amber-500" />
                          <span>2. OEM Factory Retrofit &amp; Digitization</span>
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded">
                          50% Cost vs New
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Upgrade legacy analog electronics, PLC controllers, and motors with a factory-authorized digital retrofit kit and live IoT telemetry sensors.
                      </p>
                      <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                        Best when: Mechanical bed is solid but electronic controls &amp; sensors are obsolete.
                      </div>
                    </div>

                    {/* Strategy 3: Equipment-as-a-Service (EaaS) */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span>3. Equipment-as-a-Service (EaaS) Lease</span>
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 rounded">
                          $0 Upfront CapEx
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Shift from a heavy upfront capital purchase to a monthly operating expense lease. Includes 24/7 OEM maintenance SLA, free part replacements, and 3-year upgrades.
                      </p>
                      <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                        Best when: Capital budget is tight and lab requires guaranteed 99.5% uptime SLA.
                      </div>
                    </div>

                    {/* Strategy 4: Workstation Consolidation */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-purple-500" />
                          <span>4. Fleet Workstation Consolidation</span>
                        </span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.5 rounded">
                          40% Footprint Savings
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Decommission 2 or 3 failing single-purpose machines and consolidate workload into 1 high-efficiency multi-tasking hybrid workstation (e.g. 5-Axis Mill-Turn or dual LC-MS).
                      </p>
                      <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                        Best when: Lab has multiple aging machines suffering from collective downtime.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setShowLogModal(true);
                      setLogEqId(selectedEq.id);
                    }}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Replacement Procurement Record for {selectedEq.id}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Log Replacement Decision */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Equipment Replacement Record</h3>
              </div>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateReplacementRecord} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Equipment *</label>
                <select
                  value={logEqId}
                  onChange={(e) => setLogEqId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  {safeEquipment.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.id} — {eq.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recommended Best-Value OEM Model *</label>
                <input
                  type="text"
                  required
                  value={logRecommendedBrand}
                  onChange={(e) => setLogRecommendedBrand(e.target.value)}
                  placeholder="e.g. Mazak VCN-430L 3-Axis Mill"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Replacement Rationale &amp; Financial Justification *</label>
                <textarea
                  rows={3}
                  required
                  value={logReason}
                  onChange={(e) => setLogReason(e.target.value)}
                  placeholder="Explain why replacement is recommended (e.g. repair cost exceeded 100% of asset value, frequent bearing micro-spalling)."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Replacement Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
