import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchSubscriptions } from '../services/api';
import { RecoveryCase } from '../types';
import { RefreshCw, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SubscriptionsPage: React.FC = () => {
  const [subs, setSubs] = useState<RecoveryCase[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions().then((res) => setSubs(res.subscriptions || []));
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Module 8 — Failed Subscription Dunning Recovery" subtitle="Structured retry lifecycle: Attempt 1 → Cooldown → Attempt 2 → Reminder → Attempt 3 → STOPPED" />

        <main className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
            <span className="font-bold">Subscription Dunning Lifecycle:</span> Automated retries occur across 3 configured windows. If all 3 attempts fail, Policy Engine enforces a strict recovery halt and flags case as <strong>STOPPED</strong>.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {subs.map((s) => (
              <div key={s.id} className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-sm">{s.customer_name}</h5>
                    <p className="text-xs text-gray-400">{s.customer_email}</p>
                  </div>
                  <span className="text-sm font-black text-emerald-400">₹{s.amount.toLocaleString('en-IN')} / mo</span>
                </div>

                {/* Attempt Progress Stepper */}
                <div className="p-3 rounded-xl bg-slate-950 border border-gray-800 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Subscription Retry Progression</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    <div className={`p-2 rounded font-bold ${s.payment_attempts >= 1 ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'bg-gray-800 text-gray-500'}`}>
                      Attempt 1
                    </div>
                    <div className={`p-2 rounded font-bold ${s.payment_attempts >= 2 ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'bg-gray-800 text-gray-500'}`}>
                      Attempt 2
                    </div>
                    <div className={`p-2 rounded font-bold ${s.payment_attempts >= 3 ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'bg-gray-800 text-gray-500'}`}>
                      Attempt 3
                    </div>
                    <div className={`p-2 rounded font-bold ${s.status === 'SAFELY_STOPPED' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-gray-800 text-gray-500'}`}>
                      STOPPED
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-400">Status: <strong className="text-white">{s.status}</strong></span>
                  <button
                    onClick={() => navigate(`/recovery/${s.id}`)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all text-xs flex items-center gap-1"
                  >
                    Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
