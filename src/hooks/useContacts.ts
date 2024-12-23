import { useState } from 'react';
import { Contact } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { calculateNextCheckInDate } from '../utils/dates';
import { useContactStore } from '../store/contactStore';

export function useContacts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthStore();

  const checkIn = async (id: string, notes?: string, checkInDate?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get current contact
      const { data: contact, error: fetchError } = await supabase
        .from('contacts')
        .select('check_in_frequency')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      if (!contact) throw new Error('Contact not found');

      const checkInDateTime = checkInDate ? new Date(checkInDate) : new Date();
      const nextCheckIn = calculateNextCheckInDate(contact.check_in_frequency, checkInDateTime);

      // Always update both dates when performing a check-in
      const updates = {
        notes,
        last_contact_date: checkInDateTime.toISOString(),
        next_contact_date: nextCheckIn.toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update contact
      const { data, error: updateError } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh contacts list
      await useContactStore.getState().fetch();
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error during check-in';
      setError(new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const dbUpdates: any = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // If check-in frequency changes, update next check-in date
      if (updates.check_in_frequency) {
        const lastContactDate = updates.last_contact_date || new Date().toISOString();
        dbUpdates.next_contact_date = calculateNextCheckInDate(
          updates.check_in_frequency,
          new Date(lastContactDate)
        ).toISOString();
      }

      const { data, error: dbError } = await supabase
        .from('contacts')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (dbError) throw dbError;

      // Refresh contacts list
      await useContactStore.getState().fetch();

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating contact';
      setError(new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const now = new Date().toISOString();
      const nextCheckIn = calculateNextCheckInDate(contact.check_in_frequency).toISOString();

      const { data, error: dbError } = await supabase
        .from('contacts')
        .insert({
          ...contact,
          user_id: user.id,
          last_contact_date: now,
          next_contact_date: nextCheckIn,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Refresh contacts list
      await useContactStore.getState().fetch();

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding contact';
      setError(new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkIn,
    updateContact,
    addContact,
  };
}