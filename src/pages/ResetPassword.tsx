import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';

export function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword, loading, error } = useAuth();
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await updatePassword(newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  return (
    <AuthLayout title="Set New Password">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {(localError || error) && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{localError || error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">
              Password updated successfully! Redirecting to sign in...
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-accent-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}