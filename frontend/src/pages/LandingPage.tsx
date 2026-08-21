import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, TrendingUp, ShieldCheck, Zap, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Recover<span className="text-blue-500">AI</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">Razorpay AI Buildathon 2026 — Track 03</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-gray-300 hover:text-white transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            Launch Merchant Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
          Track 03 — AI Revenue Recovery
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Recover revenue before it's lost.
        </h1>

        <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          An autonomous AI agent platform that monitors merchant transaction data, diagnoses payment failures and checkout abandonments, and executes policy-guarded recovery workflows.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center gap-2"
          >
            Explore Dashboard <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/evaluation')}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-gray-800 border border-gray-800 text-gray-200 font-bold text-sm transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> View Batch Evaluation (200 Cases)
          </button>
        </div>

        {/* Central Product Loop Diagram */}
        <div className="pt-16">
          <div className="p-6 rounded-3xl bg-slate-900 border border-gray-800 shadow-2xl max-w-4xl mx-auto space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">The Central Product Loop</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 font-bold text-blue-400">DETECT</div>
              <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 font-bold text-indigo-400">DIAGNOSE</div>
              <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 font-bold text-purple-400">DECIDE</div>
              <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 font-bold text-emerald-400">EXECUTE</div>
              <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 font-bold text-amber-400">VERIFY</div>
              <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 font-bold text-cyan-400">MEASURE</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
