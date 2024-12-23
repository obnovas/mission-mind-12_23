import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Contact, CheckIn, CheckInType } from '../../types';
import { formatDate } from '../../utils/dates';
import { useSettingsStore } from '../../store/settingsStore';
import { getNextMeeting, getMissedMeetings } from '../../utils/checkIn/nextMeeting';
import { getCheckInStyles } from '../../utils/checkIn/styles';
import { CheckInTypeIndicator } from '../check-ins/dialog/CheckInTypeIndicator';
import { SessionTypeFilter } from './SessionTypeFilter';

interface DashboardMeetingsCardProps {
  contacts: Contact[];
  checkIns: CheckIn[];
  onCheckInSelect: (checkIn: CheckIn) => void;
}

export function DashboardMeetingsCard({ contacts, checkIns, onCheckInSelect }: DashboardMeetingsCardProps) {
  const { settings } = useSettingsStore();
  const label = settings.checkInLabel;
  const [selectedTypes, setSelectedTypes] = React.useState<CheckInType[]>(['planned', 'suggested']);

  // Get next meetings by type (already sorted and limited in utility function)
  const { planned, suggested } = getNextMeeting(checkIns);
  
  // Get missed meetings (already sorted and limited in utility function)
  const missedMeetings = getMissedMeetings(checkIns);

  const renderMeetings = (meetings: CheckIn[], showEmpty = true) => {
    if (meetings.length === 0 && showEmpty) {
      return (
        <p className="text-center text-neutral-500 py-4">
          No upcoming {label.toLowerCase()}s
        </p>
      );
    }

    return meetings
      .filter(meeting => selectedTypes.includes(meeting.check_in_type))
      .map(meeting => {
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
                  <CheckInTypeIndicator type={meeting.check_in_type} />
                </div>
                <p className="text-sm text-neutral-600">{formatDate(meeting.check_in_date)}</p>
                {meeting.check_in_notes && (
                  <p className="text-sm text-neutral-500 mt-1">{meeting.check_in_notes}</p>
                )}
              </div>
            </div>
          </button>
        );
      });
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-ocean-500 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-ocean-600 mr-2" />
            <h2 className="text-xl font-roboto font-semibold text-neutral-900">{label}s</h2>
          </div>
        </div>

        <div className="space-y-6">
          {/* Next Meetings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                <Clock className="h-4 w-4 text-ocean-500 mr-2" />
                Next {label}s
              </h3>
              <SessionTypeFilter
                selectedTypes={selectedTypes}
                onChange={setSelectedTypes}
              />
            </div>
            <div className="space-y-3">
              {renderMeetings([...planned, ...suggested].sort((a, b) => 
                new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime()
              ))}
            </div>
          </div>

          {/* Missed Meetings */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center">
              <AlertCircle className="h-4 w-4 text-coral-500 mr-2" />
              Missed {label}s
            </h3>
            <div className="space-y-3">
              {renderMeetings(missedMeetings, false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}