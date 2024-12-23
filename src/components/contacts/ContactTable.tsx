import React from 'react';
import { Contact } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { formatDate } from '../../utils/dates';
import { useSettingsStore } from '../../store/settingsStore';
import { useTableControls } from '../../hooks/useTableControls';
import { TableHeader } from './TableHeader';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactTable({ contacts, onEdit, onDelete }: ContactTableProps) {
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const { 
    items: sortedContacts, 
    sortConfig, 
    handleSort, 
    handleFilter 
  } = useTableControls(contacts);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <TableHeader<Contact>
                field="name"
                label="Name"
                sortConfig={sortConfig}
                onSort={handleSort}
                onFilter={handleFilter}
                className="w-[300px]"
              />
              <TableHeader<Contact>
                field="type"
                label="Type"
                sortConfig={sortConfig}
                onSort={handleSort}
                onFilter={handleFilter}
                className="w-[150px]"
              />
              <TableHeader<Contact>
                field="email"
                label="Contact Info"
                sortConfig={sortConfig}
                onSort={handleSort}
                onFilter={handleFilter}
                className="w-[300px]"
              />
              <TableHeader<Contact>
                field="next_contact_date"
                label={`Next ${settings.checkInLabel}`}
                sortConfig={sortConfig}
                onSort={handleSort}
                onFilter={handleFilter}
                className="w-[200px]"
              />
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider w-[150px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {sortedContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-neutral-900 truncate max-w-[250px]">
                      {contact.name}
                    </div>
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
                  <div className="text-sm">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="text-neutral-900 hover:text-accent-600">
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
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-accent-600 hover:text-accent-700"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-accent-600 hover:text-accent-700"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEdit(contact)}
                      className="text-accent-600 hover:text-accent-700"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(contact)}
                      className="text-coral-600 hover:text-coral-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}