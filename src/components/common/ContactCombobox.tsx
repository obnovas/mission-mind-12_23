import React from 'react';
import { Dialog } from '@headlessui/react';
import { Search, X } from 'lucide-react';
import { Contact } from '../../types';

interface ContactComboboxProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (contact: Contact) => void;
  contacts: Contact[];
  title: string;
}

export function ContactCombobox({ isOpen, onClose, onSelect, contacts, title }: ContactComboboxProps) {
  const [query, setQuery] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const filteredContacts = React.useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase())
    );
  }, [contacts, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredContacts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredContacts[highlightedIndex]) {
          onSelect(filteredContacts[highlightedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                {title}
              </Dialog.Title>
              <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                placeholder="Search contacts..."
                autoFocus
              />
            </div>

            <div className="mt-2 max-h-96 overflow-y-auto">
              {filteredContacts.map((contact, index) => (
                <button
                  key={contact.id}
                  onClick={() => onSelect(contact)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    index === highlightedIndex
                      ? 'bg-ocean-50 border border-ocean-200'
                      : 'hover:bg-neutral-50 border border-transparent'
                  }`}
                >
                  <p className="font-medium text-neutral-900">{contact.name}</p>
                  <p className="text-sm text-neutral-500">{contact.email}</p>
                </button>
              ))}
              {filteredContacts.length === 0 && (
                <p className="text-center text-neutral-500 py-4">
                  No contacts found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}