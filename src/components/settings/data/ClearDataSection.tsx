import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { supabase } from '../../../lib/supabase';

export function ClearDataSection() {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [confirmEmail, setConfirmEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAuthStore();

  const handleClearData = async () => {
    if (!user || confirmEmail !== user.email) {
      setError('Email does not match your account email');
      return;
    }

    try {
      const tables = [
        'contacts',
        'prayer_requests',
        'journeys',
        'network_groups',
        'contact_journeys',
        'network_group_members',
        'check_ins',
        'favorites'
      ];

      for (const table of tables) {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
      }

      setShowConfirm(false);
      setConfirmEmail('');
      setError(null);
    } catch (err) {
      console.error('Error clearing data:', err);
      setError('Failed to clear data. Please try again.');
    }
  };

  return (
    <div className="bg-coral-50 rounded-lg border border-coral-200 p-4">
      {!showConfirm ? (
        <div className="space-y-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-coral-600 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-coral-800">Clear All Data</h3>
              <p className="mt-1 text-sm text-coral-700">
                This will permanently delete all your data. This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full px-4 py-2 bg-coral-600 text-white rounded-md hover:bg-coral-700 transition-colors duration-200"
          >
            Clear All Data
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-coral-800 font-medium">
            To confirm deletion, please enter your email address: {user?.email}
          </p>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="w-full rounded-md border-coral-300 focus:border-coral-500 focus:ring-coral-500"
            placeholder="Enter your email to confirm"
          />
          {error && (
            <p className="text-sm text-coral-600">{error}</p>
          )}
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmEmail('');
                setError(null);
              }}
              className="flex-1 px-4 py-2 bg-white border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={handleClearData}
              className="flex-1 px-4 py-2 bg-coral-600 text-white rounded-md hover:bg-coral-700"
            >
              Confirm Clear Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}