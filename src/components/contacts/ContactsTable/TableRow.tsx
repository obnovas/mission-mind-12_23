import React from 'react';
import { Contact } from '../../../types';
import { formatDate } from '../../../utils/dates';
import { ArrowUpRight } from 'lucide-react';

interface TableRowProps {
  contact: Contact;
  onClick: () => void;
}

export function TableRow({ contact, onClick }: TableRowProps) {
  return (
    <tr 
      onClick={onClick}
      className="hover:bg-neutral-50 cursor-pointer transition-colors duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-neutral-900 truncate max-w-[250px]">
            {contact.name}
          </div>
          <ArrowUpRight className="h-4 w-4 ml-2 text-accent-500" />
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
            <div className="text-neutral-900">{contact.email}</div>
          )}
          {contact.phone && (
            <div className="text-neutral-500">{contact.phone}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {contact.next_contact_date ? (
          <span className="text-neutral-500">
            {formatDate(contact.next_contact_date)}
          </span>
        ) : (
          <span className="text-neutral-400 italic">
            Not scheduled
          </span>
        )}
      </td>
    </tr>
  );
}