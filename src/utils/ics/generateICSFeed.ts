import { CheckIn, Contact } from '../../types';
import { format } from 'date-fns';
import { useSettingsStore } from '../../store/settingsStore';

interface ICSEvent {
  start: string;
  end: string;
  summary: string;
  description?: string;
  location?: string;
  status: string;
}

export function generateICSFeed(checkIns: CheckIn[], contacts: Contact[]): string {
  const { settings } = useSettingsStore.getState();
  const events = checkIns.map(checkIn => {
    const contact = contacts.find(c => c.id === checkIn.contact_id);
    const date = new Date(checkIn.check_in_date);
    const endDate = new Date(date.getTime() + 60 * 60 * 1000); // 1 hour duration

    const event: ICSEvent = {
      start: format(date, "yyyyMMdd'T'HHmmss"),
      end: format(endDate, "yyyyMMdd'T'HHmmss"),
      summary: `${settings.checkInLabel}: ${contact?.name || 'Unknown Contact'}`,
      description: checkIn.check_in_notes || undefined,
      location: contact?.address,
      status: checkIn.status.toUpperCase(),
    };

    return event;
  });

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MissionMind//Contact Check-ins//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:MissionMind',
    `X-WR-TIMEZONE:${settings.timezone}`,
    ...events.map(event => [
      'BEGIN:VEVENT',
      `DTSTART;TZID=${settings.timezone}:${event.start}`,
      `DTEND;TZID=${settings.timezone}:${event.end}`,
      `SUMMARY:${event.summary}`,
      event.description && `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      event.location && `LOCATION:${event.location}`,
      `STATUS:${event.status}`,
      'END:VEVENT'
    ].filter(Boolean)).flat(),
    'END:VCALENDAR'
  ].join('\r\n');

  return ics;
}

export function downloadICSFeed(checkIns: CheckIn[], contacts: Contact[]) {
  const icsContent = generateICSFeed(checkIns, contacts);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'missionmind-checkins.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}