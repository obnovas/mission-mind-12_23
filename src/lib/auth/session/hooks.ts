import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabase';
import { isSessionValid } from './validation';
import { handleSessionError } from './errors';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) throw error;
        
        if (session && isSessionValid(session)) {
          setSession(session);
          setError(null);
        } else {
          setSession(null);
        }
      } catch (err) {
        if (!mounted) return;
        setError(handleSessionError(err));
        setSession(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        
        try {
          if (session && isSessionValid(session)) {
            setSession(session);
            setError(null);
          } else {
            setSession(null);
          }
        } catch (err) {
          setError(handleSessionError(err));
          setSession(null);
        } finally {
          setLoading(false);
        }
      }
    );

    initSession();

    return () => {
      mounted = false;
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