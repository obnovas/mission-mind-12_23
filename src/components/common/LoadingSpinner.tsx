import React from 'react';
import { useLoadingDelay } from '../../hooks/useLoadingDelay';

interface LoadingSpinnerProps {
  isLoading: boolean;
  delay?: number;
  message?: string;
}

export function LoadingSpinner({ isLoading, delay = 300, message = 'Loading...' }: LoadingSpinnerProps) {
  const showLoader = useLoadingDelay(isLoading, delay);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
        <p className="text-neutral-600 font-medium">{message}</p>
      </div>
    </div>
  );
}