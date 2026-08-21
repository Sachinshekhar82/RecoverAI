import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const failureReasonData = [
    { reason: 'Gateway 2FA Timeout', count: 72, color: '#0F172A' },
    { reason: 'Insufficient Funds', count: 48, color: '#334155' },
    { reason: 'Expired Card / Mandate', count: 36, color: '#475569' },
    { reason: 'Abandoned Checkout', count: 28, color: '#64748B' },
    { reason: 'Overdue AP Approval', count: 16, color: '#94A3B8' },
  ];

  const funnelData = [
    { step: '1. Detect Risk', count: 200, color: '#0F172A' },
    { step: '2. AI Diagnose', count: 200, color: '#1E293B' },
    { step: '3. Policy Check', count: 146, color: '#3B5CCC' },
    { step: '4. Execute Action', count: 115, color: '#D97706' },
    { step: '5. Verify Recovered', count: 91, color: '#047857' },
  ];

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F172A] text-white p-3 rounded-lg shadow-xl border border-[#334155] text-xs font-sans space-y-1">
          <p className="font-bold text-[#94A3B8] border-b border-[#334155] pb-1">{label}</p>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="font-semibold text-slate-300">Volume:</span>
            <span className="font-mono font-bold text-white text-sm">{payload[0].value} Cases</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analytics & Revenue Insights" subtitle="Root-cause distribution and conversion funnel analysis." />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="p-5" className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Top Payment Failure Root Causes</h3>
                <p className="text-xs text-[#64748B]">Breakdown across 200 monitored transactions</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={failureReasonData} layout="vertical">
                    <XAxis type="number" stroke="#64748B" fontSize={11} />
                    <YAxis dataKey="reason" type="category" stroke="#0F172A" fontSize={11} width={150} tickLine={false} />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {failureReasonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card padding="p-5" className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Recovery Conversion Funnel</h3>
                <p className="text-xs text-[#64748B]">DETECT &rarr; DIAGNOSE &rarr; DECIDE &rarr; EXECUTE &rarr; VERIFY</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <XAxis dataKey="step" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
