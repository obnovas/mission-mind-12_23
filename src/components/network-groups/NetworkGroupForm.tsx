import React from 'react';
import { Dialog } from '@headlessui/react';
import { NetworkGroup, Contact } from '../../types';
import { X, Search } from 'lucide-react';
import { useNetworkGroupStore } from '../../store/networkGroupStore';

interface NetworkGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  group?: NetworkGroup;
  contacts: Contact[];
}

export function NetworkGroupForm({
  isOpen,
  onClose,
  group,
  contacts,
}: NetworkGroupFormProps) {
  const [formData, setFormData] = React.useState<Partial<NetworkGroup>>({
    name: '',
    description: '',
    members: [],
  });
  const [searchQuery, setSearchQuery] = React.useState('');
  const { loading, error, add, update } = useNetworkGroupStore();

  // Reset form data when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData(group || {
        name: '',
        description: '',
        members: [],
      });
      setSearchQuery('');
    }
  }, [isOpen, group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (group) {
        await update(group.id, {
          name: formData.name,
          description: formData.description,
          members: formData.members || [],
        });
      } else {
        await add({
          name: formData.name,
          description: formData.description || '',
          members: formData.members || [],
        });
      }
      onClose();
    } catch (err) {
      console.error('Error saving network group:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMember = (contactId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members?.includes(contactId)
        ? prev.members.filter((id) => id !== contactId)
        : [...(prev.members || []), contactId],
    }));
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                {group ? 'Edit Network Group' : 'Create Network Group'}
              </Dialog.Title>
              <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error.message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Members
              </label>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                  placeholder="Search contacts..."
                />
              </div>
              <div className="max-h-60 overflow-y-auto border border-neutral-200 rounded-md">
                {filteredContacts.map((contact) => (
                  <label
                    key={contact.id}
                    className="flex items-center p-3 hover:bg-neutral-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.members?.includes(contact.id)}
                      onChange={() => toggleMember(contact.id)}
                      className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300 rounded"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-neutral-900">
                        {contact.name}
                      </p>
                      <p className="text-sm text-neutral-500">{contact.email}</p>
                    </div>
                  </label>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="p-4 text-center text-neutral-500">
                    No contacts found
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
              >
                {loading ? 'Saving...' : group ? 'Update Group' : 'Create Group'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}