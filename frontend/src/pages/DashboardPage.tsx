import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { fetchDashboardSummary } from '../services/api';
import { BatchEvaluation, RecoveryCase } from '../types';
import { 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  ArrowUpRight, 
  AlertTriangle, 
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<{ metrics: BatchEvaluation; recent_risk_cases: RecoveryCase[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardSummary()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-screen bg-slate-950 text-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-blue-400 font-semibold text-lg">
            <Activity className="w-6 h-6 animate-spin" />
            Loading RecoverAI Dashboard Engine...
          </div>
        </div>
      </div>
    );
  }

  const { metrics, recent_risk_cases } = data;

  // Chart data formatting
  const trendData = [
    { day: 'Mon', atRisk: 85000, recovered: 42000 },
    { day: 'Tue', atRisk: 92000, recovered: 51000 },
    { day: 'Wed', atRisk: 110000, recovered: 68000 },
    { day: 'Thu', atRisk: 78000, recovered: 49000 },
    { day: 'Fri', atRisk: 120000, recovered: 63500 },
    { day: 'Sat', atRisk: 485000, recovered: 273500 },
  ];

  const categoryChartData = Object.entries(metrics.by_category || {}).map(([key, val]) => ({
    name: key.replace('_', ' '),
    atRisk: val.revenue_at_risk,
    recovered: val.revenue_recovered,
  }));

  const pieData = [
    { name: 'Recovered', value: metrics.successful_recovery_cases, color: '#10b981' },
    { name: 'Failed Attempts', value: metrics.failed_recovery_cases, color: '#ef4444' },
    { name: 'Safely Stopped', value: metrics.safely_stopped_cases, color: '#f59e0b' },
    { name: 'Unresolved / Review', value: metrics.unresolved_exceptions, color: '#6366f1' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="Merchant Revenue Recovery Dashboard" subtitle="Autonomous Detection → Diagnosis → Intervention → Policy Guard → Verification" />

        <main className="p-6 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue at Risk */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-red-500/20 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-red-500/20 group-hover:text-red-500/30 transition-all">
                <ShieldAlert className="w-12 h-12" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue At Risk</p>
              <h3 className="text-2xl font-black text-white mt-2">₹{metrics.total_revenue_at_risk.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-red-400 font-medium mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {metrics.total_records} Total Cases Monitored
              </p>
            </div>

            {/* Total Revenue Recovered */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-emerald-500/20 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-emerald-500/20 group-hover:text-emerald-500/30 transition-all">
                <TrendingUp className="w-12 h-12" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue Recovered</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-2">₹{metrics.total_revenue_recovered.toLocaleString('en-IN')}</h3>
              <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {metrics.successful_recovery_cases} Recovered Cases
              </p>
            </div>

            {/* Recovery Rate */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-blue-500/20 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-blue-500/20 group-hover:text-blue-500/30 transition-all">
                <RotateCcw className="w-12 h-12" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recovery Rate</p>
              <h3 className="text-2xl font-black text-blue-400 mt-2">{metrics.recovery_rate}%</h3>
              <p className="text-xs text-blue-300 font-medium mt-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                ₹{metrics.average_recovery_amount.toLocaleString('en-IN')} Avg / Case
              </p>
            </div>

            {/* Safely Stopped & Policy Violations */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-indigo-500/20 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 text-indigo-500/20 group-hover:text-indigo-500/30 transition-all">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Safely Stopped Cases</p>
              <h3 className="text-2xl font-black text-amber-400 mt-2">{metrics.safely_stopped_cases}</h3>
              <p className="text-xs text-indigo-300 font-medium mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {metrics.policy_violations_prevented} Unsafe Actions Blocked
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Recovery Trend Area Chart */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-bold text-white">Revenue at Risk vs Recovered</h4>
                  <p className="text-xs text-gray-400">Real-time financial performance trajectory</p>
                </div>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-semibold">
                  Batch Evaluation (200 Cases)
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']} />
                    <Area type="monotone" dataKey="atRisk" name="At Risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" />
                    <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#10b981" fillOpacity={1} fill="url(#colorRec)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recovery Distribution Pie Chart */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
              <h4 className="text-base font-bold text-white mb-1">Case Outcome Distribution</h4>
              <p className="text-xs text-gray-400 mb-4">Breakdown of AI & Policy outcomes</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-800">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-gray-300 font-medium">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active High-Risk Cases Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-white">Active High-Priority Recovery Cases</h4>
                <p className="text-xs text-gray-400">Cases requiring AI intervention or policy approval</p>
              </div>
              <button 
                onClick={() => navigate('/recovery')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                View All {metrics.total_records} Cases
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-800/50 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Case ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Recommended Action</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {recent_risk_cases.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-800/30 transition-all">
                      <td className="p-3 font-bold text-blue-400">{c.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{c.customer_name}</div>
                        <div className="text-[10px] text-gray-400">{c.customer_email}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-medium">
                          {c.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-white">₹{c.amount.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          c.risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          c.risk_level === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {c.risk_level}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-200">{c.recommended_action}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          c.status === 'RECOVERED' ? 'bg-emerald-500/20 text-emerald-400' :
                          c.status === 'SAFELY_STOPPED' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => navigate(`/recovery/${c.id}`)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-all shadow-sm"
                        >
                          Inspect & Act
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
