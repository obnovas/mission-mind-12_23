import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { ContactJourney } from '../types';

interface ContactJourneyState {
  loading: boolean;
  error: Error | null;
  addContactToJourney: (params: {
    contactId: string;
    journeyId: string;
    stage: string;
    notes?: string;
  }) => Promise<void>;
  updateJourneyStage: (params: {
    contactId: string;
    journeyId: string;
    stage: string;
  }) => Promise<void>;
  updateJourneyNotes: (params: {
    contactId: string;
    journeyId: string;
    notes: string;
  }) => Promise<void>;
  removeFromJourney: (params: {
    contactId: string;
    journeyId: string;
  }) => Promise<void>;
}

export const useContactJourneyStore = create<ContactJourneyState>((set) => ({
  loading: false,
  error: null,

  addContactToJourney: async ({ contactId, journeyId, stage, notes }) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('contact_journeys')
        .insert({
          contact_id: contactId,
          journey_id: journeyId,
          stage,
          notes,
          user_id: user.id,
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to add contact to journey') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateJourneyStage: async ({ contactId, journeyId, stage }) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('contact_journeys')
        .update({
          stage,
          updated_at: new Date().toISOString(),
        })
        .eq('contact_id', contactId)
        .eq('journey_id', journeyId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to update journey stage') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateJourneyNotes: async ({ contactId, journeyId, notes }) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('contact_journeys')
        .update({
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq('contact_id', contactId)
        .eq('journey_id', journeyId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to update journey notes') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  removeFromJourney: async ({ contactId, journeyId }) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('contact_journeys')
        .delete()
        .eq('contact_id', contactId)
        .eq('journey_id', journeyId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to remove contact from journey') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));