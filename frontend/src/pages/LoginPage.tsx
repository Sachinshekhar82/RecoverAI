import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome to RecoverAI</h2>
          <p className="text-xs text-gray-400">Autonomous Revenue Recovery Platform for Razorpay Merchants</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">Merchant Email Address</label>
            <input type="email" defaultValue="merchant@acme.com" className="w-full bg-slate-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div className="space-y-1">
            <label className="text-gray-300 font-semibold">Password</label>
            <input type="password" defaultValue="••••••••••••" className="w-full bg-slate-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all"
          >
            Sign In to Merchant Console
          </button>
        </form>

        <div className="pt-4 border-t border-gray-800 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Razorpay Test Mode & Policy Guard Protected
        </div>
      </div>
    </div>
  );
};
