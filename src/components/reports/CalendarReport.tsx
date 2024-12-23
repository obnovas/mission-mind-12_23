import React from 'react';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { CheckIn, Contact } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { useSettingsStore } from '../../store/settingsStore';
import { getCheckInStyles } from '../../utils/checkIn/styles';
import { SessionStatusIcon } from '../check-ins/dialog/SessionStatusIcon';

interface CalendarReportProps {
  checkIns: CheckIn[];
  contacts: Contact[];
  month?: Date;
}

export function CalendarReport({ checkIns, contacts, month = new Date() }: CalendarReportProps) {
  const { settings } = useSettingsStore();
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group check-ins by date
  const checkInsByDate = days.map(day => {
    const dayCheckIns = checkIns.filter(ci => 
      isSameDay(new Date(ci.check_in_date), day)
    );

    return {
      date: day,
      checkIns: dayCheckIns.map(ci => ({
        ...ci,
        contact: contacts.find(c => c.id === ci.contact_id)
      }))
    };
  });

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-lavender-500 overflow-hidden">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-lavender-600 mr-2" />
            <h2 className="text-xl font-semibold text-neutral-900">
              {format(month, 'MMMM yyyy')} {settings.checkInLabel}s
            </h2>
          </div>
        </div>
      </div>

      <div className="divide-y divide-neutral-200">
        {checkInsByDate.map(({ date, checkIns }) => (
          <div key={date.toISOString()} className="p-4 hover:bg-neutral-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-neutral-900">
                {format(date, 'EEEE, MMMM d')}
              </h3>
              <span className="text-sm text-neutral-500">
                {checkIns.length} {settings.checkInLabel.toLowerCase()}{checkIns.length !== 1 ? 's' : ''}
              </span>
            </div>

            {checkIns.length > 0 ? (
              <div className="space-y-3">
                {checkIns.map(({ contact, check_in_date, status, check_in_notes, check_in_type }) => {
                  if (!contact) return null;
                  
                  const styles = getCheckInStyles(check_in_type, status);
                  
                  return (
                    <div 
                      key={`${contact?.id}-${check_in_date}`}
                      className={`p-3 rounded-lg border ${styles.bg} ${styles.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-neutral-500" />
                            <span className="font-medium text-neutral-900">
                              {contact?.name || 'Unknown Contact'}
                            </span>
                            <SessionStatusIcon 
                              status={status} 
                              type={check_in_type}
                              size={16}
                            />
                          </div>
                          {check_in_notes && (
                            <p className="mt-1 text-sm text-neutral-600">
                              {check_in_notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center ml-4">
                          <Clock className="h-4 w-4 text-neutral-400 mr-1" />
                          <span className="text-sm text-neutral-500">
                            {format(new Date(check_in_date), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 italic">
                No {settings.checkInLabel.toLowerCase()}s scheduled
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}