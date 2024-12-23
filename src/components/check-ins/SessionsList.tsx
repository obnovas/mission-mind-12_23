import React from 'react';
import { Contact, CheckIn } from '../../types';
import { Clock, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { getNextMeeting, getMissedMeetings } from '../../utils/checkIn/nextMeeting';
import { getCheckInStyles } from '../../utils/checkIn/styles';
import { SessionStatusIcon } from './dialog/SessionStatusIcon';
import { formatDate } from '../../utils/dates';

interface SessionsListProps {
  contacts: Contact[];
  checkIns: CheckIn[];
  onCheckInSelect: (checkIn: CheckIn) => void;
}

export function SessionsList({ contacts, checkIns, onCheckInSelect }: SessionsListProps) {
  const { settings } = useSettingsStore();
  const label = settings.checkInLabel;

  // Get next meetings by type
  const { planned, suggested } = getNextMeeting(checkIns);
  
  // Get missed meetings
  const missedMeetings = getMissedMeetings(checkIns);

  const renderMeetingList = (meetings: CheckIn[], title: string, icon: typeof Clock) => {
    const Icon = icon;
    
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center mb-4">
          <Icon className="h-5 w-5 text-accent-600 mr-2" />
          <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        </div>
        <div className="space-y-3">
          {meetings.map(meeting => {
            const contact = contacts.find(c => c.id === meeting.contact_id);
            if (!contact) return null;

            const styles = getCheckInStyles(meeting.check_in_type, meeting.status);
            
            return (
              <button
                key={meeting.id}
                onClick={() => onCheckInSelect(meeting)}
                className={`w-full text-left p-4 rounded-lg border ${styles.bg} ${styles.border} ${styles.hover} transition-colors duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${styles.text}`}>{contact.name}</p>
                      <SessionStatusIcon 
                        status={meeting.status} 
                        type={meeting.check_in_type}
                      />
                    </div>
                    <p className="text-sm text-neutral-600">{formatDate(meeting.check_in_date)}</p>
                    {meeting.check_in_notes && (
                      <p className="text-sm text-neutral-500 mt-1">{meeting.check_in_notes}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {meetings.length === 0 && (
            <p className="text-center text-neutral-500 py-4">
              No {label.toLowerCase()}s to display
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderMeetingList(planned, `Upcoming Planned ${label}s`, Clock)}
      {renderMeetingList(suggested, `Upcoming Suggested ${label}s`, Clock)}
      {renderMeetingList(missedMeetings, `Missed ${label}s`, AlertCircle)}
    </div>
  );
}