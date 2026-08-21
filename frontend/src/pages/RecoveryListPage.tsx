import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchRecoveryCases } from '../services/api';
import { RecoveryCase } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton, EmptyState } from '../components/common/States';
import { Search, Filter, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecoveryListPage: React.FC = () => {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    fetchRecoveryCases({
      category: activeTab !== 'ALL' ? activeTab : undefined,
      status: statusFilter || undefined,
      risk_level: riskFilter || undefined,
    }).then((res) => {
      setCases(res.cases || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [activeTab, statusFilter, riskFilter]);

  const filteredCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      c.transaction_id.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'ALL', label: 'All Cases' },
    { id: 'PAYMENT_FAILURE', label: 'Payment Failures' },
    { id: 'CHECKOUT_ABANDONMENT', label: 'Checkout Abandonment' },
    { id: 'FAILED_SUBSCRIPTION', label: 'Subscriptions' },
    { id: 'OVERDUE_INVOICE', label: 'Invoices' },
  ];

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Revenue Recovery" subtitle="Review and manage revenue at risk." />

        <main className="p-6 space-y-5 max-w-7xl mx-auto w-full">
          {/* Top Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-[#E7E7E3] pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all ${
                  activeTab === t.id
                    ? 'border-b-2 border-[#171717] text-[#171717] font-bold'
                    : 'text-[#666666] hover:text-[#171717]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search & Secondary Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter cases by ID, customer name, transaction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#E7E7E3] rounded-lg pl-9 pr-4 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#171717] shadow-card"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-[#E7E7E3] rounded-lg px-3 py-2 text-[#171717] shadow-card focus:outline-none"
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
                className="bg-white border border-[#E7E7E3] rounded-lg px-3 py-2 text-[#171717] shadow-card focus:outline-none"
              >
                <option value="">All Risk Levels</option>
                <option value="HIGH">High Risk</option>
                <option value="CRITICAL">Critical Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>
          </div>

          {/* Work Queue Table */}
          <Card padding="p-0" className="overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                <Skeleton height="h-10" />
                <Skeleton height="h-10" />
                <Skeleton height="h-10" />
              </div>
            ) : filteredCases.length === 0 ? (
              <EmptyState title="No recovery cases found" subtitle="No cases matching your current filter criteria." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F5] text-[#666666] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E7E7E3]">
                    <tr>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Revenue At Risk</th>
                      <th className="p-3.5">Problem / Root Cause</th>
                      <th className="p-3.5">Risk</th>
                      <th className="p-3.5">Recovery Probability</th>
                      <th className="p-3.5">AI Recommendation</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E7E3]">
                    {filteredCases.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F7F7F5] transition-all">
                        <td className="p-3.5">
                          <div className="font-semibold text-[#171717]">{c.customer_name}</div>
                          <div className="text-[10px] text-[#8A8A8A]">{c.id} • {c.customer_email}</div>
                        </td>
                        <td className="p-3.5 font-bold text-[#171717]">₹{c.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 text-[#666666] max-w-xs truncate">{c.root_cause || c.failure_reason}</td>
                        <td className="p-3.5">
                          <Badge variant={c.risk_level}>{c.risk_level}</Badge>
                        </td>
                        <td className="p-3.5 font-semibold text-[#171717]">
                          {Math.round((c.recovery_probability || 0.8) * 100)}%
                        </td>
                        <td className="p-3.5 text-[#666666] font-medium">{c.recommended_action}</td>
                        <td className="p-3.5">
                          <Badge variant={c.status}>{c.status}</Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <Button variant="primary" size="sm" onClick={() => navigate(`/recovery/${c.id}`)}>
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
