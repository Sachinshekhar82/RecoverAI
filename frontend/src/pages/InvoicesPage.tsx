import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchInvoices } from '../services/api';
import { RecoveryCase } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<RecoveryCase[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices().then((res) => setInvoices(res.invoices || []));
  }, []);

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Receivables & Invoices" subtitle="Overdue receivable monitoring and automated payment link collection" />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Outstanding Invoices</span>
              <div className="text-2xl font-bold text-[#171717] mt-1">30</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Net-30 Receivables</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Overdue Receivables</span>
              <div className="text-2xl font-bold text-[#B42318] mt-1">₹1,50,000</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Expired Terms</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">At-Risk Volume</span>
              <div className="text-2xl font-bold text-[#B7791F] mt-1">₹1,50,000</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">High Value Overdue</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Recovered Invoices</span>
              <div className="text-2xl font-bold text-[#197A55] mt-1">₹85,000</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Collected via Link</p>
            </Card>
          </div>

          {/* Table */}
          <Card padding="p-0" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] text-[#666666] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E7E7E3]">
                  <tr>
                    <th className="p-3.5">Invoice ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Days Overdue</th>
                    <th className="p-3.5">Recovery Probability</th>
                    <th className="p-3.5">AI Recommendation</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E7E3]">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F7F7F5] transition-all">
                      <td className="p-3.5 font-mono font-bold text-[#171717]">{inv.id}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-[#171717]">{inv.customer_name}</div>
                        <div className="text-[10px] text-[#8A8A8A]">{inv.customer_email}</div>
                      </td>
                      <td className="p-3.5 font-bold text-[#171717]">₹{inv.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-semibold text-[#B42318]">{inv.days_overdue} Days</td>
                      <td className="p-3.5 font-semibold text-[#171717]">{Math.round((inv.recovery_probability || 0.81) * 100)}%</td>
                      <td className="p-3.5 text-[#666666]">{inv.recommended_action}</td>
                      <td className="p-3.5">
                        <Badge variant={inv.status}>{inv.status}</Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/recovery/${inv.id}`)}>
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
