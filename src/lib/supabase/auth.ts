import { supabase } from './config';
import { handleSupabaseError } from './errors';
import type { AuthResponse, Session, User } from '@supabase/supabase-js';

export async function signUp(email: string, password: string, userData?: Record<string, any>): Promise<{ user: User | null }> {
  try {
    const redirectTo = `${window.location.origin}/signin`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: userData,
      },
    });

    if (error) throw error;
    return { user: data.user };
  } catch (err) {
    throw handleSupabaseError(err);
  }
}

export async function signIn(email: string, password: string): Promise<{ user: User | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { user: data.user };
  } catch (err) {
    throw handleSupabaseError(err);
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    throw handleSupabaseError(err);
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;
  } catch (err) {
    throw handleSupabaseError(err);
  }
}

export async function updateUserPassword(newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  } catch (err) {
    throw handleSupabaseError(err);
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (err) {
    throw handleSupabaseError(err);
  }
}

export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}