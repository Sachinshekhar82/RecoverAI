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
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Settings,
  CreditCard,
  LineChart
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const mainNav: NavItem[] = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/recovery', label: 'Recovery', icon: RotateCcw },
    { to: '/transactions', label: 'Transactions', icon: Receipt },
    { to: '/subscriptions', label: 'Subscriptions', icon: RefreshCw },
    { to: '/invoices', label: 'Invoices', icon: FileText },
    { to: '/customers', label: 'Customers', icon: Users },
  ];

  const intelligenceNav: NavItem[] = [
    { to: '/agent', label: 'Revenue Intelligence', icon: Bot, badge: 'AI' },
  ];

  const operationsNav: NavItem[] = [
    { to: '/evaluation', label: 'Evaluation', icon: CheckCircle2 },
    { to: '/exceptions', label: 'Exceptions', icon: AlertTriangle },
    { to: '/audit', label: 'Audit Trail', icon: ShieldCheck },
  ];

  const settingsNav: NavItem[] = [
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const renderNavGroup = (items: NavItem[]) => (
    <div className="space-y-1">
      {items.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#EAF6F0] text-[#197A55] font-semibold border border-[#C3E6D5]'
                  : 'text-[#666666] hover:text-[#171717] hover:bg-[#F7F7F5]'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </div>
            {link.badge && (
              <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded bg-[#F0F4FF] text-[#3B5CCC]">
                {link.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <aside className="w-[250px] bg-white border-r border-[#E7E7E3] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E7E7E3] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#20221F] flex items-center justify-center text-white font-bold text-xs">
            R
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#171717] tracking-tight">
              RecoverAI
            </h1>
            <p className="text-[11px] text-[#8A8A8A] font-medium">Revenue Operations</p>
          </div>
        </div>

        {/* Razorpay Test Mode Badge */}
        <div className="mx-4 my-3 px-3 py-1.5 rounded-md bg-[#FFF6E5] border border-[#F7E3BE] text-[11px] text-[#B7791F] font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]"></span>
            Razorpay Test Mode
          </span>
          <span className="text-[9px] uppercase tracking-wider text-[#8A8A8A]">Track 03</span>
        </div>

        {/* Nav Sections */}
        <div className="px-3 py-2 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div>
            {renderNavGroup(mainNav)}
          </div>

          <div>
            <h5 className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">Intelligence</h5>
            {renderNavGroup(intelligenceNav)}
          </div>

          <div>
            <h5 className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">Operations</h5>
            {renderNavGroup(operationsNav)}
          </div>

          <div>
            <h5 className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">Settings</h5>
            {renderNavGroup(settingsNav)}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#E7E7E3] text-[11px] text-[#8A8A8A] flex items-center justify-between">
        <span>Policy Engine Protected</span>
        <span className="font-semibold text-[#171717]">v1.0</span>
      </div>
    </aside>
  );
};
