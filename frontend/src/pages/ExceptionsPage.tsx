import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchExceptions } from '../services/api';
import { RecoveryCase } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton, EmptyState } from '../components/common/States';
import { AlertOctagon, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExceptionsPage: React.FC = () => {
  const [exceptions, setExceptions] = useState<RecoveryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExceptions().then((res) => {
      setExceptions(res.exceptions || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Exceptions" subtitle="Cases RecoverAI could not safely resolve automatically." />

        <main className="p-6 space-y-5 max-w-7xl mx-auto w-full">
          {/* Informational Banner */}
          <div className="p-4 rounded-xl bg-[#FFF6E5] border border-[#F7E3BE] text-xs text-[#B7791F] flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Human-in-the-Loop Operations Queue</span>
              <p className="text-[11px] text-[#B7791F]/90 mt-0.5">
                The Policy Engine suspends automated action when retry limits are reached or transaction anomaly rules trigger. This queue reinforces that the system knows when NOT to execute money actions automatically.
              </p>
            </div>
          </div>

          {/* Work Queue Table */}
          <Card padding="p-0" className="overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                <Skeleton height="h-10" />
                <Skeleton height="h-10" />
              </div>
            ) : exceptions.length === 0 ? (
              <EmptyState title="No active exceptions" subtitle="No cases require manual human intervention at this time." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F5] text-[#666666] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E7E7E3]">
                    <tr>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Issue</th>
                      <th className="p-3.5">Why AI Stopped</th>
                      <th className="p-3.5">Priority</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E7E3]">
                    {exceptions.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F7F7F5] transition-all">
                        <td className="p-3.5">
                          <div className="font-semibold text-[#171717]">{c.customer_name}</div>
                          <div className="text-[10px] text-[#8A8A8A]">{c.id}</div>
                        </td>
                        <td className="p-3.5 font-bold text-[#171717]">₹{c.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-[#666666]">{c.category.replace('_', ' ')}</td>
                        <td className="p-3.5 text-[#666666] max-w-xs">{c.policy_reason || c.root_cause || 'Maximum retries threshold reached.'}</td>
                        <td className="p-3.5">
                          <Badge variant={c.risk_level}>{c.risk_level}</Badge>
                        </td>
                        <td className="p-3.5">
                          <Badge variant={c.status}>{c.status === 'SAFELY_STOPPED' ? 'Stopped Safely' : 'Needs Review'}</Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <Button variant="secondary" size="sm" onClick={() => navigate(`/recovery/${c.id}`)}>
                            Review Case
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};
