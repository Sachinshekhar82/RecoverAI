import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ShieldCheck, CreditCard, Cpu, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Settings" subtitle="Merchant profile, recovery policies, and API configuration." />

        <main className="p-6 space-y-6 max-w-4xl mx-auto w-full">
          {/* Recovery Policies */}
          <Card padding="p-6" className="space-y-4">
            <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#197A55]" /> Policy Engine Deterministic Limits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[#171717] font-medium">Maximum Payment Retries</label>
                <input type="number" defaultValue={3} className="w-full bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg p-2 text-[#171717]" />
                <p className="text-[10px] text-[#8A8A8A]">Halts automated retries after N attempts (Default: 3)</p>
              </div>

              <div className="space-y-1">
                <label className="text-[#171717] font-medium">Maximum Customer Contacts</label>
                <input type="number" defaultValue={2} className="w-full bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg p-2 text-[#171717]" />
                <p className="text-[10px] text-[#8A8A8A]">Prevents customer message spam (Default: 2)</p>
              </div>

              <div className="space-y-1">
                <label className="text-[#171717] font-medium">Minimum Cooldown Window (Minutes)</label>
                <input type="number" defaultValue={30} className="w-full bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg p-2 text-[#171717]" />
                <p className="text-[10px] text-[#8A8A8A]">Required delay between retries (Default: 30 mins)</p>
              </div>

              <div className="space-y-1">
                <label className="text-[#171717] font-medium">Max Recovery Amount Threshold (₹)</label>
                <input type="number" defaultValue={500000} className="w-full bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg p-2 text-[#171717]" />
                <p className="text-[10px] text-[#8A8A8A]">Higher amounts escalate to human review</p>
              </div>
            </div>
          </Card>

          {/* API Credentials */}
          <Card padding="p-6" className="space-y-4">
            <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#3B5CCC]" /> Integration Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3]">
                <div>
                  <span className="font-semibold text-[#171717]">Razorpay Test Mode API</span>
                  <p className="text-[10px] text-[#8A8A8A]">Live Test-Mode Credentials Loaded</p>
                </div>
                <Badge variant="PASSED">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3]">
                <div>
                  <span className="font-semibold text-[#171717]">Google Gemini 1.5 Flash</span>
                  <p className="text-[10px] text-[#8A8A8A]">Structured Pydantic Schema Validation Active</p>
                </div>
                <Badge variant="PASSED">Active</Badge>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};
