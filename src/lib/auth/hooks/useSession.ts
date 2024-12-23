import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Session } from '@supabase/supabase-js';
import { isSessionValid } from '../session';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error);
        setSession(null);
      } else if (session && isSessionValid(session)) {
        setSession(session);
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && isSessionValid(session)) {
        setSession(session);
        setError(null);
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
    error,
    isValid: session ? isSessionValid(session) : false
  };
}