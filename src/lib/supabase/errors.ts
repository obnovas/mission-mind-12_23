export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export function handleError(error: unknown): Error {
  // Handle API key errors
  if (error instanceof Error && error.message.includes('No API key found')) {
    return new SupabaseError(
      'Authentication configuration error. Please contact support.',
      'AUTH_CONFIG_ERROR'
    );
  }

  // Handle user existence errors
  if (error instanceof Error && error.message.includes('User already registered')) {
    return new SupabaseError(
      'An account with this email already exists',
      'USER_EXISTS'
    );
  }

  // Handle password validation errors
  if (error instanceof Error && error.message.includes('Password should be')) {
    return new SupabaseError(
      'Password must be at least 6 characters',
      'INVALID_PASSWORD'
    );
  }

  // Handle email validation errors
  if (error instanceof Error && error.message.includes('Invalid email')) {
    return new SupabaseError(
      'Please enter a valid email address',
      'INVALID_EMAIL'
    );
  }

  // Handle server errors
  if (error instanceof Error && error.message.includes('500')) {
    return new SupabaseError(
      'Unable to process request. Please try again later.',
      'SERVER_ERROR'
    );
  }

  // Handle database errors
  if (error instanceof Error && error.message.includes('Database error')) {
    return new SupabaseError(
      'Unable to save data. Please try again later.',
      'DATABASE_ERROR'
    );
  }

  // Handle network errors
  if (error instanceof Error && error.message.includes('Failed to fetch')) {
    return new SupabaseError(
      'Unable to connect to the server. Please check your connection.',
      'NETWORK_ERROR'
    );
  }

  // Default error
  return new SupabaseError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    error
  );
}