import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchSubscriptions } from '../services/api';
import { RecoveryCase } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SubscriptionsPage: React.FC = () => {
  const [subs, setSubs] = useState<RecoveryCase[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions().then((res) => setSubs(res.subscriptions || []));
  }, []);

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Subscription Dunning Console" subtitle="Structured retry lifecycle for recurring billing failures" />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Dunning Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Active Subscriptions</span>
              <div className="text-2xl font-bold text-[#171717] mt-1">40</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Monitored Plans</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Failed Recurring Debits</span>
              <div className="text-2xl font-bold text-[#B42318] mt-1">40</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Mandate Declines</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">At-Risk MRR</span>
              <div className="text-2xl font-bold text-[#B42318] mt-1">₹78,000</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Monthly Recurring Volume</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Recovered MRR</span>
              <div className="text-2xl font-bold text-[#197A55] mt-1">₹42,500</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Captured via Dunning</p>
            </Card>
          </div>

          {/* Dunning Subscriptions List */}
          <Card padding="p-0" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] text-[#666666] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E7E7E3]">
                  <tr>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Dunning Retry Progression</th>
                    <th className="p-3.5">Recovery Probability</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E7E3]">
                  {subs.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F7F7F5] transition-all">
                      <td className="p-3.5">
                        <div className="font-semibold text-[#171717]">{s.customer_name}</div>
                        <div className="text-[10px] text-[#8A8A8A]">{s.customer_email}</div>
                      </td>
                      <td className="p-3.5 font-bold text-[#171717]">₹{s.amount.toLocaleString('en-IN')} / mo</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={`px-2 py-0.5 rounded font-bold ${s.payment_attempts >= 1 ? 'bg-[#F0F4FF] text-[#3B5CCC] border border-[#D0DDFB]' : 'bg-gray-100 text-gray-400'}`}>
                            Attempt 1
                          </span>
                          <span className="text-[#8A8A8A]">&rarr;</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${s.payment_attempts >= 2 ? 'bg-[#F0F4FF] text-[#3B5CCC] border border-[#D0DDFB]' : 'bg-gray-100 text-gray-400'}`}>
                            Attempt 2
                          </span>
                          <span className="text-[#8A8A8A]">&rarr;</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${s.payment_attempts >= 3 ? 'bg-[#F0F4FF] text-[#3B5CCC] border border-[#D0DDFB]' : 'bg-gray-100 text-gray-400'}`}>
                            Attempt 3
                          </span>
                          <span className="text-[#8A8A8A]">&rarr;</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${s.status === 'SAFELY_STOPPED' ? 'bg-[#FFF6E5] text-[#B7791F] border border-[#F7E3BE]' : 'bg-gray-100 text-gray-400'}`}>
                            STOPPED
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-[#171717]">{Math.round((s.recovery_probability || 0.75) * 100)}%</td>
                      <td className="p-3.5">
                        <Badge variant={s.status}>{s.status}</Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/recovery/${s.id}`)}>
                          Review Case
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};
