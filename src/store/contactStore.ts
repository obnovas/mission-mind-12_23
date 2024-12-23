import { create } from 'zustand';
import { Contact } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { calculateNextCheckInDate } from '../utils/dates';
import { handleSupabaseRequest } from '../lib/supabase';

interface ContactState {
  items: Contact[];
  loading: boolean;
  error: Error | null;
  retryCount: number;
  fetch: () => Promise<void>;
  add: (contact: Omit<Contact, 'id' | 'user_id'>) => Promise<void>;
  update: (id: string, updates: Partial<Contact>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  checkIn: (id: string, notes?: string, checkInDate?: string) => Promise<void>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useContactStore = create<ContactState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  retryCount: 0,

  fetch: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      set({ loading: true, error: null });

      const data = await handleSupabaseRequest(
        supabase
          .from('contacts')
          .select(`
            *,
            contact_journeys (
              journey_id,
              stage,
              notes,
              started_at,
              updated_at,
              journeys (
                id,
                name,
                stages
              )
            )
          `)
          .eq('user_id', user.id)
          .order('name')
      );

      // Transform the data to match our Contact type
      const transformedData = data?.map(contact => ({
        ...contact,
        journeys: contact.contact_journeys?.map(cj => ({
          journey_id: cj.journey_id,
          journey_name: cj.journeys.name,
          stage: cj.stage,
          notes: cj.notes,
          started_at: cj.started_at,
          updated_at: cj.updated_at
        }))
      }));

      set({ 
        items: transformedData || [], 
        error: null,
        retryCount: 0 
      });
    } catch (err) {
      const retryCount = get().retryCount;
      
      if (retryCount < MAX_RETRIES) {
        // Retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)));
        set({ retryCount: retryCount + 1 });
        return get().fetch();
      }

      console.error('Error fetching contacts:', err);
      set({ 
        error: err instanceof Error ? err : new Error('Failed to load contacts'),
        retryCount: 0
      });
    } finally {
      set({ loading: false });
    }
  },

  // Rest of the implementation remains the same...
}));