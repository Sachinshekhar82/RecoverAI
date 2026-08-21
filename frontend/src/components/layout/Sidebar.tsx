import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  RotateCcw, 
  Bot, 
  Receipt, 
  Users, 
  RefreshCw, 
  FileText, 
  ShieldAlert, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Settings,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recovery', label: 'Recovery Cases', icon: RotateCcw },
    { to: '/agent', label: 'AI Agent Console', icon: Bot, badge: 'AI' },
    { to: '/evaluation', label: 'Batch Evaluation', icon: CheckCircle2 },
    { to: '/exceptions', label: 'Exceptions & Stopped', icon: AlertTriangle },
    { to: '/audit', label: 'Audit Trail', icon: ShieldCheck },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/transactions', label: 'Transactions', icon: Receipt },
    { to: '/subscriptions', label: 'Subscriptions', icon: RefreshCw },
    { to: '/invoices', label: 'Invoices', icon: FileText },
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/settings', label: 'Policy Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-gray-800 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              Recover<span className="text-blue-500">AI</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium">Razorpay Buildathon 2026</p>
          </div>
        </div>

        {/* Test Mode Banner */}
        <div className="mx-4 my-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Razorpay Test Mode
          </span>
          <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-200">Track 03</span>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        <p className="font-semibold text-gray-300">RecoverAI Platform v1.0</p>
        <p className="text-[11px] text-gray-500">Policy Engine Protected</p>
      </div>
    </aside>
  );
};
