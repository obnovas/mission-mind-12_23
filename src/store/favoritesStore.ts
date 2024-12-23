import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface FavoritesState {
  items: string[];
  loading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  add: (contactId: string) => Promise<void>;
  remove: (contactId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('favorites')
        .select('contact_id')
        .eq('user_id', user.id);

      if (error) throw error;
      set({ items: data.map(f => f.contact_id), error: null });
    } catch (err) {
      console.error('Error fetching favorites:', err);
      set({ error: err instanceof Error ? err : new Error('An error occurred') });
    } finally {
      set({ loading: false });
    }
  },

  add: async (contactId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          contact_id: contactId,
        });

      if (error) throw error;
      
      // Update local state
      const items = get().items;
      set({ items: [...items, contactId], error: null });
    } catch (err) {
      console.error('Error adding favorite:', err);
      set({ error: err instanceof Error ? err : new Error('An error occurred') });
    } finally {
      set({ loading: false });
    }
  },

  remove: async (contactId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('contact_id', contactId);

      if (error) throw error;

      // Update local state
      const items = get().items.filter(id => id !== contactId);
      set({ items, error: null });
    } catch (err) {
      console.error('Error removing favorite:', err);
      set({ error: err instanceof Error ? err : new Error('An error occurred') });
    } finally {
      set({ loading: false });
    }
  },
}));