import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Contact, CheckIn } from '../../types';
import { formatDate } from '../../utils/dates';
import { useSettingsStore } from '../../store/settingsStore';
import { getCheckInStyles, getStatusBadgeClasses } from '../../utils/checkIn/styles';
import { CheckInTypeIndicator } from '../check-ins/dialog/CheckInTypeIndicator';

interface ContactMeetingsProps {
  contact: Contact;
  checkIns: CheckIn[];
  onAddMeeting: () => void;
  onEditMeeting: (checkIn: CheckIn) => void;
}

export function ContactMeetings({ contact, checkIns, onAddMeeting, onEditMeeting }: ContactMeetingsProps) {
  const { settings } = useSettingsStore();
  const label = settings.checkInLabel;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-ocean-500 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-ocean-600 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">{label}s</h2>
          </div>
          <button
            onClick={onAddMeeting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
          >
            Add {label}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Last Completed Meeting */}
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-sage-500 mr-2" />
              <h3 className="font-medium text-neutral-900">Last {label}</h3>
            </div>
            <p className="text-neutral-600">{formatDate(contact.last_contact_date)}</p>
          </div>

          {/* Next Meeting */}
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-ocean-500 mr-2" />
              <h3 className="font-medium text-neutral-900">Next {label}</h3>
            </div>
            <p className="text-neutral-600">{formatDate(contact.next_contact_date)}</p>
          </div>

          {/* Frequency */}
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-coral-500 mr-2" />
              <h3 className="font-medium text-neutral-900">{label} Frequency</h3>
            </div>
            <p className="text-neutral-600">{contact.check_in_frequency}</p>
          </div>
        </div>

        {/* Meeting History */}
        {checkIns.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">History</h3>
            <div className="space-y-2">
              {checkIns
                .sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())
                .map((checkIn) => {
                  const styles = getCheckInStyles(checkIn.check_in_type, checkIn.status);
                  
                  return (
                    <button
                      key={checkIn.id}
                      onClick={() => onEditMeeting(checkIn)}
                      className={`w-full text-left p-4 rounded-lg border ${styles.bg} ${styles.border} ${styles.hover} transition-colors duration-200`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${styles.text}`}>
                              {formatDate(checkIn.check_in_date)}
                            </p>
                            <CheckInTypeIndicator type={checkIn.check_in_type} />
                          </div>
                          {checkIn.check_in_notes && (
                            <p className="text-sm text-neutral-600 mt-1">{checkIn.check_in_notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(checkIn.status)}`}>
                          {checkIn.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}