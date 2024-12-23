import React from 'react';
import { Contact } from '../../../../types';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { formatDate } from '../../../../utils/dates';
import { useSettingsStore } from '../../../../store/settingsStore';

interface ContactDetailsProps {
  contact: Contact;
}

export function ContactDetails({ contact }: ContactDetailsProps) {
  const { settings } = useSettingsStore();
  
  return (
    <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
      <h3 className="font-medium text-lg text-neutral-900 mb-4">Contact Details</h3>
      <div className="space-y-3">
        {contact.email && (
          <div className="flex items-center text-sm text-neutral-600">
            <Mail className="h-4 w-4 text-accent-500 mr-2" />
            <a href={`mailto:${contact.email}`} className="hover:text-accent-600">
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center text-sm text-neutral-600">
            <Phone className="h-4 w-4 text-accent-500 mr-2" />
            <a href={`tel:${contact.phone}`} className="hover:text-accent-600">
              {contact.phone}
            </a>
          </div>
        )}
        {contact.address && (
          <div className="flex items-center text-sm text-neutral-600">
            <MapPin className="h-4 w-4 text-accent-500 mr-2" />
            <span>{contact.address}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-neutral-600">
          <Calendar className="h-4 w-4 text-accent-500 mr-2" />
          <div>
            <div>Last {settings.checkInLabel.toLowerCase()}: {formatDate(contact.last_contact_date)}</div>
            <div>Next scheduled: {formatDate(contact.next_contact_date)}</div>
            <div>Frequency: {contact.check_in_frequency}</div>
          </div>
        </div>
      </div>
    </div>
  );
}