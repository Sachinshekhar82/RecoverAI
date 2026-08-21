import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchExceptions } from '../services/api';
import { RecoveryCase } from '../types';
import { AlertTriangle, ShieldCheck, UserCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExceptionsPage: React.FC = () => {
  const [exceptions, setExceptions] = useState<RecoveryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExceptions()
      .then((res) => {
        setExceptions(res.exceptions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Exceptions & Safely Stopped Cases" subtitle="Demonstrating bounded AI behavior — cases where AI safely halted or requested human review" />

        <main className="p-6 space-y-6">
          {/* Information Card */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-amber-200">Bounded Safety Controls Active</p>
              <p className="text-[11px] text-amber-400/90 mt-0.5">
                The Policy Engine prevents infinite loops, customer spam, and unauthorized high-value transactions. Below are cases where automated recovery was intentionally suspended or flagged for merchant operations review.
              </p>
            </div>
          </div>

          {/* Exceptions Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-800/50 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Case ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Stopping / Escalation Reason</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {exceptions.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-800/30 transition-all">
                      <td className="p-3 font-bold text-amber-400">{c.id}</td>
                      <td className="p-3 font-semibold text-white">{c.customer_name}</td>
                      <td className="p-3 font-bold text-white">₹{c.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium">
                          {c.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          c.status === 'SAFELY_STOPPED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {c.status === 'SAFELY_STOPPED' ? 'Recovery Stopped Safely' : 'Needs Human Review'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-300 max-w-sm">
                        {c.policy_reason || c.root_cause || 'Maximum automated retry limits reached.'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => navigate(`/recovery/${c.id}`)}
                          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-medium transition-all text-xs flex items-center gap-1 ml-auto"
                        >
                          Review <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
