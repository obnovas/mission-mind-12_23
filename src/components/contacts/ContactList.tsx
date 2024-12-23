import React from 'react';
import { Contact } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../../utils/dates';
import { useSettingsStore } from '../../store/settingsStore';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
  const navigate = useNavigate();
  const { settings } = useSettingsStore();

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {/* Mobile View */}
      <div className="block lg:hidden">
        {contacts.map((contact, index) => (
          <div
            key={contact.id}
            className={`p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-neutral-900">{contact.name}</h3>
                <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                  contact.type === 'Individual' ? 'bg-ocean-100 text-ocean-800' :
                  contact.type === 'Organization' ? 'bg-sage-100 text-sage-800' :
                  'bg-coral-100 text-coral-800'
                }`}>
                  {contact.type}
                </span>
              </div>
              <button
                onClick={() => navigate(`/contacts/${contact.id}`)}
                className="text-accent-600 hover:text-accent-700"
              >
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-neutral-600">
              {contact.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${contact.email}`} className="hover:text-accent-600">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${contact.phone}`} className="hover:text-accent-600">
                    {contact.phone}
                  </a>
                </div>
              )}
              <div className="text-xs text-neutral-500">
                Next {settings.checkInLabel}: {formatDate(contact.next_contact_date)}
              </div>
            </div>

            <div className="mt-3 flex justify-end space-x-2">
              <button
                onClick={() => onEdit(contact)}
                className="p-2 text-accent-600 hover:text-accent-700 hover:bg-accent-50 rounded-full"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(contact)}
                className="p-2 text-coral-600 hover:text-coral-700 hover:bg-coral-50 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="p-4 text-center text-neutral-500">
            No contacts found
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Next {settings.checkInLabel}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-neutral-900">{contact.name}</div>
                    <button
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                      className="ml-2 text-accent-600 hover:text-accent-700"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    contact.type === 'Individual' ? 'bg-ocean-100 text-ocean-800' :
                    contact.type === 'Organization' ? 'bg-sage-100 text-sage-800' :
                    'bg-coral-100 text-coral-800'
                  }`}>
                    {contact.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="hover:text-accent-600">
                        {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <div className="text-neutral-500">
                        {contact.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {formatDate(contact.next_contact_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(contact)}
                      className="text-accent-600 hover:text-accent-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(contact)}
                      className="text-coral-600 hover:text-coral-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <div className="p-4 text-center text-neutral-500">
            No contacts found
          </div>
        )}
      </div>
    </div>
  );
}