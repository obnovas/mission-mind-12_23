import React from 'react';
import { History } from 'lucide-react';
import { Contact } from '../../types';
import { formatDate } from '../../utils/dates';
import { useSettingsStore } from '../../store/settingsStore';

interface RecentCheckInsProps {
  contacts: Contact[];
}

export function RecentCheckIns({ contacts }: RecentCheckInsProps) {
  const { settings } = useSettingsStore();

  // Get 5 most recently checked-in contacts
  const recentCheckIns = [...contacts]
    .sort((a, b) => new Date(b.last_contact_date).getTime() - new Date(a.last_contact_date).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center mb-4">
        <History className="h-5 w-5 text-sage-500 mr-2" />
        <h2 className="nested-card-heading">Recent {settings.checkInLabel}s</h2>
      </div>

      <div className="space-y-2">
        {recentCheckIns.map(contact => (
          <div
            key={contact.id}
            className="flex items-center justify-between p-3 bg-sage-50 rounded-lg border border-sage-200 hover:border-sage-300 transition-colors duration-200"
          >
            <div>
              <p className="font-medium text-neutral-900">{contact.name}</p>
              <p className="text-xs text-neutral-500">
                {settings.checkInLabel} completed {formatDate(contact.last_contact_date)}
              </p>
              {contact.notes && (
                <p className="text-sm text-neutral-600 mt-1">{contact.notes}</p>
              )}
            </div>
          </div>
        ))}
        {recentCheckIns.length === 0 && (
          <p className="text-center text-neutral-500 py-4">
            No recent {settings.checkInLabel.toLowerCase()}s
          </p>
        )}
      </div>
    </div>
  );
}