import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Settings, ShieldCheck, Key, CreditCard, Cpu } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Policy Engine & Integration Settings" subtitle="Configure deterministic AI safety bounds, Razorpay test keys, and Gemini LLM parameters" />

        <main className="p-6 max-w-4xl space-y-6">
          {/* Policy Engine Configuration */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-5">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Deterministic Policy Engine Safety Limits
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Maximum Automated Payment Retries</label>
                <input type="number" defaultValue={3} className="w-full bg-slate-950 border border-gray-800 rounded-lg p-2.5 text-white" />
                <p className="text-[10px] text-gray-500">Halts retries after N failed attempts (Default: 3)</p>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Maximum Customer Contact Attempts</label>
                <input type="number" defaultValue={2} className="w-full bg-slate-950 border border-gray-800 rounded-lg p-2.5 text-white" />
                <p className="text-[10px] text-gray-500">Prevents customer message spamming (Default: 2)</p>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Minimum Cooldown Window (Minutes)</label>
                <input type="number" defaultValue={30} className="w-full bg-slate-950 border border-gray-800 rounded-lg p-2.5 text-white" />
                <p className="text-[10px] text-gray-500">Required delay between retries (Default: 30 mins)</p>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Max Recovery Amount Threshold (₹)</label>
                <input type="number" defaultValue={500000} className="w-full bg-slate-950 border border-gray-800 rounded-lg p-2.5 text-white" />
                <p className="text-[10px] text-gray-500">High amount transactions escalate to human review</p>
              </div>
            </div>
          </div>

          {/* Razorpay Test Keys Status */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" /> Razorpay Test-Mode API Status
            </h4>

            <div className="p-4 rounded-xl bg-slate-950 border border-gray-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Razorpay Key ID</span>
                <span className="font-mono text-emerald-400">rzp_test_TS81e4x6YcQ00L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Razorpay Key Secret</span>
                <span className="font-mono text-emerald-400">XQ5xIiF00C3g6IQDPL7y8Zim</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <span className="text-gray-400">API Connection Status</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">CONNECTED & ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Gemini AI Status */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" /> Google Gemini AI API Status
            </h4>

            <div className="p-4 rounded-xl bg-slate-950 border border-gray-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Gemini API Key</span>
                <span className="font-mono text-emerald-400">AIzaSyAxv0ICU_...9YgRA</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <span className="text-gray-400">Model Engine</span>
                <span className="font-bold text-indigo-300">Gemini 1.5 Flash (Structured Outputs Enabled)</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
