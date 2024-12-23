import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { Contact } from '../../types';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dates';

interface RecentContactsProps {
  contacts: Contact[];
}

export function RecentContacts({ contacts }: RecentContactsProps) {
  const navigate = useNavigate();
  
  // Get 5 most recently added contacts
  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-sage-500 mr-2" />
        <h2 className="nested-card-heading">Recently Added</h2>
      </div>

      <div className="space-y-2">
        {recentContacts.map(contact => (
          <div
            key={contact.id}
            className="flex items-center justify-between p-3 bg-sage-50 rounded-lg border border-sage-200 hover:border-sage-300 transition-colors duration-200"
          >
            <div>
              <p className="font-medium text-neutral-900">{contact.name}</p>
              <p className="text-xs text-neutral-500">
                Added {formatDate(contact.created_at)}
              </p>
            </div>
            <button
              onClick={() => navigate(`/contacts/${contact.id}`)}
              className="p-1 rounded-full hover:bg-white/50 text-sage-600 transition-colors duration-200"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        ))}
        {recentContacts.length === 0 && (
          <p className="text-center text-neutral-500 py-4">
            No contacts added yet
          </p>
        )}
      </div>
    </div>
  );
}