import { create } from 'zustand';
import { PrayerRequest } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface PrayerRequestState {
  items: PrayerRequest[];
  loading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  add: (request: Omit<PrayerRequest, 'id' | 'user_id'>) => Promise<void>;
  update: (id: string, updates: Partial<PrayerRequest>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const usePrayerRequestStore = create<PrayerRequestState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('prayer_requests')
        .select(`
          *,
          contacts (
            name,
            email
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      set({ items: data || [], error: null });
    } catch (err) {
      console.error('Error fetching prayer requests:', err);
      set({ error: err instanceof Error ? err : new Error('An error occurred') });
    } finally {
      set({ loading: false });
    }
  },

  add: async (request) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('prayer_requests')
        .insert({
          ...request,
          user_id: user.id,
          answer_notes: request.answer_notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      const items = get().items;
      set({ items: [data, ...items], error: null });
    } catch (err) {
      console.error('Error adding prayer request:', err);
      set({ error: err instanceof Error ? err : new Error('An error occurred') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  update: async (id: string, updates: Partial<PrayerRequest>) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const updateData = {
        ...updates,
        answer_notes: updates.answer_notes || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('prayer_requests')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const items = get().items.map((item) => (item.id === id ? { ...item, ...data } : item));
      set({ items, error: null });
    } catch (err) {
      console.error('Error updating prayer request:', err);
      set({ error: err instanceof Error ? err : new Error('An error occurred') });
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
        .from('prayer_requests')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const items = get().items.filter((item) => item.id !== id);
      set({ items, error: null });
    } catch (err) {
      console.error('Error removing prayer request:', err);
      set({ error: err instanceof Error ? err : new Error('An error occurred') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));