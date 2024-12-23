import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = 'Loading...' }: LoadingOverlayProps) {
  const [showLoader, setShowLoader] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShowLoader(true), 300);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!showLoader) return null;

  return (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
        <p className="text-neutral-600 font-medium">{message}</p>
      </div>
    </div>
  );
}