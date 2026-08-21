import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchBatchEvaluation } from '../services/api';
import { BatchEvaluation } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [evalData, setEvalData] = useState<BatchEvaluation | null>(null);

  useEffect(() => {
    fetchBatchEvaluation().then(setEvalData);
  }, []);

  const failureReasonData = [
    { reason: 'Gateway 2FA Timeout', count: 72 },
    { reason: 'Insufficient Funds', count: 48 },
    { reason: 'Expired Card / Mandate', count: 36 },
    { reason: 'Abandoned Checkout', count: 28 },
    { reason: 'Overdue AP Approval', count: 16 },
  ];

  const funnelData = [
    { step: 'Detected Risk', count: 200 },
    { step: 'AI Diagnosed', count: 200 },
    { step: 'Policy Approved', count: 146 },
    { step: 'Action Executed', count: 115 },
    { step: 'Verified Recovered', count: 91 },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Revenue Recovery Analytics & Funnel" subtitle="In-depth root cause statistics and conversion funnel analysis" />

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Failure Reason Bar Chart */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
              <h4 className="text-base font-bold text-white mb-1">Top Payment Failure Causes</h4>
              <p className="text-xs text-gray-400 mb-4">Distribution across 200 monitored cases</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={failureReasonData} layout="vertical">
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="reason" type="category" stroke="#9ca3af" fontSize={11} width={140} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recovery Funnel */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
              <h4 className="text-base font-bold text-white mb-1">Recovery Conversion Funnel</h4>
              <p className="text-xs text-gray-400 mb-4">DETECT &rarr; DIAGNOSE &rarr; DECIDE &rarr; EXECUTE &rarr; VERIFY</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <XAxis dataKey="step" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
