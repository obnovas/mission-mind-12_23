import React from 'react';
import { Dialog } from '@headlessui/react';
import { Contact } from '../../../types';
import { X } from 'lucide-react';
import { useContacts } from '../../../hooks/useContacts';
import { ContactFormFields } from './ContactFormFields';
import { useContactStore } from '../../../store/contactStore';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact;
}

export function ContactForm({ isOpen, onClose, contact }: ContactFormProps) {
  const { loading, error, addContact, updateContact } = useContacts();
  
  const defaultFormData = {
    name: '',
    type: 'Individual' as const,
    email: '',
    phone: '',
    address: '',
    notes: '',
    check_in_frequency: 'Monthly' as const,
  };

  const [formData, setFormData] = React.useState(defaultFormData);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(contact ? {
        ...contact,
        check_in_frequency: contact.check_in_frequency || 'Monthly'
      } : defaultFormData);
    }
  }, [isOpen, contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (contact) {
        await updateContact(contact.id, formData);
      } else {
        await addContact(formData);
      }
      // Refresh contacts list
      await useContactStore.getState().fetch();
      onClose();
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-2xl w-full">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                {contact ? 'Edit Contact' : 'Add Contact'}
              </Dialog.Title>
              <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error.message}
              </div>
            )}

            <ContactFormFields 
              formData={formData}
              onChange={handleChange}
            />

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : contact ? 'Update Contact' : 'Add Contact'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}