import { format } from 'date-fns';
import { Contact, PrayerRequest, Journey, NetworkGroup } from '../../types';
import Papa from 'papaparse';

export function generateContactsCsv(contacts: Contact[]): string {
  const data = contacts.map(contact => ({
    name: contact.name,
    type: contact.type,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    notes: contact.notes,
    check_in_frequency: contact.check_in_frequency,
  }));

  return Papa.unparse(data);
}

export function generatePrayersCsv(prayers: PrayerRequest[], contacts: Contact[]): string {
  const data = prayers.map(prayer => ({
    contact: contacts.find(c => c.id === prayer.contact_id)?.name || '',
    request: prayer.request,
    status: prayer.status,
    answer_notes: prayer.answer_notes || '',
    created_at: format(new Date(prayer.created_at), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(prayer.updated_at), 'yyyy-MM-dd HH:mm:ss'),
  }));

  return Papa.unparse(data);
}

export function generateJourneysCsv(journeys: Journey[]): string {
  const data = journeys.map(journey => ({
    name: journey.name,
    description: journey.description,
    stages: journey.stages.join(';'),
    created_at: format(new Date(journey.created_at), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(journey.updated_at), 'yyyy-MM-dd HH:mm:ss'),
  }));

  return Papa.unparse(data);
}

export function generateGroupsCsv(groups: NetworkGroup[], contacts: Contact[]): string {
  const data = groups.map(group => ({
    name: group.name,
    description: group.description || '',
    members: group.members
      .map(memberId => contacts.find(c => c.id === memberId)?.name || '')
      .join(';'),
    created_at: format(new Date(group.created_at), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(group.updated_at), 'yyyy-MM-dd HH:mm:ss'),
  }));

  return Papa.unparse(data);
}

export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const contactTemplate = `name,type,email,phone,address,notes,check_in_frequency
"John Smith","Individual","john@example.com","555-0123","123 Main St","Regular attendee","Weekly"`;