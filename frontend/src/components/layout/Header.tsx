import React from 'react';
import { ShieldCheck, Search, Bell, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-[#E7E7E3] bg-white px-6 flex items-center justify-between sticky top-0 z-10 select-none">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-[#171717]">{title}</h2>
        {subtitle && <span className="text-xs text-[#8A8A8A] border-l border-[#E7E7E3] pl-3 font-normal">{subtitle}</span>}
      </div>

      <div className="flex items-center gap-4">
        {/* Merchant Selector */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] text-xs font-medium text-[#171717]">
          <Store className="w-3.5 h-3.5 text-[#666666]" />
          <span>Acme Store</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#197A55]"></span>
        </div>

        {/* Policy Engine Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAF6F0] text-[#197A55] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Policy Engine Active</span>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E7E7E3]">
          <div className="w-7 h-7 rounded-full bg-[#20221F] text-white flex items-center justify-center text-xs font-bold">
            S
          </div>
          <span className="text-xs font-semibold text-[#171717] hidden lg:inline">Sachin Shekhar</span>
        </div>
      </div>
    </header>
  );
};
