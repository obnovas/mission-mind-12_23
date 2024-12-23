import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { signOutUser } from '../lib/auth/signOut';
import { signUpUser } from '../lib/auth/signUp';
import { supabase } from '../lib/supabase';
import { AuthError } from '../lib/auth/errors';
import { updatePastScheduledCheckIns } from '../utils/checkIn/statusUpdate';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { updateSettings } = useSettingsStore();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data returned');

      setUser(data.user);

      // Update check-ins in background
      setTimeout(() => {
        updatePastScheduledCheckIns().catch(console.error);
      }, 1000);

      navigate('/');
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('Invalid email or password');
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);

      const user = await signUpUser(email, password, metadata);
      return { user };
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Failed to create account';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      await signOutUser();
      
      // Clear local state
      setUser(null);
      updateSettings({
        userId: null,
        userName: '',
        favoriteContacts: [],
        calendarFeeds: [],
      });

      navigate('/signin', { replace: true });
    } catch (err) {
      // Still clear local state and redirect on error
      setUser(null);
      updateSettings({
        userId: null,
        userName: '',
        favoriteContacts: [],
        calendarFeeds: [],
      });
      navigate('/signin', { replace: true });

      const message = err instanceof AuthError ? err.message : 'Error signing out';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Failed to reset password';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Failed to update password';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
  };
}