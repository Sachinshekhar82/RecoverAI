import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-5' }) => {
  return (
    <div className={`bg-white border border-[#E7E7E3] rounded-xl shadow-card ${padding} ${className}`}>
      {children}
    </div>
  );
};
