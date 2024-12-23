import { useState, useEffect } from 'react';
import { connectionState } from '../connection/state';
import { ConnectionState } from '../types';
import { dbClient } from '../connection/manager';

export function useConnection() {
  const [state, setState] = useState<ConnectionState>(connectionState.getState());

  useEffect(() => {
    // Subscribe to connection state changes
    const unsubscribe = connectionState.subscribe(setState);

    // Initialize client if needed
    if (!state.isConnected && !state.error) {
      dbClient.initialize().catch(() => {}); // Error handled by state manager
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    client: dbClient.getClient(),
    isConnected: state.isConnected,
    error: state.error,
    retryCount: state.retryCount,
    lastAttempt: state.lastAttempt,
  };
}