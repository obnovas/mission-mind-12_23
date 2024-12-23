import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useOptimisticUpdate<T extends { id: string }>(options?: OptimisticUpdateOptions<T>) {
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthStore();

  const update = async (
    tableName: string,
    id: string,
    updates: Partial<T>,
    optimisticUpdate: (item: T) => T
  ) => {
    if (!user) return;

    try {
      setError(null);

      // Apply optimistic update immediately
      optimisticUpdate({ id, ...updates } as T);

      // Update database in background
      const { data, error: updateError } = await supabase
        .from(tableName)
        .update({ ...updates, user_id: user.id })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      options?.onSuccess?.(data as T);
      return data as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Update failed');
      setError(error);
      options?.onError?.(error);
      throw error;
    }
  };

  return { update, error };
}