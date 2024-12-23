import { PrayerRequest, Contact } from '../../../types';
import { format } from 'date-fns';
import { formatPrayerData } from './formatters';

export function generatePrayersCsv(prayers: PrayerRequest[], contacts: Contact[]): string {
  const rows = prayers.map(prayer => ({
    contact: contacts.find(c => c.id === prayer.contact_id)?.name || '',
    request: prayer.request,
    status: prayer.status,
    answer_notes: prayer.answer_notes || '',
    created_at: format(new Date(prayer.created_at), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(prayer.updated_at), 'yyyy-MM-dd HH:mm:ss'),
  }));

  return formatPrayerData(rows);
}