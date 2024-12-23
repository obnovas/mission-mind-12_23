import React from 'react';

interface AuthErrorProps {
  error: string | null;
}

export function AuthError({ error }: AuthErrorProps) {
  if (!error) return null;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <p className="text-sm text-red-700">{error}</p>
    </div>
  );
}