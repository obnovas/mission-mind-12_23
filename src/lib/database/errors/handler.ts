import { DatabaseError } from './types';

export function handleDatabaseError(error: unknown): DatabaseError {
  if (error instanceof DatabaseError) {
    return error;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return new DatabaseError(
      'Unable to connect to the database. Please check your internet connection.',
      'CONNECTION_ERROR',
      error
    );
  }

  // Handle timeout errors
  if (error instanceof Error && error.message.includes('timeout')) {
    return new DatabaseError(
      'The database request timed out. Please try again.',
      'TIMEOUT_ERROR',
      error
    );
  }

  // Handle authentication errors
  if (error instanceof Error && error.message.includes('JWT')) {
    return new DatabaseError(
      'Your session has expired. Please sign in again.',
      'AUTH_ERROR',
      error
    );
  }

  // Handle other errors
  return new DatabaseError(
    'An unexpected database error occurred. Please try again.',
    'UNKNOWN_ERROR',
    error
  );
}