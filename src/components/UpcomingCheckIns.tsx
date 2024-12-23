import React from 'react';
import { Calendar } from 'lucide-react';
import { Contact } from '../types';
import { format } from 'date-fns';

interface UpcomingCheckInsProps {
  contacts: Contact[];
}

export function UpcomingCheckIns({ contacts }: UpcomingCheckInsProps) {
  const upcomingContacts = contacts
    .filter(contact => {
      const nextDate = new Date(contact.nextContactDate);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return nextDate >= today && nextDate <= weekFromNow;
    })
    .sort((a, b) => new Date(a.nextContactDate).getTime() - new Date(b.nextContactDate).getTime());

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Check-ins</h3>
        <Calendar className="w-5 h-5 text-accent-600" />
      </div>
      <div className="space-y-4">
        {upcomingContacts.map(contact => (
          <div 
            key={contact.id} 
            className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-accent-200 transition-colors duration-200"
          >
            <div>
              <h4 className="font-medium text-gray-900">{contact.name}</h4>
              <p className="text-sm text-gray-600">
                Due: {format(new Date(contact.nextContactDate), 'MMM d, yyyy')}
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium text-accent-600 bg-accent-50 rounded-full border border-accent-200">
              {contact.checkInFrequency}
            </span>
          </div>
        ))}
        {upcomingContacts.length === 0 && (
          <p className="text-center text-gray-500 py-4">No upcoming check-ins this week</p>
        )}
      </div>
    </div>
  );
}