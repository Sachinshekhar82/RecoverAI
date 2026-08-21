import React, { useEffect, useState } from 'react';
import { BatchEvaluation, RecoveryCase } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Zap, X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RevenueBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: BatchEvaluation;
  recentCases?: RecoveryCase[];
}

export const RevenueBriefingModal: React.FC<RevenueBriefingModalProps> = ({
  isOpen,
  onClose,
  metrics,
  recentCases = []
}) => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setAnalyzing(true);
      const timer = setTimeout(() => {
        setAnalyzing(false);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const catMap = metrics.by_category || {};
  const sortedCategories = Object.entries(catMap).sort((a, b) => b[1].revenue_at_risk - a[1].revenue_at_risk);
  const topCategory = sortedCategories[0]?.[0]?.replace('_', ' ') || 'Payment failures';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/40 backdrop-blur-sm select-none transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[840px] bg-white border border-[#E7E7E3] rounded-2xl shadow-2xl overflow-hidden transition-all transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading / Analysis State */}
        {analyzing ? (
          <div className="p-12 text-center space-y-3 bg-gradient-to-b from-[#F7F7F5] to-white">
            <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] border border-[#D0DDFB] flex items-center justify-center text-[#3B5CCC] mx-auto animate-pulse">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#171717]">RECOVERAI REVENUE INTELLIGENCE</h3>
            <p className="text-xs text-[#666666] animate-pulse">Analyzing today's 200 recovery records and policy execution log...</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E7E3]">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-white via-[#F7F7F5] to-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8A8A8A] uppercase tracking-wider">
                  <div className="w-5 h-5 rounded-md bg-[#20221F] text-white flex items-center justify-center text-[10px]">
                    R
                  </div>
                  <span>RecoverAI Revenue Intelligence</span>
                  <Badge variant="INFO">Daily Briefing</Badge>
                </div>
                <h2 className="text-xl font-bold text-[#171717] pt-1">Good morning, Sachin.</h2>
                <p className="text-xs text-[#666666]">
                  I've reviewed today's recovery activity. Here's what deserves your attention.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-md text-[#8A8A8A] hover:text-[#171717] hover:bg-[#E7E7E3] transition-all"
                aria-label="Close briefing"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Summary Strip */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white">
              <div>
                <span className="text-[11px] font-medium text-[#8A8A8A] block uppercase">Revenue At Risk</span>
                <span className="text-xl font-bold text-[#B42318] mt-0.5 block">
                  ₹{metrics.total_revenue_at_risk.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#666666]">{metrics.total_records} Active Cases</span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#8A8A8A] block uppercase">Cases Recovered</span>
                <span className="text-xl font-bold text-[#197A55] mt-0.5 block">
                  {metrics.successful_recovery_cases}
                </span>
                <span className="text-[10px] text-[#197A55]">Captured & Verified</span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#8A8A8A] block uppercase">Recovery Rate</span>
                <span className="text-xl font-bold text-[#171717] mt-0.5 block">
                  {metrics.recovery_rate}%
                </span>
                <span className="text-[10px] text-[#666666]">Batch Performance</span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-[#8A8A8A] block uppercase">Revenue Recovered</span>
                <span className="text-xl font-bold text-[#197A55] mt-0.5 block">
                  ₹{metrics.total_revenue_recovered.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#666666]">Avg ₹{metrics.average_recovery_amount.toLocaleString('en-IN')}/case</span>
              </div>
            </div>

            {/* What Needs Attention (Key Findings) */}
            <div className="p-6 space-y-3 bg-[#F7F7F5]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
                What Needs Your Attention
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {sortedCategories.slice(0, 3).map(([catKey, catVal], idx) => (
                  <div key={catKey} className="p-3.5 rounded-xl bg-white border border-[#E7E7E3] space-y-1">
                    <span className="text-[10px] font-bold text-[#8A8A8A]">0{idx + 1}</span>
                    <h4 className="text-xs font-bold text-[#171717] capitalize">{catKey.replace('_', ' ')}</h4>
                    <p className="text-xs font-semibold text-[#B42318] pt-1">
                      ₹{catVal.revenue_at_risk.toLocaleString('en-IN')} at risk
                    </p>
                    <p className="text-[10px] text-[#666666]">{catVal.total_cases} recovery cases</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="p-6 bg-white space-y-4">
              <div className="p-4 rounded-xl bg-[#EAF6F0] border border-[#C3E6D5] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#197A55] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> RecoverAI Recommended Action
                </span>
                <p className="text-xs font-semibold text-[#197A55] leading-relaxed">
                  Prioritize {topCategory} cases with recovery probability above 70% before escalating overdue invoices.
                </p>
                <p className="text-[11px] text-[#666666] pt-1">
                  {metrics.safely_stopped_cases} cases have already been safely stopped by the Policy Engine to prevent customer fatigue.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      onClose();
                      navigate('/recovery?risk_level=HIGH');
                    }}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Review Priority Cases
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      onClose();
                      navigate('/agent');
                    }}
                  >
                    Open Revenue Intelligence
                  </Button>
                </div>

                <Button variant="ghost" size="md" onClick={onClose}>
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
