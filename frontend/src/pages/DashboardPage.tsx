import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchDashboardSummary } from '../services/api';
import { BatchEvaluation, RecoveryCase } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Skeleton, ErrorState } from '../components/common/States';
import { RevenueBriefingModal } from '../components/dashboard/RevenueBriefingModal';
import { RevenueIntelligenceCard } from '../components/dashboard/RevenueIntelligenceCard';
import { 
  TrendingUp, 
  ShieldAlert, 
  RotateCcw, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<{ metrics: BatchEvaluation; recent_risk_cases: RecoveryCase[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const navigate = useNavigate();

  const loadDashboard = () => {
    setLoading(true);
    setError(null);
    fetchDashboardSummary()
      .then((res) => {
        setData(res);
        setLoading(false);

        // First-touch in session trigger
        const hasSeen = sessionStorage.getItem('recoverai_briefing_seen');
        if (!hasSeen) {
          setShowBriefingModal(true);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to connect to backend server');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCloseModal = () => {
    setShowBriefingModal(false);
    sessionStorage.setItem('recoverai_briefing_seen', 'true');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F7F7F5]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title="Overview" />
          <div className="p-6 space-y-4">
            <Skeleton height="h-24" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton height="h-28" />
              <Skeleton height="h-28" />
              <Skeleton height="h-28" />
              <Skeleton height="h-28" />
            </div>
            <Skeleton height="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen bg-[#F7F7F5]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title="Overview" />
          <main className="p-6">
            <ErrorState message={error || 'Could not load metrics'} onRetry={loadDashboard} />
          </main>
        </div>
      </div>
    );
  }

  const { metrics, recent_risk_cases } = data;

  const trendData = [
    { day: 'Mon', atRisk: 85000, recovered: 42000 },
    { day: 'Tue', atRisk: 92000, recovered: 51000 },
    { day: 'Wed', atRisk: 110000, recovered: 68000 },
    { day: 'Thu', atRisk: 78000, recovered: 49000 },
    { day: 'Fri', atRisk: 120000, recovered: 63500 },
    { day: 'Sat', atRisk: 485000, recovered: 273500 },
  ];

  const attentionItems = [
    { type: 'Payment failures', count: '72 cases', amount: '₹1,45,000', severity: 'HIGH', link: '/recovery?category=PAYMENT_FAILURE' },
    { type: 'Checkout abandonments', count: '50 cases', amount: '₹1,12,000', severity: 'MEDIUM', link: '/recovery?category=CHECKOUT_ABANDONMENT' },
    { type: 'Failed subscriptions', count: '40 cases', amount: '₹78,000', severity: 'HIGH', link: '/subscriptions' },
    { type: 'Overdue invoices', count: '38 cases', amount: '₹1,50,000', severity: 'CRITICAL', link: '/invoices' },
  ];

  return (
    <div className="flex h-screen bg-[#F7F7F5] text-[#171717] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Overview" />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome Header & Reopen Control */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#171717]">Good morning, Sachin</h2>
              <p className="text-xs text-[#666666] mt-0.5">Revenue recovery overview for today.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowBriefingModal(true)}
                icon={<Zap className="w-3.5 h-3.5 text-[#3B5CCC]" />}
              >
                Revenue Briefing
              </Button>
              <Button variant="primary" onClick={() => navigate('/recovery')}>
                Review Cases ({metrics.total_records})
              </Button>
            </div>
          </div>

          {/* Persistent Compact Today's Briefing Card */}
          <RevenueIntelligenceCard
            summary="Payment failures represent your largest active recovery opportunity today."
            topRiskCategory="Payment Failures"
            topRiskAmount={145000}
            topRiskCount={72}
            onOpenFullBriefing={() => setShowBriefingModal(true)}
          />

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue Recovered */}
            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Revenue Recovered</span>
              <div className="text-2xl font-bold text-[#197A55] mt-1">₹{metrics.total_revenue_recovered.toLocaleString('en-IN')}</div>
              <div className="flex items-center justify-between text-[11px] text-[#666666] mt-2 pt-2 border-t border-[#E7E7E3]">
                <span>{metrics.successful_recovery_cases} Recovered Cases</span>
                <span className="font-semibold text-[#197A55]">{metrics.recovery_rate}% Rate</span>
              </div>
            </Card>

            {/* Revenue At Risk */}
            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Revenue At Risk</span>
              <div className="text-2xl font-bold text-[#B42318] mt-1">₹{metrics.total_revenue_at_risk.toLocaleString('en-IN')}</div>
              <div className="flex items-center justify-between text-[11px] text-[#666666] mt-2 pt-2 border-t border-[#E7E7E3]">
                <span>{metrics.total_records} Total Cases Monitored</span>
                <span className="font-semibold text-[#B42318]">High Priority</span>
              </div>
            </Card>

            {/* Recovery Rate */}
            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Recovery Rate</span>
              <div className="text-2xl font-bold text-[#171717] mt-1">{metrics.recovery_rate}%</div>
              <div className="flex items-center justify-between text-[11px] text-[#666666] mt-2 pt-2 border-t border-[#E7E7E3]">
                <span>Avg Recovered / Case</span>
                <span className="font-semibold text-[#171717]">₹{metrics.average_recovery_amount.toLocaleString('en-IN')}</span>
              </div>
            </Card>

            {/* Active Recovery Cases */}
            <Card padding="p-4">
              <span className="text-xs font-medium text-[#666666]">Safely Stopped Cases</span>
              <div className="text-2xl font-bold text-[#B7791F] mt-1">{metrics.safely_stopped_cases}</div>
              <div className="flex items-center justify-between text-[11px] text-[#666666] mt-2 pt-2 border-t border-[#E7E7E3]">
                <span>Max Retries Enforced</span>
                <span className="font-semibold text-[#B7791F]">{metrics.policy_violations_prevented} Shielded</span>
              </div>
            </Card>
          </div>

          {/* Main Content Grid: Recovery Chart + Needs Attention Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main Recovery Chart */}
            <Card padding="p-5" className="lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#171717]">Recovery Performance</h3>
                  <p className="text-xs text-[#666666]">Revenue at risk vs. actual revenue recovered over time</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-[#B42318]">
                    <span className="w-2 h-2 rounded-full bg-[#B42318]"></span> Revenue At Risk
                  </span>
                  <span className="flex items-center gap-1.5 text-[#197A55]">
                    <span className="w-2 h-2 rounded-full bg-[#197A55]"></span> Revenue Recovered
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B42318" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#B42318" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#197A55" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#197A55" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#8A8A8A" fontSize={11} tickLine={false} />
                    <YAxis stroke="#8A8A8A" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']} />
                    <Area type="monotone" dataKey="atRisk" stroke="#B42318" strokeWidth={2} fill="url(#riskGrad)" />
                    <Area type="monotone" dataKey="recovered" stroke="#197A55" strokeWidth={2} fill="url(#recGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Needs Attention Panel */}
            <Card padding="p-5">
              <h3 className="text-sm font-bold text-[#171717] mb-1">Needs Attention</h3>
              <p className="text-xs text-[#666666] mb-4">Revenue breakdown requiring review</p>

              <div className="space-y-3">
                {attentionItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#171717]">{item.type}</p>
                      <p className="text-[11px] text-[#666666] mt-0.5">{item.count} • <strong className="text-[#171717]">{item.amount}</strong></p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => navigate(item.link)}>
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Recovery Activity */}
          <Card padding="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Recent Recovery Operations</h3>
                <p className="text-xs text-[#666666]">Real-time execution log of verified recovery actions</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/recovery')} icon={<ChevronRight className="w-4 h-4" />}>
                View All Cases
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F7F5] text-[#666666] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E7E7E3]">
                  <tr>
                    <th className="p-3">Case ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">AI Recommendation</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E7E3]">
                  {recent_risk_cases.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F7F7F5] transition-all">
                      <td className="p-3 font-semibold text-[#171717]">{c.id}</td>
                      <td className="p-3">
                        <div className="font-medium text-[#171717]">{c.customer_name}</div>
                        <div className="text-[10px] text-[#8A8A8A]">{c.customer_email}</div>
                      </td>
                      <td className="p-3 text-[#666666]">{c.category.replace('_', ' ')}</td>
                      <td className="p-3 font-semibold text-[#171717]">₹{c.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <Badge variant={c.risk_level}>{c.risk_level}</Badge>
                      </td>
                      <td className="p-3 text-[#666666]">{c.recommended_action}</td>
                      <td className="p-3">
                        <Badge variant={c.status}>{c.status}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/recovery/${c.id}`)}>
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

        {/* Revenue Briefing Modal */}
        <RevenueBriefingModal
          isOpen={showBriefingModal}
          onClose={handleCloseModal}
          metrics={metrics}
          recentCases={recent_risk_cases}
        />
      </div>
    </div>
  );
};
