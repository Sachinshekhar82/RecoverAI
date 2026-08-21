import React from 'react';
import { Card } from './Card';
import { AlertCircle, FileX } from 'lucide-react';
import { Button } from './Button';

export const Skeleton: React.FC<{ height?: string; className?: string }> = ({ height = 'h-12', className = '' }) => (
  <div className={`bg-gray-100 animate-pulse rounded-lg ${height} ${className}`}></div>
);

export const EmptyState: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="py-12 px-4 text-center">
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
      <FileX className="w-5 h-5" />
    </div>
    <h4 className="text-sm font-semibold text-[#171717]">{title}</h4>
    {subtitle && <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">{subtitle}</p>}
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <Card padding="p-8" className="text-center max-w-md mx-auto my-8">
    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
      <AlertCircle className="w-5 h-5" />
    </div>
    <h4 className="text-sm font-bold text-[#171717]">Unable to load data</h4>
    <p className="text-xs text-[#666666] mt-1 mb-4">{message}</p>
    {onRetry && (
      <Button variant="secondary" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </Card>
);
