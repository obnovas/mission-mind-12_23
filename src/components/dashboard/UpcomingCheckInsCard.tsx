import React from 'react';
import { Calendar, Settings, Mail, Phone } from 'lucide-react';
import { Contact } from '../../types';
import { formatDate } from '../../utils/dates';
import { useSettingsStore } from '../../store/settingsStore';

interface UpcomingCheckInsCardProps {
  contacts: Contact[];
  daysAhead: number;
  onDaysChange: (days: number) => void;
}

export function UpcomingCheckInsCard({ contacts, daysAhead, onDaysChange }: UpcomingCheckInsCardProps) {
  const { settings } = useSettingsStore();

  // Filter and sort upcoming contacts
  const upcomingContacts = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return contacts
      .filter(contact => {
        if (!contact.next_contact_date) return false;
        const nextDate = new Date(contact.next_contact_date);
        nextDate.setHours(0, 0, 0, 0);
        return nextDate >= today && nextDate <= futureDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.next_contact_date).getTime();
        const dateB = new Date(b.next_contact_date).getTime();
        return dateA - dateB;
      });
  }, [contacts, daysAhead]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-ocean-500 mr-2" />
          <h3 className="text-lg font-medium text-neutral-900">Upcoming {settings.checkInLabel}s</h3>
        </div>
        <div className="space-y-2">
          {upcomingContacts.map(contact => (
            <div 
              key={contact.id} 
              className="flex items-center justify-between p-3 bg-ocean-25 rounded-lg border border-ocean-200 hover:border-ocean-300 transition-colors duration-200"
            >
              <div>
                <p className="font-medium text-neutral-900">{contact.name}</p>
                <p className="text-sm text-neutral-600">
                  Due: {formatDate(contact.next_contact_date)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="p-1 rounded-full hover:bg-white/50 text-ocean-600 transition-colors duration-200"
                    title={`Email ${contact.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-1 rounded-full hover:bg-white/50 text-ocean-600 transition-colors duration-200"
                    title={`Call ${contact.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
          {upcomingContacts.length === 0 && (
            <p className="text-center text-neutral-500 py-4">No upcoming {settings.checkInLabel.toLowerCase()}s</p>
          )}
        </div>
      </div>
    </div>
  );
}