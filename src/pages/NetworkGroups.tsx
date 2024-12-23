import React from 'react';
import { useNetworkGroupStore } from '../store/networkGroupStore';
import { useContactStore } from '../store/contactStore';
import { NetworkGroupList } from '../components/network-groups/NetworkGroupList';
import { NetworkGroupForm } from '../components/network-groups/NetworkGroupForm';
import { NetworkGroupSearch } from '../components/network-groups/NetworkGroupSearch';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { NetworkGroup } from '../types';
import { Plus } from 'lucide-react';

export function NetworkGroups() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState<NetworkGroup>();
  const [deleteGroup, setDeleteGroup] = React.useState<NetworkGroup | null>(null);
  
  const { items: groups, loading, error, fetch, remove } = useNetworkGroupStore();
  const { items: contacts, fetch: fetchContacts } = useContactStore();

  React.useEffect(() => {
    // Fetch initial data
    fetch();
    fetchContacts();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedGroup(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (group: NetworkGroup) => {
    setSelectedGroup(group);
    setIsFormOpen(true);
  };

  const handleDelete = (group: NetworkGroup) => {
    setDeleteGroup(group);
  };

  const confirmDelete = async () => {
    if (deleteGroup) {
      await remove(deleteGroup.id);
      setDeleteGroup(null);
    }
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
        <p className="text-red-600">Error loading network groups: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-roboto font-bold text-neutral-900">Network Groups</h1>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="w-full sm:w-64">
                <NetworkGroupSearch value={searchQuery} onChange={setSearchQuery} />
              </div>
              <button
                onClick={handleAdd}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>

      <NetworkGroupList
        groups={filteredGroups}
        contacts={contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <NetworkGroupForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        group={selectedGroup}
        contacts={contacts}
      />

      <ConfirmationDialog
        isOpen={!!deleteGroup}
        onClose={() => setDeleteGroup(null)}
        onConfirm={confirmDelete}
        title="Delete Network Group"
        message={
          <>
            Are you sure you want to delete <strong>{deleteGroup?.name}</strong>? This action cannot be undone and will remove all member associations.
          </>
        }
        confirmLabel="Delete Group"
        cancelLabel="Cancel"
        type="danger"
      />
    </div>
  );
}