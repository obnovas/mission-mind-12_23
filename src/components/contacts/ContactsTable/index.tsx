import React from 'react';
import { Contact } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { useTableControls } from '../../../hooks/useTableControls';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TableSearch } from './TableSearch';
import { TableFilters } from './TableFilters';
import { useSettingsStore } from '../../../store/settingsStore';

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);

  const { 
    items: sortedContacts, 
    sortConfig, 
    handleSort 
  } = useTableControls(contacts);

  // Filter contacts based on search and type filters
  const filteredContacts = React.useMemo(() => {
    return sortedContacts.filter(contact => {
      const matchesSearch = searchQuery.toLowerCase().split(' ').every(term =>
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.phone?.toLowerCase().includes(term) ||
        contact.type.toLowerCase().includes(term)
      );

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(contact.type);

      return matchesSearch && matchesType;
    });
  }, [sortedContacts, searchQuery, selectedTypes]);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <TableSearch 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex-shrink-0">
            <TableFilters
              selectedTypes={selectedTypes}
              onTypeChange={setSelectedTypes}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <TableHeader
                field="name"
                label="Name"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="w-[300px]"
              />
              <TableHeader
                field="type"
                label="Type"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="w-[150px]"
              />
              <TableHeader
                field="email"
                label="Contact Info"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="w-[300px]"
              />
              <TableHeader
                field="next_contact_date"
                label={`Next ${settings.checkInLabel}`}
                sortConfig={sortConfig}
                onSort={handleSort}
                className="w-[200px]"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {filteredContacts.map((contact) => (
              <TableRow
                key={contact.id}
                contact={contact}
                onClick={() => navigate(`/contacts/${contact.id}`)}
              />
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                  No contacts found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 border-t border-neutral-200">
        <p className="text-sm text-neutral-500">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </p>
      </div>
    </div>
  );
}