import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { sessionManager } from '../lib/auth/session/manager';
import { isSessionValid } from '../lib/auth/session/validation';

export function useSession() {
  const [session, setSession] = useState<Session | null>(sessionManager.getSession());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to session changes
    const unsubscribe = sessionManager.subscribe((newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    // Initial loading state
    setLoading(false);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
    isValid: session ? isSessionValid(session) : false,
  };
}