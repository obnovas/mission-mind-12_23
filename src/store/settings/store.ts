import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import { Settings, SettingsStore } from './types';
import { defaultSettings, validateSettings } from './defaults';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      initializeSettings: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        try {
          const { data: existingSettings, error: fetchError } = await supabase
            .from('user_settings')
            .select('settings')
            .eq('user_id', user.id)
            .maybeSingle();

          if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
          }

          if (existingSettings) {
            const validatedSettings = validateSettings({
              ...existingSettings.settings,
              userId: user.id
            });
            set({ settings: validatedSettings });
          } else {
            const initialSettings = validateSettings({ userId: user.id });
            const { error: insertError } = await supabase
              .from('user_settings')
              .insert({
                user_id: user.id,
                settings: initialSettings,
              });

            if (insertError) throw insertError;
            set({ settings: initialSettings });
          }
        } catch (err) {
          console.warn('Error initializing settings:', err);
          // Fall back to default settings with user ID
          set({ settings: validateSettings({ userId: user?.id || null }) });
        }
      },

      updateSettings: async (newSettings) => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        try {
          const updatedSettings = validateSettings({
            ...get().settings,
            ...newSettings
          });
          
          const { error } = await supabase
            .from('user_settings')
            .update({
              settings: updatedSettings,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

          if (error) throw error;
          set({ settings: updatedSettings });
        } catch (err) {
          console.error('Error updating settings:', err);
          throw err;
        }
      },

      setUserId: (userId) => set(state => ({
        settings: validateSettings({ ...state.settings, userId })
      })),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        settings: {
          ...state.settings,
          userId: null,
        },
      }),
    }
  )
);

// Initialize settings when auth state changes
useAuthStore.subscribe((state) => {
  if (state.user) {
    useSettingsStore.getState().initializeSettings();
  }
});