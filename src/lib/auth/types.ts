export interface AuthProvider {
  initialize(): Promise<void>;
  signIn(credentials: any): Promise<any>;
  signOut(): Promise<void>;
}

export interface AuthError extends Error {
  code?: string;
  details?: any;
}

export interface AuthSession {
  user: AuthUser | null;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  metadata?: Record<string, any>;
}

export interface AuthCredentials {
  email?: string;
  password?: string;
  provider?: string;
  token?: string;
  nonce?: string;
}