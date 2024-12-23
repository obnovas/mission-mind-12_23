import { Contact } from '../../types';

export function validateContact(contact: Partial<Contact>): string | null {
  if (!contact.name?.trim()) {
    return 'Name is required';
  }

  if (!contact.type) {
    return 'Contact type is required';
  }

  if (!contact.check_in_frequency) {
    return 'Check-in frequency is required';
  }

  if (contact.email && !contact.email.includes('@')) {
    return 'Invalid email format';
  }

  return null;
}