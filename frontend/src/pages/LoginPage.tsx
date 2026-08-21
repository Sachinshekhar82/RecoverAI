import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-6 text-[#171717]">
      <div className="w-full max-w-md bg-white border border-[#E7E7E3] rounded-2xl p-8 shadow-card space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-[#20221F] text-white flex items-center justify-center text-base font-bold mx-auto mb-2">
            R
          </div>
          <h2 className="text-xl font-bold text-[#171717]">Sign in to RecoverAI</h2>
          <p className="text-xs text-[#666666]">Merchant Revenue Operations Console</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[#171717] font-semibold">Merchant Email Address</label>
            <input type="email" defaultValue="merchant@acme.com" className="w-full bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg p-2.5 text-[#171717] focus:outline-none focus:border-[#171717]" />
          </div>

          <div className="space-y-1">
            <label className="text-[#171717] font-semibold">Password</label>
            <input type="password" defaultValue="••••••••••••" className="w-full bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg p-2.5 text-[#171717] focus:outline-none focus:border-[#171717]" />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Sign In to Merchant Console
          </Button>
        </form>

        <div className="pt-4 border-t border-[#E7E7E3] text-center text-xs text-[#8A8A8A] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#197A55]" /> Razorpay Test Mode & Policy Guard Protected
        </div>
      </div>
    </div>
  );
};
