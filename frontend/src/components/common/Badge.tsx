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
  let style = 'bg-gray-100 text-gray-700 border-gray-200';

  const v = variant.toString().toUpperCase();

  if (v === 'RECOVERED' || v === 'SUCCESS' || v === 'PASSED' || v === 'APPROVED') {
    style = 'bg-[#EAF6F0] text-[#197A55] border-[#C3E6D5]';
  } else if (v === 'HIGH' || v === 'CRITICAL' || v === 'FAILED_ATTEMPT' || v === 'REJECTED' || v === 'HIGH_RISK') {
    style = 'bg-[#FFF0EF] text-[#B42318] border-[#FECDCA]';
  } else if (v === 'SAFELY_STOPPED' || v === 'STOPPED' || v === 'ESCALATED' || v === 'EXCEPTIONAL' || v === 'WARNING' || v === 'MEDIUM') {
    style = 'bg-[#FFF6E5] text-[#B7791F] border-[#F7E3BE]';
  } else if (v === 'DIAGNOSED' || v === 'INTERVENTION_PENDING' || v === 'INFO' || v === 'LOW') {
    style = 'bg-[#F0F4FF] text-[#3B5CCC] border-[#D0DDFB]';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${px} ${style}`}>
      {children}
    </span>
  );
};
