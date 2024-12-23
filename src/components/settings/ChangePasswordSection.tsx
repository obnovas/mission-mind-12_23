import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

export function ChangePasswordSection() {
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
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(localError || error) && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{localError || error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-sm text-green-700">Password updated successfully!</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          New Password
        </label>
        <div className="mt-1 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500"
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
        <label className="block text-sm font-medium text-neutral-700">
          Confirm New Password
        </label>
        <div className="mt-1">
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}