import React from 'react';
import { Dialog } from '@headlessui/react';
import { Search, X, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContactStore } from '../../store/contactStore';
import { Contact } from '../../types';

export function QuickContactSearch() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const navigate = useNavigate();
  const contacts = useContactStore((state) => state.items);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Filter contacts based on search query
  const filteredContacts = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return contacts.filter((contact) => {
      const searchableFields = [
        contact.name,
        contact.email,
        contact.phone,
        contact.type,
        ...(contact.journeys?.map(j => j.journey_name) || []),
      ].filter(Boolean).join(' ').toLowerCase();
      return searchableFields.includes(query);
    }).slice(0, 5); // Limit to 5 results for performance
  }, [contacts, searchQuery]);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setSelectedContact(null);
    }
  }, [isOpen]);

  const handleContactClick = (contact: Contact) => {
    navigate(`/contacts/${contact.id}`);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-honey-300 transition-colors duration-200 group"
      >
        <div className="w-12 h-12 rounded-full bg-honey-50 flex items-center justify-center mb-2 group-hover:bg-honey-100 transition-colors duration-200">
          <Search className="h-6 w-6 text-honey-600" />
        </div>
        <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Quick Search</span>
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-start justify-center min-h-screen pt-16 px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />

          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl">
            {/* Title Bar */}
            <div className="bg-honey-50 rounded-t-xl border-b border-neutral-200 p-6">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-xl font-semibold text-neutral-900">
                  Quick Search
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-neutral-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-none focus:ring-2 focus:ring-honey-500 rounded-lg"
                  placeholder="Search contacts by name, email, phone, or journey..."
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredContacts.length > 0 ? (
                <div className="py-2">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleContactClick(contact)}
                      className="w-full px-4 py-3 hover:bg-neutral-50 text-left flex items-start justify-between group"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <span className="font-medium text-neutral-900">{contact.name}</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            contact.type === 'Individual' ? 'bg-ocean-100 text-ocean-800' :
                            contact.type === 'Organization' ? 'bg-sage-100 text-sage-800' :
                            'bg-coral-100 text-coral-800'
                          }`}>
                            {contact.type}
                          </span>
                        </div>
                        
                        <div className="mt-1 space-y-1">
                          {contact.email && (
                            <div className="flex items-center text-sm text-neutral-500">
                              <Mail className="h-4 w-4 mr-1" />
                              {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center text-sm text-neutral-500">
                              <Phone className="h-4 w-4 mr-1" />
                              {contact.phone}
                            </div>
                          )}
                          {contact.address && (
                            <div className="flex items-center text-sm text-neutral-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {contact.address}
                            </div>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-neutral-400 group-hover:text-honey-500 mt-1 ml-4" />
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="px-4 py-8 text-center text-neutral-500">
                  No contacts found matching "{searchQuery}"
                </div>
              ) : null}
            </div>

            {/* Quick Tips */}
            <div className="px-4 py-3 bg-neutral-50 text-xs text-neutral-500 border-t border-neutral-200 rounded-b-xl">
              <div className="flex items-center justify-center space-x-4">
                <span>Press <kbd className="px-1.5 py-0.5 font-mono bg-white rounded border border-neutral-200">↑</kbd> <kbd className="px-1.5 py-0.5 font-mono bg-white rounded border border-neutral-200">↓</kbd> to navigate</span>
                <span>Press <kbd className="px-1.5 py-0.5 font-mono bg-white rounded border border-neutral-200">Enter</kbd> to select</span>
                <span>Press <kbd className="px-1.5 py-0.5 font-mono bg-white rounded border border-neutral-200">Esc</kbd> to close</span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}