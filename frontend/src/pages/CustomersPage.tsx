import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchCustomers } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers().then((res) => setCustomers(res.customers || []));
  }, []);

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Customers" subtitle="Merchant customer reliability and payment history" />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customers.slice(0, 30).map((c) => (
              <Card key={c.customer_id} padding="p-4" className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center font-bold text-xs text-[#171717]">
                    {c.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#171717]">{c.customer_name}</h4>
                    <p className="text-[10px] text-[#8A8A8A]">{c.customer_email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E7E7E3]">
                  <div>
                    <span className="text-[#8A8A8A] text-[10px]">Total Cases</span>
                    <p className="font-bold text-[#171717]">{c.total_cases}</p>
                  </div>
                  <div>
                    <span className="text-[#8A8A8A] text-[10px]">Total Recovered</span>
                    <p className="font-bold text-[#197A55]">₹{c.total_amount_recovered.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
