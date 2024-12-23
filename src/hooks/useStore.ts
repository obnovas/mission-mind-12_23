import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSupabaseQuery } from './useSupabaseQuery';

export function useStore<T>(
  tableName: string,
  query: any,
  deps: any[] = []
) {
  const { data, loading, error } = useSupabaseQuery<T>(tableName, query, deps);
  const [items, setItems] = useState<T[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  return {
    items,
    loading,
    error,
    user,
  };
}