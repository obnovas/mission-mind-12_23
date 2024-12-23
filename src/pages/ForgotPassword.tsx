import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/auth/AuthLayout';

export function ForgotPassword() {
  const { resetPassword, loading, error } = useAuth();
  const [email, setEmail] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to send reset email');
    }
  };

  return (
    <AuthLayout title="Reset your password">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {(localError || error) && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{localError || error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">
              Password reset instructions have been sent to your email address.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </div>

        <div className="text-sm text-center">
          <Link to="/signin" className="font-medium text-accent-600 hover:text-accent-500">
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}