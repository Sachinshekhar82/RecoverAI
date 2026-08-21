import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  let baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  let variantStyle = 'bg-[#20221F] hover:bg-[#333632] text-white border border-transparent shadow-subtle';
  if (variant === 'secondary') {
    variantStyle = 'bg-white hover:bg-gray-50 text-[#171717] border border-[#E7E7E3] shadow-subtle';
  } else if (variant === 'danger') {
    variantStyle = 'bg-[#FFF0EF] hover:bg-[#FEE4E2] text-[#B42318] border border-[#FECDCA]';
  } else if (variant === 'ghost') {
    variantStyle = 'bg-transparent hover:bg-gray-100 text-[#666666] hover:text-[#171717]';
  }

  let sizeStyle = 'px-3.5 py-2 text-xs gap-1.5';
  if (size === 'sm') sizeStyle = 'px-2.5 py-1.5 text-[11px] gap-1';
  if (size === 'lg') sizeStyle = 'px-5 py-2.5 text-sm gap-2';

  return (
    <button className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
