import { create } from 'zustand';
import { NetworkGroup } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface NetworkGroupState {
  items: NetworkGroup[];
  loading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  add: (group: Omit<NetworkGroup, 'id' | 'user_id'>) => Promise<void>;
  update: (id: string, updates: Partial<NetworkGroup>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  addMember: (groupId: string, contactId: string) => Promise<void>;
  removeMember: (groupId: string, contactId: string) => Promise<void>;
}

export const useNetworkGroupStore = create<NetworkGroupState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      // First, get all network groups
      const { data: groups, error: groupsError } = await supabase
        .from('network_groups')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (groupsError) throw groupsError;

      // Then, get all members for these groups
      const { data: members, error: membersError } = await supabase
        .from('network_group_members')
        .select(`
          group_id,
          contact_id
        `)
        .in('group_id', groups?.map(g => g.id) || []);

      if (membersError) throw membersError;

      // Transform the data to match our NetworkGroup type
      const transformedGroups = groups?.map(group => ({
        ...group,
        members: members
          ?.filter(m => m.group_id === group.id)
          .map(m => m.contact_id) || []
      }));

      set({ items: transformedGroups || [], error: null });
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to fetch network groups') });
    } finally {
      set({ loading: false });
    }
  },

  add: async (group) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      // First, create the network group
      const { data: newGroup, error: groupError } = await supabase
        .from('network_groups')
        .insert({
          name: group.name,
          description: group.description,
          user_id: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Then, add all members
      if (group.members?.length > 0) {
        const memberInserts = group.members.map(memberId => ({
          group_id: newGroup.id,
          contact_id: memberId,
          user_id: user.id,
        }));

        const { error: membersError } = await supabase
          .from('network_group_members')
          .insert(memberInserts);

        if (membersError) throw membersError;
      }

      // Refresh the groups list
      await get().fetch();
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to create network group') });
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

      // Update the group details
      const { error: groupError } = await supabase
        .from('network_groups')
        .update({
          name: updates.name,
          description: updates.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (groupError) throw groupError;

      // If members were updated, handle member changes
      if (updates.members) {
        // First, remove all existing members
        const { error: deleteError } = await supabase
          .from('network_group_members')
          .delete()
          .eq('group_id', id);

        if (deleteError) throw deleteError;

        // Then, add the new members
        if (updates.members.length > 0) {
          const memberInserts = updates.members.map(memberId => ({
            group_id: id,
            contact_id: memberId,
            user_id: user.id,
          }));

          const { error: insertError } = await supabase
            .from('network_group_members')
            .insert(memberInserts);

          if (insertError) throw insertError;
        }
      }

      // Refresh the groups list
      await get().fetch();
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to update network group') });
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

      // Delete the group (this will cascade delete members due to foreign key constraint)
      const { error } = await supabase
        .from('network_groups')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      set(state => ({
        items: state.items.filter(group => group.id !== id),
        error: null,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to delete network group') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  addMember: async (groupId, contactId) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('network_group_members')
        .insert({
          group_id: groupId,
          contact_id: contactId,
          user_id: user.id,
        });

      if (error) throw error;

      // Refresh the groups list
      await get().fetch();
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to add member to group') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  removeMember: async (groupId, contactId) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('network_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('contact_id', contactId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh the groups list
      await get().fetch();
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error('Failed to remove member from group') });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));