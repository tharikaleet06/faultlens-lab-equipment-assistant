import React, { useState } from 'react';
import { 
  Activity, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft
} from 'lucide-react';
import { authService } from '../services/api';

export const LoginPage = ({
  onLoginSuccess,
  onGoToLanding,
  id
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await authService.login(cleanEmail, password);
      if (data && data.user) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id={id || 'login-page'} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      {onGoToLanding && (
        <div className="absolute top-6 left-6">
          <button
            id="btn-back-to-landing"
            type="button"
            onClick={onGoToLanding}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Launch Page</span>
          </button>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-700 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <Activity className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          Laboratory Access Portal
        </h2>
        <p className="text-xs text-slate-400">
          Sign in to access equipment telemetry, AI failure predictions, and work orders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-6">
          {error && (
            <div id="login-error-alert" className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Clean Credentials Form: Email or Username, Password, Login button */}
          <form id="login-form" noValidate onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-semibold text-slate-300 mb-1">
                Email / Personnel ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  type="text"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@faultlens.lab or technician@faultlens.lab"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Provisioning Note */}
          <div className="text-center pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Personnel accounts &amp; role permissions are managed strictly by </span>
            <strong className="text-indigo-400 font-semibold">System Administrators</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
