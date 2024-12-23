import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export async function clearAuthSession() {
  try {
    // First clear local storage
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('mission-mind-auth');
    sessionStorage.clear();
    
    try {
      // Attempt to sign out from Supabase
      await supabase.auth.signOut({
        scope: 'global'
      });
    } catch (err) {
      // Log but don't throw - we still want to clear local state
      console.warn('Server sign out failed:', err);
    }

    // Always clear session state
    await supabase.auth.clearSession();
  } catch (err) {
    // Log but don't throw - ensure UI can still transition
    console.warn('Error during session cleanup:', err);
  }
}

export function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  
  try {
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}