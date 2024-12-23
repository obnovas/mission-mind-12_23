import React from 'react';
import { Dialog } from '@headlessui/react';
import { Star, Plus, X, Search } from 'lucide-react';
import { Contact } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../../store/favoritesStore';

interface FavoriteContactsProps {
  contacts: Contact[];
}

export function FavoriteContacts({ contacts }: FavoriteContactsProps) {
  const navigate = useNavigate();
  const [isSelectingContact, setIsSelectingContact] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { items: favoriteIds, loading, error, fetch, add, remove } = useFavoritesStore();

  React.useEffect(() => {
    fetch();
  }, []);

  // Filter contacts to only show favorites
  const favoriteContacts = contacts.filter(contact => 
    favoriteIds.includes(contact.id)
  );

  // Filter available contacts (not already favorites)
  const availableContacts = contacts.filter(contact =>
    !favoriteIds.includes(contact.id) &&
    (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddFavorite = async (contactId: string) => {
    try {
      await add(contactId);
    } catch (err) {
      console.error('Error adding favorite:', err);
    }
  };

  const handleRemoveFavorite = async (contactId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click when removing
    try {
      await remove(contactId);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading favorites: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="h-5 w-5 text-honey-500 mr-2" />
          <h2 className="card-heading">Favorites</h2>
        </div>
        <button
          onClick={() => setIsSelectingContact(true)}
          className="p-1 rounded-full hover:bg-honey-50 text-honey-600 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1">
        {favoriteContacts.map((contact, index) => (
          <div
            key={contact.id}
            onClick={() => navigate(`/contacts/${contact.id}`)}
            className={`flex items-center justify-between p-3 rounded-lg border border-honey-200 hover:border-honey-300 transition-colors duration-200 cursor-pointer ${
              index % 2 === 0 ? 'bg-honey-25' : 'bg-white'
            }`}
          >
            <div>
              <p className="font-medium text-neutral-900">{contact.name}</p>
              <p className="text-sm text-neutral-500">{contact.email}</p>
            </div>
            <button
              onClick={(e) => handleRemoveFavorite(contact.id, e)}
              className="p-1 rounded-full hover:bg-honey-50 text-honey-600 transition-colors duration-200"
              title="Remove from favorites"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {favoriteContacts.length === 0 && (
          <p className="text-center text-neutral-500 py-4">
            No favorite contacts yet
          </p>
        )}
      </div>

      <Dialog
        open={isSelectingContact}
        onClose={() => setIsSelectingContact(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Add Favorite Contacts
            </Dialog.Title>

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

            <div className="space-y-1 max-h-96 overflow-y-auto">
              {availableContacts.map((contact, index) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    handleAddFavorite(contact.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-honey-300 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-neutral-25' : 'bg-white'
                  }`}
                >
                  <p className="font-medium text-neutral-900">{contact.name}</p>
                  <p className="text-sm text-neutral-500">{contact.email}</p>
                </button>
              ))}
              {availableContacts.length === 0 && (
                <p className="text-center text-neutral-500 py-4">
                  No more contacts available to add as favorites
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSelectingContact(false)}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}