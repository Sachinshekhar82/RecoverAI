import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchRecoveryCases, executeIntervention } from '../services/api';
import { RecoveryCase } from '../types';
import { Search, Filter, Play, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecoveryListPage: React.FC = () => {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    fetchRecoveryCases({
      category: categoryFilter || undefined,
      status: statusFilter || undefined,
      risk_level: riskFilter || undefined,
    }).then((res) => {
      setCases(res.cases || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, statusFilter, riskFilter]);

  const filteredCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      c.transaction_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Active Revenue Recovery Workspace" subtitle="Monitor revenue at risk and execute policy-protected interventions" />

        <main className="p-6 space-y-5">
          {/* Search & Filters Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by Case ID, Customer, or Txn ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300"
              >
                <option value="">All Categories</option>
                <option value="PAYMENT_FAILURE">Payment Failure</option>
                <option value="CHECKOUT_ABANDONMENT">Checkout Abandonment</option>
                <option value="FAILED_SUBSCRIPTION">Failed Subscription</option>
                <option value="OVERDUE_INVOICE">Overdue Invoice</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300"
              >
                <option value="">All Statuses</option>
                <option value="RECOVERED">Recovered</option>
                <option value="DIAGNOSED">Diagnosed</option>
                <option value="SAFELY_STOPPED">Safely Stopped</option>
                <option value="FAILED_ATTEMPT">Failed Attempt</option>
                <option value="EXCEPTIONAL">Exceptional / Review</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300"
              >
                <option value="">All Risk Levels</option>
                <option value="HIGH">High Risk</option>
                <option value="CRITICAL">Critical Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>
          </div>

          {/* Cases Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-800/50 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Case ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">AI Root Cause</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {filteredCases.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-800/30 transition-all">
                      <td className="p-3 font-bold text-blue-400">{c.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{c.customer_name}</div>
                        <div className="text-[10px] text-gray-400">{c.customer_email}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium">
                          {c.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">₹{c.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          c.risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          c.risk_level === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {c.risk_level}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs truncate text-gray-300">{c.root_cause || c.failure_reason}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          c.status === 'RECOVERED' ? 'bg-emerald-500/20 text-emerald-400' :
                          c.status === 'SAFELY_STOPPED' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => navigate(`/recovery/${c.id}`)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all shadow-sm flex items-center gap-1 ml-auto"
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
