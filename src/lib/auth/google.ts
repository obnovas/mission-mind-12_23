import { DatabaseClient } from '../database/types';
import { generateNonce, hashNonce } from '../utils/crypto';

export interface GoogleAuthConfig {
  clientId: string;
  redirectUrl?: string;
  autoSelect?: boolean;
  useWebFedCm?: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export class GoogleAuthProvider {
  private static instance: GoogleAuthProvider;
  private initialized = false;
  private nonce: string | null = null;
  private hashedNonce: string | null = null;
  private scriptLoaded = false;

  private constructor() {}

  public static getInstance(): GoogleAuthProvider {
    if (!GoogleAuthProvider.instance) {
      GoogleAuthProvider.instance = new GoogleAuthProvider();
    }
    return GoogleAuthProvider.instance;
  }

  public async initialize(config: GoogleAuthConfig): Promise<void> {
    if (this.initialized) return;

    try {
      // Load Google Identity Services script if not already loaded
      if (!this.scriptLoaded) {
        await this.loadGoogleScript();
        this.scriptLoaded = true;
      }

      // Wait for the script to be fully loaded
      await this.waitForGoogleScript();

      // Generate nonce pair
      const { nonce, hashedNonce } = await generateNoncePair();
      this.nonce = nonce;
      this.hashedNonce = hashedNonce;

      // Initialize Google Identity Services
      window.google?.accounts.id.initialize({
        client_id: config.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: config.autoSelect ?? true,
        use_fedcm_for_prompt: config.useWebFedCm ?? true,
        nonce: this.hashedNonce,
      });

      this.initialized = true;
    } catch (err) {
      console.error('Failed to initialize Google Auth:', err);
      throw err;
    }
  }

  public renderButton(elementId: string, theme: 'outline' | 'filled_blue' | 'filled_black' = 'outline'): void {
    if (!this.initialized || !window.google) {
      throw new Error('Google Auth not initialized');
    }

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    window.google.accounts.id.renderButton(element, {
      theme,
      size: 'large',
      type: 'standard',
      shape: 'pill',
      text: 'signin_with',
      logo_alignment: 'left',
    });
  }

  public async signIn(client: DatabaseClient, credential: string) {
    if (!this.initialized || !this.nonce) {
      throw new Error('Google Auth not initialized');
    }

    try {
      const { data, error } = await client.auth.signInWithIdToken({
        provider: 'google',
        token: credential,
        nonce: this.nonce,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Google sign in error:', err);
      throw err;
    }
  }

  private async loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  private waitForGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (window.google?.accounts?.id) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  private handleCredentialResponse(response: any) {
    if (!this.nonce) {
      throw new Error('Nonce not initialized');
    }

    const event = new CustomEvent('googleAuthResponse', {
      detail: { credential: response.credential }
    });
    window.dispatchEvent(event);
  }
}

export const googleAuth = GoogleAuthProvider.getInstance();