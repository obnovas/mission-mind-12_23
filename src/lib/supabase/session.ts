import { supabase } from './config';
import { handleSupabaseError } from './errors';
import type { Session } from '@supabase/supabase-js';

export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (err) {
    throw handleSupabaseError(err);
  }
}

export async function refreshSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (err) {
    throw handleSupabaseError(err);
  }
}

export function subscribeToAuthChanges(callback: (session: Session | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
}