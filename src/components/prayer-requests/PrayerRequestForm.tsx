import React from 'react';
import { Dialog } from '@headlessui/react';
import { Contact } from '../../types';
import { X } from 'lucide-react';
import { usePrayerRequestStore } from '../../store/prayerRequestStore';

interface PrayerRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  preSelectedContact?: Contact;
}

export function PrayerRequestForm({ isOpen, onClose, contacts, preSelectedContact }: PrayerRequestFormProps) {
  const [formData, setFormData] = React.useState({
    contact_id: '',
    request: '',
    answer_notes: '',
  });
  const { loading, error, add } = usePrayerRequestStore();

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        contact_id: preSelectedContact?.id || '',
        request: '',
        answer_notes: '',
      });
    }
  }, [isOpen, preSelectedContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await add({
        ...formData,
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      onClose();
    } catch (err) {
      console.error('Error adding prayer request:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                Add Prayer Request
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
                Contact
              </label>
              <select
                name="contact_id"
                value={formData.contact_id}
                onChange={handleChange}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                required
              >
                <option value="">Select a contact</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Request
              </label>
              <textarea
                name="request"
                value={formData.request}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                required
                placeholder="Enter prayer request details..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}