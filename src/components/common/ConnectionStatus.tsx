import React from 'react';
import { useConnectionStatus } from '../../lib/database/hooks';
import { AlertTriangle, CheckCircle, Loader } from 'lucide-react';

export function ConnectionStatus() {
  const { isConnected, error, retryCount } = useConnectionStatus();

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-coral-50 text-coral-800 px-4 py-2 rounded-lg border border-coral-200 shadow-lg flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-coral-600" />
        <span>Connection Error</span>
        {retryCount > 0 && (
          <span className="text-sm">
            (Attempt {retryCount})
          </span>
        )}
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-neutral-50 text-neutral-800 px-4 py-2 rounded-lg border border-neutral-200 shadow-lg flex items-center space-x-2">
        <Loader className="h-5 w-5 text-neutral-600 animate-spin" />
        <span>Connecting...</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-sage-50 text-sage-800 px-4 py-2 rounded-lg border border-sage-200 shadow-lg flex items-center space-x-2 animate-fade-out">
      <CheckCircle className="h-5 w-5 text-sage-600" />
      <span>Connected</span>
    </div>
  );
}