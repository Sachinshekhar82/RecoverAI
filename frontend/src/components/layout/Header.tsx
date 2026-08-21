import React from 'react';
import { ShieldCheck, Zap, Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-gray-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Policy Engine Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Policy Engine Guard Active
        </div>

        {/* AI Quick Button */}
        <button
          onClick={() => navigate('/agent')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          Ask AI Agent
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 font-bold text-xs">
            RA
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-gray-200">Merchant Operations</p>
            <p className="text-[10px] text-gray-500">Acme Commerce Ltd</p>
          </div>
        </div>
      </div>
    </header>
  );
};
