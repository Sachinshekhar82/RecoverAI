import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#171717] font-sans selection:bg-[#20221F] selection:text-white">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#E7E7E3]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#20221F] flex items-center justify-center text-white font-bold text-sm">
            R
          </div>
          <div>
            <h1 className="text-base font-bold text-[#171717] tracking-tight">
              RecoverAI
            </h1>
            <p className="text-[11px] text-[#8A8A8A] font-medium">Razorpay AI Buildathon 2026 — Track 03</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button variant="primary" onClick={() => navigate('/dashboard')} icon={<ArrowRight className="w-3.5 h-3.5" />}>
            Merchant Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        <Badge variant="PASSED">Track 03 — AI REVENUE RECOVERY</Badge>

        <h1 className="text-4xl md:text-5xl font-black text-[#171717] tracking-tight max-w-3xl mx-auto leading-tight">
          Recover revenue before it's lost.
        </h1>

        <p className="text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
          An autonomous revenue recovery platform for Razorpay merchants. Monitors transaction streams, diagnoses failure root causes, and executes policy-guarded recovery workflows.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')} icon={<ArrowRight className="w-4 h-4" />}>
            Open Merchant Dashboard
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/evaluation')} icon={<CheckCircle2 className="w-4 h-4 text-[#197A55]" />}>
            Batch Evaluation (200 Cases)
          </Button>
        </div>

        {/* Product Loop Diagram */}
        <div className="pt-12">
          <div className="p-6 rounded-2xl bg-white border border-[#E7E7E3] shadow-card max-w-3xl mx-auto space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">Central Product Loop</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] font-bold text-[#171717]">DETECT</div>
              <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] font-bold text-[#3B5CCC]">DIAGNOSE</div>
              <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] font-bold text-[#B7791F]">DECIDE</div>
              <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] font-bold text-[#197A55]">EXECUTE</div>
              <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] font-bold text-[#171717]">VERIFY</div>
              <div className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] font-bold text-[#197A55]">MEASURE</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
