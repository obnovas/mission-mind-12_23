import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { supabase } from '../lib/supabase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export interface BaseItem {
  id: string;
  user_id?: string | null;
}

export function createBaseStore<T extends BaseItem>(tableName: string) {
  return create((set, get) => ({
    items: [] as T[],
    loading: false,
    error: null as Error | null,
    retryCount: 0,

    fetch: async () => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      try {
        set({ loading: true, error: null });
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        set({ items: data || [], error: null, retryCount: 0 });
      } catch (err) {
        const retryCount = get().retryCount;
        
        if (retryCount < MAX_RETRIES) {
          // Retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)));
          set({ retryCount: retryCount + 1 });
          return get().fetch();
        }

        console.error(`Error fetching ${tableName}:`, err);
        set({ 
          error: err instanceof Error ? err : new Error(`Failed to load ${tableName}`),
          retryCount: 0
        });
      } finally {
        set({ loading: false });
      }
    },

    add: async (item: Omit<T, 'id' | 'user_id'>) => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      try {
        set({ loading: true, error: null });
        const { data, error } = await supabase
          .from(tableName)
          .insert({ ...item, user_id: user.id })
          .select()
          .single();

        if (error) throw error;
        set(state => ({ items: [...state.items, data], error: null }));
        return data;
      } catch (err) {
        console.error(`Error adding ${tableName}:`, err);
        set({ error: err instanceof Error ? err : new Error(`Failed to add ${tableName}`) });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    update: async (id: string, updates: Partial<T>) => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      try {
        set({ loading: true, error: null });
        const { data, error } = await supabase
          .from(tableName)
          .update(updates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        set(state => ({
          items: state.items.map(item => item.id === id ? data : item),
          error: null,
        }));
        return data;
      } catch (err) {
        console.error(`Error updating ${tableName}:`, err);
        set({ error: err instanceof Error ? err : new Error(`Failed to update ${tableName}`) });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    remove: async (id: string) => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      try {
        set({ loading: true, error: null });
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        set(state => ({
          items: state.items.filter(item => item.id !== id),
          error: null,
        }));
      } catch (err) {
        console.error(`Error removing ${tableName}:`, err);
        set({ error: err instanceof Error ? err : new Error(`Failed to remove ${tableName}`) });
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  }));
}