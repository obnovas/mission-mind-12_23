import React from 'react';
import { Dialog } from '@headlessui/react';
import { Contact, RelationType } from '../../types';
import { useRelationshipStore } from '../../store/relationshipStore';
import { useSettingsStore } from '../../store/settingsStore';
import { X, UserPlus, Users, Mail, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactRelationshipsProps {
  contact: Contact;
  allContacts: Contact[];
}

export function ContactRelationships({ contact, allContacts }: ContactRelationshipsProps) {
  const navigate = useNavigate();
  const [isAddingRelation, setIsAddingRelation] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<string>('');
  const [relationType, setRelationType] = React.useState<RelationType>('Friend');
  const [notes, setNotes] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const { relationships, loading, error, fetch, addRelationship, deleteRelationship } = useRelationshipStore();
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    fetch();
  }, []);

  const contactRelationships = relationships.filter(r => r.from_contact_id === contact.id);

  const filteredContacts = allContacts.filter((c) => 
    c.id !== contact.id && 
    !relationships.some(r => 
      (r.from_contact_id === contact.id && r.to_contact_id === c.id) ||
      (r.from_contact_id === c.id && r.to_contact_id === contact.id)
    ) &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     c.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    try {
      await addRelationship({
        from_contact_id: contact.id,
        to_contact_id: selectedContact,
        type: relationType,
        notes: notes.trim() || undefined,
      });

      setIsAddingRelation(false);
      setSelectedContact('');
      setRelationType('Friend');
      setNotes('');
      setSearchQuery('');
    } catch (err) {
      console.error('Failed to add relationship:', err);
    }
  };

  const handleRemoveRelationship = async (relationshipId: string) => {
    try {
      await deleteRelationship(relationshipId);
    } catch (err) {
      console.error('Failed to remove relationship:', err);
    }
  };

  const relationTypes = settings.relationshipTypes || [
    'Friend',
    'Family',
    'Colleague',
    'Mentor',
    'Mentee',
    'Member',
    'Partner',
    'Other'
  ];

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-accent-600 mr-2" />
          <h2 className="text-xl font-semibold text-neutral-900">Relationships</h2>
        </div>
        <button
          onClick={() => setIsAddingRelation(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200 w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Relationship
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error.message}
        </div>
      )}

      <div className="space-y-4">
        {contactRelationships.map((relationship) => {
          const relatedContact = allContacts.find(c => c.id === relationship.to_contact_id);
          if (!relatedContact) return null;

          return (
            <div
              key={relationship.id}
              onClick={() => navigate(`/contacts/${relatedContact.id}`)}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-accent-300 transition-colors duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-neutral-900">{relatedContact.name}</h3>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent-100 text-accent-800">
                    {relationship.type}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">{relatedContact.email}</p>
                {relationship.notes && (
                  <p className="text-sm text-neutral-500 mt-1">{relationship.notes}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {relatedContact.email && (
                  <a
                    href={`mailto:${relatedContact.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-full hover:bg-white text-accent-600 transition-colors duration-200"
                    title="Send Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveRelationship(relationship.id);
                  }}
                  className="p-1 rounded-full hover:bg-white text-coral-600 transition-colors duration-200"
                  title="Remove Relationship"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {contactRelationships.length === 0 && (
          <p className="text-center text-neutral-500 py-4">
            No relationships added yet
          </p>
        )}
      </div>

      <Dialog
        open={isAddingRelation}
        onClose={() => setIsAddingRelation(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
            <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-lg font-medium text-neutral-900">
                  Add Relationship
                </Dialog.Title>
                <button onClick={() => setIsAddingRelation(false)} className="text-neutral-400 hover:text-neutral-500">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddRelationship} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Search Contacts
                </label>
                <div className="relative">
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
              </div>

              <div className="max-h-60 overflow-y-auto border border-neutral-200 rounded-md">
                {filteredContacts.map((contact) => (
                  <label
                    key={contact.id}
                    className="flex items-center p-3 hover:bg-neutral-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="contact"
                      value={contact.id}
                      checked={selectedContact === contact.id}
                      onChange={(e) => setSelectedContact(e.target.value)}
                      className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-neutral-300"
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
                    No available contacts found
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Relationship Type
                </label>
                <select
                  value={relationType}
                  onChange={(e) => setRelationType(e.target.value as RelationType)}
                  className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                  required
                >
                  {relationTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                  placeholder="Add any notes about this relationship..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingRelation(false)}
                  disabled={loading}
                  className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedContact}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Relationship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}