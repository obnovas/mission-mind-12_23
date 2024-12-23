import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ConnectionState } from './connection/types';

export function useDatabase() {
  const [state, setState] = useState<ConnectionState>({
    isConnected: false,
    error: null,
    lastAttempt: null,
    retryCount: 0
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from('user_settings')
          .select('count')
          .limit(1);

        setState(prev => ({
          ...prev,
          isConnected: !error,
          error: error ? new Error(error.message) : null,
          lastAttempt: new Date()
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          error: err instanceof Error ? err : new Error('Connection failed'),
          lastAttempt: new Date()
        }));
      }
    };

    checkConnection();
  }, []);

  return {
    client: supabase,
    ...state
  };
}