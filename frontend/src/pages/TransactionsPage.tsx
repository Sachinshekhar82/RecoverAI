import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchTransactions } from '../services/api';
import { RecoveryCase } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TransactionsPage: React.FC = () => {
  const [txns, setTxns] = useState<RecoveryCase[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions().then((res) => setTxns(res.transactions || []));
  }, []);

  const filtered = txns.filter(
    (t) =>
      t.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Transactions" subtitle="All monitored payment attempts, checkouts, and invoices." />

        <main className="p-6 space-y-5 max-w-7xl mx-auto w-full">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by transaction ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E7E7E3] rounded-lg pl-9 pr-4 py-2 text-xs text-[#171717] focus:outline-none shadow-card"
            />
          </div>

          <Card padding="p-0" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] text-[#666666] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E7E7E3]">
                  <tr>
                    <th className="p-3.5">Transaction ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Risk Level</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E7E3]">
                  {filtered.slice(0, 50).map((t) => (
                    <tr key={t.id} className="hover:bg-[#F7F7F5] transition-all">
                      <td className="p-3.5 font-mono font-semibold text-[#171717]">{t.transaction_id}</td>
                      <td className="p-3.5 font-medium text-[#171717]">{t.customer_name}</td>
                      <td className="p-3.5 font-bold text-[#171717]">₹{t.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-[#666666]">{t.category.replace('_', ' ')}</td>
                      <td className="p-3.5"><Badge variant={t.risk_level}>{t.risk_level}</Badge></td>
                      <td className="p-3.5"><Badge variant={t.status}>{t.status}</Badge></td>
                      <td className="p-3.5 text-right">
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/recovery/${t.id}`)}>
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
