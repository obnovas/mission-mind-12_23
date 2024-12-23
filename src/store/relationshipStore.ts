import { create } from 'zustand';
import { Relationship } from '../types';
import { supabase, handleError } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface RelationshipStore {
  relationships: Relationship[];
  loading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  addRelationship: (relationship: Omit<Relationship, 'id' | 'user_id'>) => Promise<void>;
  updateRelationship: (id: string, relationship: Partial<Relationship>) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
  getRelationship: (id: string) => Relationship | undefined;
  getContactRelationships: (contactId: string) => Relationship[];
}

export const useRelationshipStore = create<RelationshipStore>((set, get) => ({
  relationships: [],
  loading: false,
  error: null,

  fetch: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('relationships')
        .select(`
          *,
          from_contact:contacts!from_contact_id(name, email),
          to_contact:contacts!to_contact_id(name, email)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      set({ relationships: data || [], error: null });
    } catch (err) {
      const error = handleError(err);
      console.error('Error fetching relationships:', error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  addRelationship: async (relationship) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      // Create the primary relationship
      const { data: primary, error: primaryError } = await supabase
        .from('relationships')
        .insert({
          ...relationship,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (primaryError) throw primaryError;

      // Create the reciprocal relationship
      const reciprocal = {
        from_contact_id: relationship.to_contact_id,
        to_contact_id: relationship.from_contact_id,
        type: relationship.type,
        notes: relationship.notes,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: secondary, error: secondaryError } = await supabase
        .from('relationships')
        .insert(reciprocal)
        .select()
        .single();

      if (secondaryError) throw secondaryError;

      // Refresh relationships to get the full data with contact details
      await get().fetch();
    } catch (err) {
      const error = handleError(err);
      console.error('Error adding relationship:', error);
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRelationship: async (id, updates) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const relationship = get().relationships.find(r => r.id === id);
      if (!relationship) throw new Error('Relationship not found');

      // Update the primary relationship
      const { error: primaryError } = await supabase
        .from('relationships')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (primaryError) throw primaryError;

      // Find and update the reciprocal relationship
      const reciprocal = get().relationships.find(
        r => r.from_contact_id === relationship.to_contact_id &&
             r.to_contact_id === relationship.from_contact_id
      );

      if (reciprocal) {
        const { error: secondaryError } = await supabase
          .from('relationships')
          .update({
            type: updates.type,
            notes: updates.notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', reciprocal.id)
          .eq('user_id', user.id);

        if (secondaryError) throw secondaryError;
      }

      // Refresh relationships to get updated data
      await get().fetch();
    } catch (err) {
      const error = handleError(err);
      console.error('Error updating relationship:', error);
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteRelationship: async (id) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const relationship = get().relationships.find(r => r.id === id);
      if (!relationship) throw new Error('Relationship not found');

      // Delete the primary relationship
      const { error: primaryError } = await supabase
        .from('relationships')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (primaryError) throw primaryError;

      // Find and delete the reciprocal relationship
      const reciprocal = get().relationships.find(
        r => r.from_contact_id === relationship.to_contact_id &&
             r.to_contact_id === relationship.from_contact_id
      );

      if (reciprocal) {
        const { error: secondaryError } = await supabase
          .from('relationships')
          .delete()
          .eq('id', reciprocal.id)
          .eq('user_id', user.id);

        if (secondaryError) throw secondaryError;
      }

      // Update local state
      set(state => ({
        relationships: state.relationships.filter(r => r.id !== id && r.id !== reciprocal?.id),
        error: null
      }));
    } catch (err) {
      const error = handleError(err);
      console.error('Error deleting relationship:', error);
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getRelationship: (id) => get().relationships.find(r => r.id === id),

  getContactRelationships: (contactId) =>
    get().relationships.filter(r => r.from_contact_id === contactId),
}));