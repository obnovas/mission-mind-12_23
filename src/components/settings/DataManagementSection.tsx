import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useContactStore } from '../../store/contactStore';
import { usePrayerRequestStore } from '../../store/prayerRequestStore';
import { useJourneyStore } from '../../store/journeyStore';
import { useNetworkGroupStore } from '../../store/networkGroupStore';
import { supabase } from '../../lib/supabase';

export function DataManagementSection() {
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
      // Delete all user data from each table
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

      // Refresh all stores
      await Promise.all([
        useContactStore.getState().fetch(),
        usePrayerRequestStore.getState().fetch(),
        useJourneyStore.getState().fetch(),
        useNetworkGroupStore.getState().fetch()
      ]);

      setShowConfirm(false);
      setConfirmEmail('');
      setError(null);
    } catch (err) {
      console.error('Error clearing data:', err);
      setError('Failed to clear data. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-coral-500 overflow-hidden">
      <div className="bg-coral-50 p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <Trash2 className="h-5 w-5 text-coral-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Clear Application Data</h2>
        </div>
      </div>
      <div className="p-6">
        {!showConfirm ? (
          <div className="space-y-4">
            <p className="text-neutral-600">
              This action will permanently delete all your data from the application, including:
            </p>
            <ul className="list-disc list-inside text-neutral-600 space-y-1">
              <li>All contacts and their details</li>
              <li>All prayer requests and their history</li>
              <li>All journeys and progress tracking</li>
              <li>All network groups and memberships</li>
              <li>All check-in records</li>
              <li>All favorites and preferences</li>
            </ul>
            <div className="bg-coral-50 border border-coral-200 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-coral-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-coral-800">Warning</h3>
                  <p className="mt-1 text-sm text-coral-700">
                    This action cannot be undone. We strongly recommend exporting your data before proceeding.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coral-600 hover:bg-coral-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-coral-50 border border-coral-200 rounded-lg p-4">
              <p className="text-sm text-coral-800 font-medium">
                To confirm deletion, please enter your email address: {user?.email}
              </p>
            </div>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-coral-500 focus:ring-coral-500"
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
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                disabled={!confirmEmail}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coral-600 hover:bg-coral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Clear Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}