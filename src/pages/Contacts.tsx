import React from 'react';
import { useContactStore } from '../store/contactStore';
import { ContactsTable } from '../components/contacts/ContactsTable';
import { ContactForm } from '../components/contacts/form';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { Contact } from '../types';
import { UserPlus } from 'lucide-react';

export function Contacts() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | undefined>();
  const [deleteContact, setDeleteContact] = React.useState<Contact | null>(null);
  
  const { items: contacts, loading, error } = useContactStore();

  React.useEffect(() => {
    useContactStore.getState().fetch();
  }, []);

  const handleAdd = () => {
    setSelectedContact(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };

  const handleDelete = (contact: Contact) => {
    setDeleteContact(contact);
  };

  const confirmDelete = async () => {
    if (deleteContact) {
      await useContactStore.getState().remove(deleteContact.id);
      setDeleteContact(null);
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
        <p className="text-red-600">Error loading contacts: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-roboto font-bold text-neutral-900">Contacts</h1>
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      <ContactsTable contacts={contacts} />

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        contact={selectedContact}
      />

      <ConfirmationDialog
        isOpen={!!deleteContact}
        onClose={() => setDeleteContact(null)}
        onConfirm={confirmDelete}
        title="Delete Contact"
        message={
          <>
            Are you sure you want to delete <strong>{deleteContact?.name}</strong>? This action cannot be undone and will remove all associated data including prayer requests and journey progress.
          </>
        }
        confirmLabel="Delete Contact"
        cancelLabel="Cancel"
        type="danger"
      />
    </div>
  );
}