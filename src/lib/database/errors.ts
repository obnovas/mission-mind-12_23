export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export function handleDatabaseError(error: unknown): DatabaseError {
  if (error instanceof DatabaseError) {
    return error;
  }

  // Handle specific Supabase error codes
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    
    if (err.code === '23505') {
      return new DatabaseError('A record with this information already exists', 'DUPLICATE_RECORD', error);
    }

    if (err.code === '23503') {
      return new DatabaseError('This operation would break existing relationships', 'FOREIGN_KEY_VIOLATION', error);
    }

    if (err.message?.includes('JWT expired')) {
      return new DatabaseError('Your session has expired. Please sign in again.', 'SESSION_EXPIRED', error);
    }

    if (err.message?.includes('connection')) {
      return new DatabaseError('Unable to connect to the database. Please check your connection.', 'CONNECTION_ERROR', error);
    }
  }

  return new DatabaseError('An unexpected database error occurred', 'UNKNOWN_ERROR', error);
}