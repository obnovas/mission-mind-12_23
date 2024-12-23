import { Session } from '@supabase/supabase-js';

export function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  
  try {
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}