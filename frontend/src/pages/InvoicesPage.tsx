import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchInvoices } from '../services/api';
import { RecoveryCase } from '../types';
import { FileText, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<RecoveryCase[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices().then((res) => setInvoices(res.invoices || []));
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Module 9 — Overdue Receivables & Invoice Recovery" subtitle="AI calculation of days overdue, recovery probability, and payment link reminders" />

        <main className="p-6 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-800/50 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Case / Invoice ID</th>
                    <th className="p-3">Client Name</th>
                    <th className="p-3">Invoice Amount</th>
                    <th className="p-3">Days Overdue</th>
                    <th className="p-3">Recovery Probability</th>
                    <th className="p-3">AI Recommendation</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-800/30 transition-all">
                      <td className="p-3 font-bold text-blue-400">{inv.id}</td>
                      <td className="p-3 font-semibold text-white">{inv.customer_name}</td>
                      <td className="p-3 font-bold text-emerald-400">₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-bold text-amber-400">{inv.days_overdue} Days</td>
                      <td className="p-3 font-bold text-indigo-400">{Math.round(inv.recovery_probability * 100)}%</td>
                      <td className="p-3 text-gray-200">{inv.recommended_action}</td>
                      <td className="p-3 font-semibold text-gray-300">{inv.status}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => navigate(`/recovery/${inv.id}`)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all text-xs flex items-center gap-1 ml-auto"
                        >
                          Details <ArrowUpRight className="w-3.5 h-3.5" />
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
