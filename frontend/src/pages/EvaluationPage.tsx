import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchBatchEvaluation } from '../services/api';
import { BatchEvaluation } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, BarChart3, Activity } from 'lucide-react';

export const EvaluationPage: React.FC = () => {
  const [evalData, setEvalData] = useState<BatchEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatchEvaluation()
      .then((res) => {
        setEvalData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !evalData) {
    return (
      <div className="flex h-screen bg-slate-950 text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-blue-400 font-semibold text-lg">
            <Activity className="w-6 h-6 animate-spin" /> Running Batch Evaluation Engine...
          </div>
        </div>
      </div>
    );
  }

  const catMap = evalData.by_category || {};

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Batch Evaluation Suite" subtitle="Programmatically calculated performance metrics on 200 synthetic test records" />

        <main className="p-6 space-y-6">
          {/* Main Batch Headline Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 shadow-xl flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 uppercase tracking-wider">
                Batch Evaluation
              </span>
              <h3 className="text-3xl font-black text-white mt-2">
                200 Test Records Analyzed
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-xl">
                Demonstrates end-to-end detection, AI root-cause diagnosis, policy engine enforcement, and verified revenue recovery.
              </p>
            </div>

            <div className="flex items-center gap-6 border-l border-gray-800 pl-6">
              <div>
                <span className="text-xs text-gray-400 font-medium">Recovery Rate</span>
                <p className="text-3xl font-black text-emerald-400">{evalData.recovery_rate}%</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium">Total Recovered</span>
                <p className="text-3xl font-black text-blue-400">₹{evalData.total_revenue_recovered.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="p-4 rounded-xl bg-slate-900 border border-gray-800">
              <span className="text-xs text-gray-400 font-medium">Successful Recovery Cases</span>
              <h4 className="text-2xl font-bold text-emerald-400 mt-1">{evalData.successful_recovery_cases}</h4>
              <p className="text-[10px] text-gray-500 mt-1">Verified Payment Captures</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-gray-800">
              <span className="text-xs text-gray-400 font-medium">Failed Recovery Attempts</span>
              <h4 className="text-2xl font-bold text-red-400 mt-1">{evalData.failed_recovery_cases}</h4>
              <p className="text-[10px] text-gray-500 mt-1">Bank Authorization Declines</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-gray-800">
              <span className="text-xs text-gray-400 font-medium">Safely Stopped Cases</span>
              <h4 className="text-2xl font-bold text-amber-400 mt-1">{evalData.safely_stopped_cases}</h4>
              <p className="text-[10px] text-gray-500 mt-1">Max Attempts Limit Enforced</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-gray-800">
              <span className="text-xs text-gray-400 font-medium">Unresolved Exceptions</span>
              <h4 className="text-2xl font-bold text-indigo-400 mt-1">{evalData.unresolved_exceptions}</h4>
              <p className="text-[10px] text-gray-500 mt-1">Escalated for Merchant Review</p>
            </div>
          </div>

          {/* Recovery Breakdown by Category */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white">Recovery Performance by Category</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(catMap).map(([catKey, catVal]) => (
                <div key={catKey} className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-sm">{catKey.replace('_', ' ')}</h5>
                    <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-xs">
                      {catVal.recovery_rate}% Recovery Rate
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-800">
                    <div>
                      <span className="text-gray-400">Total Cases</span>
                      <p className="font-bold text-gray-200">{catVal.total_cases}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">At Risk</span>
                      <p className="font-bold text-red-400">₹{catVal.revenue_at_risk.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Recovered</span>
                      <p className="font-bold text-emerald-400">₹{catVal.revenue_recovered.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${catVal.recovery_rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
