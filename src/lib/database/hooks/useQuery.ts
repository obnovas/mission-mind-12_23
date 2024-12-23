import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { db } from '../connection';
import { QueryCache } from '../cache';

interface QueryOptions {
  cacheTime?: number;
  staleTime?: number;
  retry?: number;
  enabled?: boolean;
}

export function useQuery<T>(
  key: string | string[],
  queryFn: () => Promise<T>,
  options: QueryOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthStore();
  const cache = QueryCache.getInstance();

  const queryKey = Array.isArray(key) ? key.join(':') : key;
  const {
    cacheTime = 1000 * 60 * 5, // 5 minutes
    staleTime = 1000 * 30, // 30 seconds
    retry = 3,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!user || !enabled) return;

    let isMounted = true;
    let retryCount = 0;
    let lastFetch = 0;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cached = cache.get<{ data: T; timestamp: number }>(queryKey);
        const now = Date.now();

        if (cached && now - cached.timestamp < staleTime) {
          setData(cached.data);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const result = await queryFn();
        
        if (isMounted) {
          setData(result);
          cache.set(queryKey, { data: result, timestamp: now }, cacheTime);
        }
      } catch (err) {
        console.error(`Query error (${queryKey}):`, err);
        
        if (retryCount < retry) {
          retryCount++;
          setTimeout(fetchData, Math.pow(2, retryCount) * 1000);
          return;
        }

        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Query failed'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, queryKey, enabled]);

  const refetch = async () => {
    if (!user || !enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await queryFn();
      setData(result);
      
      // Update cache
      cache.set(queryKey, { 
        data: result, 
        timestamp: Date.now() 
      }, cacheTime);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Query failed'));
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}