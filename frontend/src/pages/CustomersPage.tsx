import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchCustomers } from '../services/api';
import { Users } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers().then((res) => setCustomers(res.customers || []));
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Merchant Customers Directory" subtitle="Historical payment completion rates and recovery metrics" />

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {customers.slice(0, 30).map((c) => (
              <div key={c.customer_id} className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30">
                    {c.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{c.customer_name}</h5>
                    <p className="text-xs text-gray-400">{c.customer_email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-800">
                  <div>
                    <span className="text-gray-400">Total Cases</span>
                    <p className="font-bold text-gray-200">{c.total_cases}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Recovered</span>
                    <p className="font-bold text-emerald-400">₹{c.total_amount_recovered.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
