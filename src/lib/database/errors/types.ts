export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }

  static fromSupabaseError(error: any): DatabaseError {
    if (error?.code === '23505') {
      return new DatabaseError(
        'A record with this information already exists',
        'DUPLICATE_RECORD',
        error
      );
    }

    if (error?.code === '23503') {
      return new DatabaseError(
        'This operation would break existing relationships',
        'FOREIGN_KEY_VIOLATION',
        error
      );
    }

    if (error?.message?.includes('JWT expired')) {
      return new DatabaseError(
        'Your session has expired. Please sign in again.',
        'SESSION_EXPIRED',
        error
      );
    }

    if (error?.message?.includes('Failed to fetch')) {
      return new DatabaseError(
        'Unable to connect to the database. Please check your connection.',
        'CONNECTION_ERROR',
        error
      );
    }

    return new DatabaseError(
      error?.message || 'An unexpected database error occurred',
      'UNKNOWN_ERROR',
      error
    );
  }
}