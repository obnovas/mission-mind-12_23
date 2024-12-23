import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { validateEmail } from '../../../utils/validation';

interface EmailPasswordStepProps {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  error: Error | null;
}

export function EmailPasswordStep({ onSubmit, loading, error }: EmailPasswordStepProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    onSubmit(email, password);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {(localError || error) && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{localError || error?.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 placeholder-neutral-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      </div>

      <div className="text-sm text-center">
        <Link to="/signin" className="font-medium text-accent-600 hover:text-accent-500 transition-colors duration-200">
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}