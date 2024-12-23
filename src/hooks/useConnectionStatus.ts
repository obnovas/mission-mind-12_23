import { useState, useEffect } from 'react';
import { dbClient } from '../lib/database/client';

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let mounted = true;

    const checkConnection = async () => {
      try {
        const client = dbClient.getClient();
        const { error } = await client.from('user_settings').select('count').limit(1);
        
        if (!mounted) return;
        
        if (error) {
          setError(new Error('Database connection error'));
          setIsConnected(false);
          setRetryCount(prev => prev + 1);
        } else {
          setError(null);
          setIsConnected(true);
          setRetryCount(0);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Connection failed'));
        setIsConnected(false);
        setRetryCount(prev => prev + 1);
      }
    };

    // Only show loader after 300ms delay
    if (!isConnected && !error) {
      timer = setTimeout(() => {
        if (mounted) {
          setShowLoader(true);
        }
      }, 300);
    } else {
      setShowLoader(false);
    }

    checkConnection();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return {
    isConnected,
    error,
    retryCount,
    showLoader,
  };
}