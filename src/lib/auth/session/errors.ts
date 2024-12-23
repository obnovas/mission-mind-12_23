export class SessionError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export function handleSessionError(error: unknown): SessionError {
  if (error instanceof SessionError) return error;

  const message = error instanceof Error ? error.message : 'Session error occurred';
  return new SessionError(message);
}