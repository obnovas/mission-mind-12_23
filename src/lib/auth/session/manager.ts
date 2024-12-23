import { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabase';
import { handleSessionError } from './errors';

class SessionManager {
  private static instance: SessionManager;
  private currentSession: Session | null = null;
  private listeners = new Set<(session: Session | null) => void>();
  private refreshTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeSession();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private async initializeSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      this.setSession(session);

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        this.setSession(session);
      });
    } catch (err) {
      console.error('Session initialization error:', err);
      this.setSession(null);
    }
  }

  private setSession(session: Session | null) {
    this.currentSession = session;
    this.scheduleRefresh();
    this.notifyListeners();
  }

  private scheduleRefresh() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }

    if (this.currentSession?.expires_at) {
      const expiresAt = this.currentSession.expires_at * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
      // Refresh 5 minutes before expiry
      const refreshDelay = Math.max(0, timeUntilExpiry - (5 * 60 * 1000));
      
      this.refreshTimeout = setTimeout(() => {
        this.refreshSession().catch(console.error);
      }, refreshDelay);
    }
  }

  public getSession(): Session | null {
    return this.currentSession;
  }

  public subscribe(listener: (session: Session | null) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentSession));
  }

  public async refreshSession(): Promise<void> {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      this.setSession(session);
    } catch (err) {
      const error = handleSessionError(err);
      console.error('Session refresh error:', error);
      this.setSession(null);
      throw error;
    }
  }
}

export const sessionManager = SessionManager.getInstance();