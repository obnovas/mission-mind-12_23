import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, parseISO } from 'date-fns';
import { Contact, CheckIn } from '../../types';
import { useSettingsStore } from '../../store/settingsStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getCheckInStyles } from '../../utils/checkIn/styles';
import { SessionStatusIcon } from './dialog/SessionStatusIcon';

interface CheckInCalendarProps {
  checkIns: CheckIn[];
  contacts: Contact[];
  onCheckInSelect: (checkIn: CheckIn) => void;
}

export function CheckInCalendar({ checkIns, contacts, onCheckInSelect }: CheckInCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const { settings } = useSettingsStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get check-ins for a specific day
  const getDayCheckIns = (date: Date) => {
    return checkIns
      .filter(checkIn => {
        try {
          const checkInDate = parseISO(checkIn.check_in_date);
          return isSameDay(checkInDate, date);
        } catch (err) {
          console.error('Invalid date:', checkIn.check_in_date);
          return false;
        }
      })
      .sort((a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime());
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-600" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 text-sm text-accent-600 hover:text-accent-700"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200"
            >
              <ArrowRight className="h-5 w-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-neutral-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-neutral-50 py-2 text-center text-sm font-medium text-neutral-700">
            {day}
          </div>
        ))}

        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-start-${index}`} className="bg-white h-32" />
        ))}

        {days.map(day => {
          const dayCheckIns = getDayCheckIns(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          
          return (
            <div
              key={day.toISOString()}
              className={`bg-white h-32 p-2 ${
                isToday(day) ? 'ring-2 ring-accent-500 ring-inset' : ''
              }`}
            >
              <div className={`text-sm font-medium ${
                isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                {dayCheckIns.map(checkIn => {
                  const contact = contacts.find(c => c.id === checkIn.contact_id);
                  if (!contact) return null;
                  
                  const styles = getCheckInStyles(checkIn.check_in_type, checkIn.status);
                  
                  return (
                    <button
                      key={checkIn.id}
                      onClick={() => onCheckInSelect(checkIn)}
                      className={`w-full text-left text-xs p-1 rounded ${styles.bg} ${styles.border} ${styles.hover} transition-colors duration-200`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className={`font-medium ${styles.text}`}>{contact.name}</span>
                            <SessionStatusIcon 
                              status={checkIn.status} 
                              type={checkIn.check_in_type}
                              size={12}
                            />
                          </div>
                          <div className="text-neutral-600">
                            {format(parseISO(checkIn.check_in_date), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                      {checkIn.check_in_notes && (
                        <div className="text-neutral-500 truncate mt-0.5">
                          {checkIn.check_in_notes}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
          <div key={`empty-end-${index}`} className="bg-white h-32" />
        ))}
      </div>
    </div>
  );
}