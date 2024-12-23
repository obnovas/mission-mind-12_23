import { AuthError } from './types';

export function handleAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  // Handle specific error cases
  if (typeof error === 'object' && error !== null) {
    const err = error as any;

    if (err.status === 500) {
      return new AuthError(
        'Unable to connect to authentication service. Please try again later.',
        'SERVICE_UNAVAILABLE'
      );
    }

    if (err.message?.includes('Email not confirmed')) {
      return new AuthError(
        'Please verify your email address before signing in.',
        'EMAIL_NOT_VERIFIED'
      );
    }

    if (err.message?.includes('Invalid login credentials')) {
      return new AuthError(
        'Invalid email or password.',
        'INVALID_CREDENTIALS'
      );
    }

    if (err.message?.includes('User already registered')) {
      return new AuthError(
        'An account with this email already exists.',
        'USER_EXISTS'
      );
    }

    if (err.message?.includes('Password should be')) {
      return new AuthError(
        'Password must be at least 6 characters.',
        'INVALID_PASSWORD'
      );
    }

    if (err.message?.includes('Invalid email')) {
      return new AuthError(
        'Please enter a valid email address.',
        'INVALID_EMAIL'
      );
    }
  }

  // Default error
  return new AuthError(
    'An unexpected authentication error occurred',
    'UNKNOWN_ERROR',
    error
  );
}