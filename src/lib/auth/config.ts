import { getEnvConfig } from '../../config/env';

export const AUTH_CONFIG = {
  providers: {
    google: {
      clientId: getEnvConfig().googleClientId,
      redirectUrl: `${window.location.origin}/signin`,
      autoSelect: true,
      useWebFedCm: true,
    },
  },
  auth: {
    autoConfirm: true, // Disable email confirmation requirement
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'mission-mind-auth',
  },
  urls: {
    signIn: '/signin',
    signUp: '/signup',
    resetPassword: '/reset-password',
    afterSignIn: '/',
  },
} as const;