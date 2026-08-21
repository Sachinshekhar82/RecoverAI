import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AnalyticsPage: React.FC = () => {
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
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Analytics" subtitle="Root-cause metrics and conversion funnel analysis." />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="p-5">
              <h3 className="text-sm font-bold text-[#171717] mb-1">Top Payment Failure Causes</h3>
              <p className="text-xs text-[#666666] mb-4">Distribution across 200 monitored cases</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={failureReasonData} layout="vertical">
                    <XAxis type="number" stroke="#8A8A8A" fontSize={11} />
                    <YAxis dataKey="reason" type="category" stroke="#171717" fontSize={11} width={140} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#20221F" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card padding="p-5">
              <h3 className="text-sm font-bold text-[#171717] mb-1">Recovery Conversion Funnel</h3>
              <p className="text-xs text-[#666666] mb-4">DETECT &rarr; DIAGNOSE &rarr; DECIDE &rarr; EXECUTE &rarr; VERIFY</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <XAxis dataKey="step" stroke="#8A8A8A" fontSize={11} />
                    <YAxis stroke="#8A8A8A" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#197A55" radius={[4, 4, 0, 0]} />
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
