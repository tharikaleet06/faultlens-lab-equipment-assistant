import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

export const SignUpPage = ({ onGoToLogin, onGoToLanding }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shadow-xl">
        <Lock className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-white">
        Public Registration Disabled
      </h2>
      <p className="text-xs text-slate-400 max-w-md">
        Self-registration is permanently disabled for FaultLens. Personnel accounts and role permissions are provisioned strictly by System Administrators.
      </p>
      <div className="pt-2">
        <button
          onClick={onGoToLogin}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Login Portal</span>
        </button>
      </div>
    </div>
  );
};
