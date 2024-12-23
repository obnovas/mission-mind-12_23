import { AuthError } from '../errors';
import { AuthCredentials, AuthResponse } from '../types';

export abstract class BaseAuthProvider {
  abstract initialize(): Promise<void>;
  abstract signIn(credentials: AuthCredentials): Promise<AuthResponse>;
  abstract signUp(credentials: AuthCredentials): Promise<AuthResponse>;
  abstract signOut(): Promise<void>;

  protected handleError(error: unknown): never {
    console.error('Auth error:', error);
    throw new AuthError(
      error instanceof Error ? error.message : 'Authentication failed',
      error instanceof Error ? error.name : 'UnknownError'
    );
  }
}