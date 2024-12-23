import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { clearAuthSession } from '../lib/auth/session';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  clearAuth: async () => {
    try {
      await clearAuthSession();
      set({ user: null, loading: false });
    } catch (err) {
      console.error('Error clearing auth:', err);
      // Still clear local state on error
      set({ user: null, loading: false });
    }
  },

  refreshSession: async () => {
    try {
      set({ loading: true });
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      set({ user: session?.user || null, loading: false });
    } catch (err) {
      console.error('Error refreshing session:', err);
      set({ user: null, loading: false });
    }
  }
}));

// Initialize auth state
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user || null);
});