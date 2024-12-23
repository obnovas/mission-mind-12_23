import { create } from 'zustand';
import { Journey } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { useContactStore } from './contactStore';

interface JourneyState {
  items: Journey[];
  loading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  add: (journey: Omit<Journey, 'id' | 'user_id'>) => Promise<void>;
  update: (id: string, updates: Partial<Journey>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  updateContactStage: (journeyId: string, contactId: string, stage: string) => Promise<void>;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      set({ items: data || [], error: null });
    } catch (err) {
      console.error('Error fetching journeys:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to load journeys') });
    } finally {
      set({ loading: false });
    }
  },

  add: async (journey) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('journeys')
        .insert({
          ...journey,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      set(state => ({ items: [...state.items, data], error: null }));
    } catch (err) {
      console.error('Error adding journey:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to add journey') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  update: async (id, updates) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('journeys')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        items: state.items.map(item => item.id === id ? data : item),
        error: null,
      }));
    } catch (err) {
      console.error('Error updating journey:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to update journey') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateContactStage: async (journeyId, contactId, stage) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      // Update the contact_journeys table
      const { error } = await supabase
        .from('contact_journeys')
        .update({
          stage,
          updated_at: new Date().toISOString(),
        })
        .eq('journey_id', journeyId)
        .eq('contact_id', contactId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh contacts to get updated journey data
      await useContactStore.getState().fetch();
    } catch (err) {
      console.error('Error updating contact stage:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to update contact stage') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  remove: async (id) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('journeys')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        error: null,
      }));
    } catch (err) {
      console.error('Error removing journey:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to remove journey') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));