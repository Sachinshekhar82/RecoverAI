import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchTransactions } from '../services/api';
import { RecoveryCase } from '../types';
import { Receipt, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TransactionsPage: React.FC = () => {
  const [txns, setTxns] = useState<RecoveryCase[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions().then((res) => setTxns(res.transactions || []));
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="All Monitored Merchant Transactions" subtitle="Complete record of monitored payments, checkouts, and invoices" />

        <main className="p-6 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-800/50 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {txns.slice(0, 50).map((t) => (
                    <tr key={t.id} className="hover:bg-gray-800/30 transition-all">
                      <td className="p-3 font-bold text-blue-400">{t.transaction_id}</td>
                      <td className="p-3 font-semibold text-white">{t.customer_name}</td>
                      <td className="p-3 text-gray-300">{t.category.replace('_', ' ')}</td>
                      <td className="p-3 font-bold text-white">₹{t.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-bold text-amber-400">{t.risk_level}</td>
                      <td className="p-3 font-semibold text-emerald-400">{t.status}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => navigate(`/recovery/${t.id}`)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1 ml-auto"
                        >
                          View <ArrowUpRight className="w-3.5 h-3.5" />
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
