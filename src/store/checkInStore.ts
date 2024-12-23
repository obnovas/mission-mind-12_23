import { create } from 'zustand';
import { CheckIn } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { useContactStore } from './contactStore';
import { determineCheckInStatus } from '../utils/checkIn/status';

interface CheckInState {
  items: CheckIn[];
  loading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  add: (data: {
    contact_id: string;
    check_in_date: string;
    check_in_notes?: string;
    check_in_type: 'suggested' | 'planned';
    status: CheckIn['status'];
  }) => Promise<void>;
  update: (id: string, updates: Partial<CheckIn>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user.id)
        .order('check_in_date', { ascending: true });

      if (error) throw error;
      set({ items: data || [], error: null });
    } catch (err) {
      console.error('Error fetching check-ins:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to load check-ins') });
    } finally {
      set({ loading: false });
    }
  },

  add: async (data) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      // Determine status based on date
      const status = determineCheckInStatus(data.check_in_date);

      const { error: checkInError } = await supabase
        .from('check_ins')
        .insert({
          ...data,
          user_id: user.id,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (checkInError) throw checkInError;

      // Update contact's last/next check-in dates
      const { error: contactError } = await supabase
        .from('contacts')
        .update({
          last_contact_date: status === 'Completed' ? data.check_in_date : null,
          next_contact_date: status === 'Scheduled' ? data.check_in_date : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.contact_id)
        .eq('user_id', user.id);

      if (contactError) throw contactError;

      // Refresh both stores
      await Promise.all([
        get().fetch(),
        useContactStore.getState().fetch()
      ]);
    } catch (err) {
      console.error('Error adding check-in:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to add check-in') });
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

      // Determine status based on date if date is being updated
      const status = updates.check_in_date 
        ? determineCheckInStatus(updates.check_in_date)
        : updates.status;

      const { data: checkIn, error: fetchError } = await supabase
        .from('check_ins')
        .select('contact_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('check_ins')
        .update({
          ...updates,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update contact's last/next check-in dates if needed
      if (updates.check_in_date || updates.status) {
        const { error: contactError } = await supabase
          .from('contacts')
          .update({
            last_contact_date: status === 'Completed' ? updates.check_in_date : null,
            next_contact_date: status === 'Scheduled' ? updates.check_in_date : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', checkIn.contact_id)
          .eq('user_id', user.id);

        if (contactError) throw contactError;
      }

      // Refresh both stores
      await Promise.all([
        get().fetch(),
        useContactStore.getState().fetch()
      ]);
    } catch (err) {
      console.error('Error updating check-in:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to update check-in') });
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
        .from('check_ins')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh the store
      await get().fetch();
    } catch (err) {
      console.error('Error removing check-in:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to remove check-in') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));