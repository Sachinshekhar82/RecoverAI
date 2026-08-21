import React from 'react';

export type StatusVariant = 
  | 'RECOVERED' 
  | 'SUCCESS' 
  | 'DIAGNOSED' 
  | 'INTERVENTION_PENDING' 
  | 'HIGH_RISK' 
  | 'CRITICAL' 
  | 'SAFELY_STOPPED' 
  | 'STOPPED' 
  | 'ESCALATED' 
  | 'EXCEPTIONAL' 
  | 'FAILED_ATTEMPT'
  | 'NEUTRAL';

interface BadgeProps {
  variant?: StatusVariant | string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'NEUTRAL', children, size = 'sm' }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-300';

  const v = variant.toString().toUpperCase();

  if (v === 'RECOVERED' || v === 'SUCCESS' || v === 'PASSED' || v === 'APPROVED' || v === 'DELIVERED') {
    style = 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] font-semibold';
  } else if (v === 'HIGH' || v === 'CRITICAL' || v === 'FAILED_ATTEMPT' || v === 'REJECTED' || v === 'HIGH_RISK') {
    style = 'bg-[#FEF2F2] text-[#B91C1C] border-[#FCA5A5] font-semibold';
  } else if (v === 'SAFELY_STOPPED' || v === 'STOPPED' || v === 'ESCALATED' || v === 'EXCEPTIONAL' || v === 'WARNING' || v === 'MEDIUM') {
    style = 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] font-semibold';
  } else if (v === 'DIAGNOSED' || v === 'INTERVENTION_PENDING' || v === 'INFO' || v === 'LOW') {
    style = 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] font-semibold';
  }

  const px = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border tracking-tight ${px} ${style}`}>
      {children}
    </span>
  );
};
