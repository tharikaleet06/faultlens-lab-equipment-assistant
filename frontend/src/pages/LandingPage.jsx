import React from 'react';
import { 
  Activity, 
  Bot, 
  TrendingUp, 
  Wrench, 
  ShieldCheck, 
  Server, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Zap, 
  Database, 
  FileText,
  Clock,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const LandingPage = ({
  onEnterApp,
  onGoToLogin,
  id
}) => {
  return (
    <div id={id || 'landing-page'} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Launching Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight font-mono text-white">
                  FaultLens
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 uppercase tracking-wide">
                  SLM • IoT • RAG
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                Lab Equipment Failure Prediction &amp; Maintenance Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Sign In to Console</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PS5 Problem Statement: Intelligent Laboratory Reliability Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Predict Equipment Failures <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Before They Halt Laboratory Sessions
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Laboratories house critical 3D printers, CNC mills, electron microscopes, ultracentrifuges, and servers. FaultLens unifies 
            <strong> Sensor Telemetry + Maintenance Logs + Manuals + SLM AI</strong> to detect anomalies, estimate remaining useful life, and guide technicians step-by-step.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In with Lab Role</span>
            </button>

            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <span>Direct Console Preview</span>
            </button>
          </div>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
              <div className="text-2xl font-black text-indigo-400 font-mono">99.4%</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">Anomaly Sensitivity</div>
              <div className="text-[11px] text-slate-500">Isolation Forest ML detection</div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
              <div className="text-2xl font-black text-emerald-400 font-mono">0 Session Halts</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">Downtime Prevention</div>
              <div className="text-[11px] text-slate-500">Shift to predictive scheduling</div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
              <div className="text-2xl font-black text-amber-400 font-mono">1,400+ Pages</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">RAG Manual Citations</div>
              <div className="text-[11px] text-slate-500">Official OEM service guides</div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
              <div className="text-2xl font-black text-sky-400 font-mono">5 Microservices</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">Spring Cloud Gateway</div>
              <div className="text-[11px] text-slate-500">MySQL 8.0 + Python AI engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Paradigm Shift Strip */}
      <section className="py-8 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                The Maintenance Paradigm Transformation
              </div>
              <div className="text-sm font-semibold text-white">
                Reversing the reactive failure cycle into autonomous asset protection
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 line-through">
                Equipment Fails → Panic Repairs
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-bold">
                Detect Anomaly → Predict Failure → Schedule Maintenance → Zero Stoppage
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              End-to-End Predictive Maintenance Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed for universities, advanced manufacturing laboratories, and research institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                1. Edge Sensor Telemetry
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingests Temperature, Vibration RMS, Voltage, and Current load every second. Automatic baseline anomaly detection via Isolation Forest and dynamic Z-score calculations flags thermal drift before trips.
              </p>
              <div className="text-[11px] font-mono text-orange-400/90 pt-2 border-t border-slate-800">
                • Threshold crossing alarms<br/>
                • Harmonic frequency resonance<br/>
                • Operating hours logging
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                2. SLM RAG Diagnostic Assistant
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grounds queries against OEM manuals, error codes (e.g., E45 Chiller Throttling, E12 Spindle Wear), and technician logs. Provides structured diagnosis: Causes, Checks, and Step-by-Step Resolution.
              </p>
              <div className="text-[11px] font-mono text-indigo-400/90 pt-2 border-t border-slate-800">
                • Formlabs, Haas, Keysight, Beckman<br/>
                • Zero hallucination manual grounding<br/>
                • Consumables &amp; spare parts linkage
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                3. Automated Work Orders &amp; Inventory
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically creates prioritized maintenance tickets (P1 to P4) before failures occur. Allocates required spare parts from warehouse stock and assigns certified lab technicians.
              </p>
              <div className="text-[11px] font-mono text-emerald-400/90 pt-2 border-t border-slate-800">
                • 1-Click autonomous ticket creation<br/>
                • Spare parts inventory availability<br/>
                • Restores health score on resolution
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Access Control (RBAC) Section */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Role Security Model</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Role-Based Access Control (RBAC)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Each laboratory persona has designated operational permissions backed by JWT security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-950 p-6 rounded-xl border border-purple-900/40 space-y-3 shadow-lg shadow-purple-950/20">
              <div className="inline-block px-3 py-1 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60 font-bold text-xs font-mono">
                ADMIN
              </div>
              <h3 className="text-base font-bold text-white">System Administrator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full administrative control: add/manage equipment, provision technician accounts, view notifications, and configure platform settings.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Provision Technicians & Add Equipment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Fleet Monitoring & Admin Notifications</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-emerald-900/40 space-y-3 shadow-lg shadow-emerald-950/20">
              <div className="inline-block px-3 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-bold text-xs font-mono">
                TECHNICIAN
              </div>
              <h3 className="text-base font-bold text-white">Maintenance Technician</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Operational maintenance access: view assigned equipment, monitor telemetry, run SLM Assistant, execute failure predictions, and record maintenance logs.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Telemetry Monitoring & SLM AI Assistant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ML Failure Predictions & Maintenance Logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call-to-Action */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-mono font-bold text-slate-400">FaultLens System</span> • Enterprise Laboratory Predictive Maintenance
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onGoToLogin} className="hover:text-slate-300">Sign In</button>
            <button onClick={onGoToLogin} className="hover:text-slate-300">Launch Platform</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
