import React from 'react';
import { Contact, CheckIn } from '../../types';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/dates';
import { useSettingsStore } from '../../store/settingsStore';
import { getCheckInTypeStyles } from '../../utils/checkIn/status';

interface CheckInListProps {
  checkIns: CheckIn[];
  contacts: Contact[];
  onStatusChange: (id: string, status: CheckIn['status']) => void;
}

export function CheckInList({ checkIns, contacts, onStatusChange }: CheckInListProps) {
  const { settings } = useSettingsStore();
  const label = settings.checkInLabel;

  // Get upcoming meetings
  const upcomingMeetings = checkIns
    .filter(ci => ci.status === 'Scheduled' && new Date(ci.check_in_date) > new Date())
    .sort((a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime())
    .slice(0, 5);

  const renderMeeting = (meeting: CheckIn) => {
    const contact = contacts.find(c => c.id === meeting.contact_id);
    if (!contact) return null;

    const styles = getCheckInTypeStyles(meeting.check_in_type);
    
    return (
      <div
        key={meeting.id}
        className={`p-3 rounded-lg border transition-colors duration-200 ${styles.bg} ${styles.border} ${styles.hover}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className={`${styles.text} text-neutral-900`}>{contact.name}</p>
            <p className="text-sm text-neutral-600">{formatDate(meeting.check_in_date)}</p>
            {meeting.check_in_notes && (
              <p className="text-sm text-neutral-500 mt-1">{meeting.check_in_notes}</p>
            )}
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            meeting.status === 'Completed' ? 'bg-sage-100 text-sage-800' :
            meeting.status === 'Scheduled' ? 'bg-ocean-100 text-ocean-800' :
            'bg-coral-100 text-coral-800'
          }`}>
            {meeting.status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-ocean-500 mr-2" />
          <h3 className="text-lg font-medium text-neutral-900">Upcoming {label}s</h3>
        </div>
        <div className="space-y-2">
          {upcomingMeetings.map(renderMeeting)}
          {upcomingMeetings.length === 0 && (
            <p className="text-center text-neutral-500 py-4">
              No upcoming {label.toLowerCase()}s
            </p>
          )}
        </div>
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
}