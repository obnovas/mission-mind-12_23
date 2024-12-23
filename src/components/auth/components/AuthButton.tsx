import React from 'react';

interface AuthButtonProps {
  type?: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function AuthButton({ 
  type = 'submit',
  onClick,
  disabled = false,
  loading = false,
  children 
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="flex w-full justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {loading ? 'Processing...' : children}
    </button>
  );
}