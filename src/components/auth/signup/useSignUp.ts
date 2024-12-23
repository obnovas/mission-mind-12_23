import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useSettingsStore } from '../../../store/settingsStore';
import { SignUpData } from './SignUpContainer';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { updateSettings } = useSettingsStore();

  const createAccount = async (formData: SignUpData) => {
    try {
      setError(null);
      setLoading(true);

      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            organization: formData.organization,
            timezone: formData.timezone,
          },
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (signUpError) throw signUpError;
      if (!data?.user) throw new Error('Failed to create account');

      // Initialize user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert({
          user_id: data.user.id,
          timezone: formData.timezone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (settingsError) throw settingsError;

      // Update local settings
      updateSettings({
        userName: formData.name,
        timezone: formData.timezone,
      });

      // Navigate to sign in
      navigate('/signin');
    } catch (err) {
      console.error('Signup error:', err);
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setError(new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createAccount,
  };
}