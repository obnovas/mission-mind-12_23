import React from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { Contact, CheckIn } from '../../types';
import { formatDate } from '../../utils/dates';
import { useSettingsStore } from '../../store/settingsStore';

interface ContactCheckInsProps {
  contact: Contact;
  checkIns: CheckIn[];
  onCheckIn: () => void;
  onEditCheckIn: (checkIn: CheckIn) => void;
}

export function ContactCheckIns({ contact, checkIns, onCheckIn, onEditCheckIn }: ContactCheckInsProps) {
  const { settings } = useSettingsStore();

  // Get the most recent completed check-in
  const lastCompletedCheckIn = checkIns
    .filter(ci => ci.status === 'Completed')
    .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())[0];

  // Get the next scheduled check-in
  const nextCheckIn = checkIns
    .filter(ci => ci.status === 'Scheduled' && new Date(ci.check_in_date) > new Date())
    .sort((a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime())[0];

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-accent-600 mr-2" />
          <h2 className="text-xl font-semibold text-neutral-900">{settings.checkInLabel}s</h2>
        </div>
        <button
          onClick={onCheckIn}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Add {settings.checkInLabel}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-accent-500 mr-2" />
            <h3 className="font-medium text-neutral-900">Completed {settings.checkInLabel}</h3>
          </div>
          <p className="text-neutral-600">
            {lastCompletedCheckIn ? formatDate(lastCompletedCheckIn.check_in_date) : 'None'}
          </p>
          {lastCompletedCheckIn?.check_in_notes && (
            <p className="mt-2 text-sm text-neutral-500">{lastCompletedCheckIn.check_in_notes}</p>
          )}
        </div>

        <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-accent-500 mr-2" />
            <h3 className="font-medium text-neutral-900">Next {settings.checkInLabel}</h3>
          </div>
          <p className="text-neutral-600">
            {nextCheckIn ? formatDate(nextCheckIn.check_in_date) : formatDate(contact.next_contact_date)}
          </p>
          {nextCheckIn?.check_in_notes && (
            <p className="mt-2 text-sm text-neutral-500">{nextCheckIn.check_in_notes}</p>
          )}
        </div>

        <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <RefreshCw className="h-5 w-5 text-accent-500 mr-2" />
            <h3 className="font-medium text-neutral-900">{settings.checkInLabel} Frequency</h3>
          </div>
          <p className="text-neutral-600">{contact.check_in_frequency}</p>
        </div>
      </div>

      {checkIns.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">History</h3>
          <div className="space-y-2">
            {checkIns
              .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())
              .map((checkIn) => (
                <button
                  key={checkIn.id}
                  onClick={() => onEditCheckIn(checkIn)}
                  className="w-full text-left p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-accent-300 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {formatDate(checkIn.check_in_date)}
                      </p>
                      {checkIn.check_in_notes && (
                        <p className="text-sm text-neutral-600 mt-1">{checkIn.check_in_notes}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      checkIn.status === 'Completed' ? 'bg-sage-100 text-sage-800' :
                      checkIn.status === 'Scheduled' ? 'bg-ocean-100 text-ocean-800' :
                      'bg-coral-100 text-coral-800'
                    }`}>
                      {checkIn.status}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}