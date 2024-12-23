export class AuthError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }

  static fromSupabaseError(error: any): AuthError {
    // Handle specific Supabase error codes
    if (error?.status === 500) {
      return new AuthError(
        'Unable to connect to authentication service. Please try again later.',
        'SERVICE_UNAVAILABLE'
      );
    }

    if (error?.message?.includes('Email not confirmed')) {
      return new AuthError(
        'Please verify your email address before signing in.',
        'EMAIL_NOT_VERIFIED'
      );
    }

    if (error?.message?.includes('Invalid login credentials')) {
      return new AuthError(
        'Invalid email or password.',
        'INVALID_CREDENTIALS'
      );
    }

    if (error?.message?.includes('User already registered')) {
      return new AuthError(
        'An account with this email already exists.',
        'USER_EXISTS'
      );
    }

    if (error?.message?.includes('Password should be')) {
      return new AuthError(
        'Password must be at least 6 characters.',
        'INVALID_PASSWORD'
      );
    }

    if (error?.message?.includes('Invalid email')) {
      return new AuthError(
        'Please enter a valid email address.',
        'INVALID_EMAIL'
      );
    }

    if (error?.message?.includes('Auth session missing')) {
      return new AuthError(
        'Your session has expired. Please sign in again.',
        'SESSION_EXPIRED'
      );
    }

    // Default error
    return new AuthError(
      error?.message || 'An unexpected authentication error occurred',
      error?.code || 'UNKNOWN_ERROR',
      error
    );
  }
}