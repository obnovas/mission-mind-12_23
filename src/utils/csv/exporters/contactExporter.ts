import { Contact } from '../../../types';
import { formatContactData } from './formatters';

export function generateContactsCsv(contacts: Contact[]): string {
  const rows = contacts.map(contact => ({
    name: contact.name,
    type: contact.type,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    notes: contact.notes,
    check_in_frequency: contact.check_in_frequency,
  }));

  return formatContactData(rows);
}