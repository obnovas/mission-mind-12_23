import { format } from 'date-fns';
import { NetworkGroup, Contact } from '../../../types';
import { formatGroupData } from './formatters';

export function generateGroupsCsv(groups: NetworkGroup[], contacts: Contact[]): string {
  // Map contacts to a lookup object for faster access
  const contactLookup = contacts.reduce((acc, contact) => {
    acc[contact.id] = contact;
    return acc;
  }, {} as Record<string, Contact>);

  // Transform groups into CSV rows
  const rows = groups.map(group => {
    const memberNames = group.members
      .map(memberId => contactLookup[memberId]?.name || '')
      .filter(Boolean)
      .join('; ');

    return {
      Name: group.name,
      Description: group.description || '',
      'Member Count': group.members.length,
      Members: memberNames,
      'Created Date': format(new Date(group.created_at), 'yyyy-MM-dd'),
      'Last Updated': format(new Date(group.updated_at), 'yyyy-MM-dd')
    };
  });

  return formatGroupData(rows);
}