import React from 'react';
import { usePrayerRequestStore } from '../store/prayerRequestStore';
import { useContactStore } from '../store/contactStore';
import { useSettingsStore } from '../store/settingsStore';
import { PrayerRequestForm } from '../components/prayer-requests/PrayerRequestForm';
import { PrayerRequestList } from '../components/prayer-requests/PrayerRequestList';
import { PrayerRequestSearch } from '../components/prayer-requests/PrayerRequestSearch';
import { Plus } from 'lucide-react';

export function PrayerRequests() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { items: prayerRequests, loading, error, fetch } = usePrayerRequestStore();
  const { items: contacts, fetch: fetchContacts } = useContactStore();
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    // Fetch initial data
    fetch();
    fetchContacts();
  }, []);

  const filteredRequests = prayerRequests.filter((request) => {
    const contact = contacts.find(c => c.id === request.contact_id);
    const searchText = `${contact?.name} ${request.request}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  });

  const handleAdd = () => {
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading prayer requests: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-roboto font-bold text-neutral-900">{settings.featureLabel}</h1>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="w-full sm:w-64">
                <PrayerRequestSearch value={searchQuery} onChange={setSearchQuery} />
              </div>
              <button
                onClick={handleAdd}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {settings.featureLabel.slice(0, -1)}
              </button>
            </div>
          </div>
        </div>
      </div>

      <PrayerRequestList
        requests={filteredRequests}
        contacts={contacts}
        onStatusChange={async (id, status) => {
          await usePrayerRequestStore.getState().update(id, {
            status,
            updated_at: new Date().toISOString(),
          });
          fetch(); // Refresh the list
        }}
      />

      <PrayerRequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        contacts={contacts}
      />
    </div>
  );
}