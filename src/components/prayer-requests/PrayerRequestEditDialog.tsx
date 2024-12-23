import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Contact, PrayerRequest } from '../../types';
import { usePrayerRequestStore } from '../../store/prayerRequestStore';
import { formatDate } from '../../utils/dates';

interface PrayerRequestEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: PrayerRequest | null;
  contacts: Contact[];
}

export function PrayerRequestEditDialog({
  isOpen,
  onClose,
  request,
  contacts,
}: PrayerRequestEditDialogProps) {
  const [formData, setFormData] = React.useState({
    contact_id: '',
    request: '',
    answer_notes: '',
    status: 'Active' as 'Active' | 'Answered' | 'Archived',
  });

  const { loading, error, update } = usePrayerRequestStore();

  React.useEffect(() => {
    if (request) {
      setFormData({
        contact_id: request.contact_id,
        request: request.request,
        answer_notes: request.answer_notes || '',
        status: request.status,
      });
    }
  }, [request]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    try {
      await update(request.id, {
        ...formData,
        updated_at: new Date().toISOString(),
      });
      onClose();
    } catch (err) {
      console.error('Error updating prayer request:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!request) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                Edit Prayer Request
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
                rows={3}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                required
              >
                <option value="Active">Active</option>
                <option value="Answered">Answered</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Answer Notes
              </label>
              <textarea
                name="answer_notes"
                value={formData.answer_notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                placeholder="Add notes about how this prayer was answered..."
              />
            </div>

            <div className="text-sm text-neutral-500">
              Created: {formatDate(request.created_at)}
              {request.updated_at !== request.created_at && (
                <> • Last updated: {formatDate(request.updated_at)}</>
              )}
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
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}