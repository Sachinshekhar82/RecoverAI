import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RevenueIntelligenceCardProps {
  summary?: string;
  topRiskCategory?: string;
  topRiskAmount?: number;
  topRiskCount?: number;
  onOpenFullBriefing?: () => void;
  className?: string;
}

export const RevenueIntelligenceCard: React.FC<RevenueIntelligenceCardProps> = ({
  summary = 'Payment failures represent your largest active recovery opportunity today.',
  topRiskCategory = 'Payment Failures',
  topRiskAmount = 145000,
  topRiskCount = 72,
  onOpenFullBriefing,
  className = ''
}) => {
  const navigate = useNavigate();

  return (
    <Card padding="p-4" className={`bg-gradient-to-r from-white via-[#F7F7F5] to-white border-[#E7E7E3] shadow-card ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0F4FF] border border-[#D0DDFB] flex items-center justify-center text-[#3B5CCC] shrink-0">
            <Zap className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#171717]">Today's Revenue Intelligence</span>
              <Badge variant="INFO">Updated Just Now</Badge>
            </div>
            <p className="text-[#666666] text-xs mt-0.5">
              {summary} <strong className="text-[#171717]">₹{topRiskAmount.toLocaleString('en-IN')} at risk</strong> ({topRiskCount} cases).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFullBriefing && (
            <Button variant="secondary" size="sm" onClick={onOpenFullBriefing}>
              View Full Briefing
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => navigate('/recovery?risk_level=HIGH')} icon={<ArrowRight className="w-3 h-3" />}>
            Review Priority Cases
          </Button>
        </div>
      </div>
    </Card>
  );
};
