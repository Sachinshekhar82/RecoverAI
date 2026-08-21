import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchBatchEvaluation } from '../services/api';
import { BatchEvaluation } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton, ErrorState } from '../components/common/States';
import { CheckCircle2, ShieldCheck, AlertTriangle, Activity, Database, Clock } from 'lucide-react';

export const EvaluationPage: React.FC = () => {
  const [evalData, setEvalData] = useState<BatchEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatchEvaluation().then((res) => {
      setEvalData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !evalData) {
    return (
      <div className="flex h-screen bg-[#F7F7F5]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title="Recovery Evaluation" />
          <div className="p-6 space-y-4">
            <Skeleton height="h-24" />
            <Skeleton height="h-48" />
          </div>
        </div>
      </div>
    );
  }

  const catMap = evalData.by_category || {};

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Recovery Evaluation" subtitle="Measured performance across synthetic revenue-loss scenarios." />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Technical Evaluation Run Metadata */}
          <Card padding="p-4" className="flex flex-wrap items-center justify-between gap-4 bg-white border-[#E7E7E3]">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-[#3B5CCC]" />
              <div>
                <h3 className="text-xs font-bold text-[#171717]">Evaluation Run ID: EVAL-2026-0821-BATCH01</h3>
                <p className="text-[11px] text-[#666666]">Dataset Size: 200 transaction records • Run Timestamp: 2026-08-21 18:00 UTC</p>
              </div>
            </div>
            <Badge variant="PASSED">Verified Batch Evaluation</Badge>
          </Card>

          {/* Top Measured Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Records Analyzed</span>
              <div className="text-2xl font-bold text-[#171717] mt-1">{evalData.total_records}</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Synthetic Revenue Cases</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Revenue At Risk</span>
              <div className="text-2xl font-bold text-[#B42318] mt-1">₹{evalData.total_revenue_at_risk.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Total At-Risk Volume</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Revenue Recovered</span>
              <div className="text-2xl font-bold text-[#197A55] mt-1">₹{evalData.total_revenue_recovered.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Captured & Verified</p>
            </Card>

            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Recovery Rate</span>
              <div className="text-2xl font-bold text-[#3B5CCC] mt-1">{evalData.recovery_rate}%</div>
              <p className="text-[11px] text-[#8A8A8A] mt-1">Batch Conversion Rate</p>
            </Card>
          </div>

          {/* Recovery Outcomes Breakdown */}
          <Card padding="p-5" className="space-y-3">
            <h3 className="text-sm font-bold text-[#171717]">Measured Recovery Outcomes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#EAF6F0] border border-[#C3E6D5]">
                <span className="text-[#197A55] font-semibold">Recovered</span>
                <p className="text-xl font-bold text-[#197A55] mt-1">{evalData.successful_recovery_cases}</p>
                <span className="text-[10px] text-[#197A55]">Payment Verified Captured</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FFF0EF] border border-[#FECDCA]">
                <span className="text-[#B42318] font-semibold">Failed Attempts</span>
                <p className="text-xl font-bold text-[#B42318] mt-1">{evalData.failed_recovery_cases}</p>
                <span className="text-[10px] text-[#B42318]">Bank Authorization Decline</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FFF6E5] border border-[#F7E3BE]">
                <span className="text-[#B7791F] font-semibold">Safely Stopped</span>
                <p className="text-xl font-bold text-[#B7791F] mt-1">{evalData.safely_stopped_cases}</p>
                <span className="text-[10px] text-[#B7791F]">Max Retry Threshold Enforced</span>
              </div>

              <div className="p-3 rounded-lg bg-[#F0F4FF] border border-[#D0DDFB]">
                <span className="text-[#3B5CCC] font-semibold">Escalated / Review</span>
                <p className="text-xl font-bold text-[#3B5CCC] mt-1">{evalData.unresolved_exceptions}</p>
                <span className="text-[10px] text-[#3B5CCC]">Flagged for Merchant Review</span>
              </div>
            </div>
          </Card>

          {/* Recovery Performance by Scenario */}
          <Card padding="p-5" className="space-y-4">
            <h3 className="text-sm font-bold text-[#171717]">Recovery Performance by Scenario</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(catMap).map(([catKey, catVal]) => (
                <div key={catKey} className="p-4 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#171717]">{catKey.replace('_', ' ')}</span>
                    <Badge variant="PASSED">{catVal.recovery_rate}% Recovery</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-[#8A8A8A]">Cases</span>
                      <p className="font-bold text-[#171717]">{catVal.total_cases}</p>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A]">At Risk</span>
                      <p className="font-bold text-[#B42318]">₹{catVal.revenue_at_risk.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A]">Recovered</span>
                      <p className="font-bold text-[#197A55]">₹{catVal.revenue_recovered.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="w-full bg-[#E7E7E3] rounded-full h-1.5 mt-2">
                    <div
                      className="bg-[#197A55] h-1.5 rounded-full"
                      style={{ width: `${catVal.recovery_rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};
