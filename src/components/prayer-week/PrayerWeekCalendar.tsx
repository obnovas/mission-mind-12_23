import React from 'react';
import { startOfWeek, endOfWeek, format, addWeeks } from 'date-fns';
import { Contact } from '../../types';
import { useSettingsStore } from '../../store/settingsStore';

interface PrayerWeekCalendarProps {
  contacts: Contact[];
  onWeekChange: (contactId: string, week: number) => void;
}

export function PrayerWeekCalendar({ contacts, onWeekChange }: PrayerWeekCalendarProps) {
  const [view, setView] = React.useState<'current' | 'month' | 'year'>('current');
  const { settings } = useSettingsStore();

  // Get current week number
  const currentWeek = React.useMemo(() => {
    const now = new Date();
    return Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  }, []);

  // Get week date ranges for the entire year
  const weekRanges = React.useMemo(() => {
    const ranges = [];
    let currentDate = new Date(new Date().getFullYear(), 0, 1);
    
    for (let week = 1; week <= 52; week++) {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      ranges.push({
        week,
        dateRange: `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`,
        start,
        end,
      });
      currentDate = addWeeks(currentDate, 1);
    }
    return ranges;
  }, []);

  // Filter weeks based on view
  const visibleWeeks = React.useMemo(() => {
    if (view === 'current') {
      return weekRanges.filter(w => Math.abs(w.week - currentWeek) <= 2);
    }
    if (view === 'month') {
      return weekRanges.filter(w => Math.abs(w.week - currentWeek) <= 6);
    }
    return weekRanges;
  }, [view, currentWeek, weekRanges]);

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setView('current')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === 'current' 
                ? 'bg-accent-100 text-accent-700' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Current Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === 'month' 
                ? 'bg-accent-100 text-accent-700' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setView('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              view === 'year' 
                ? 'bg-accent-100 text-accent-700' 
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Full Year
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleWeeks.map(({ week, dateRange }) => (
          <div 
            key={week}
            className={`bg-white rounded-lg border border-neutral-200 overflow-hidden ${
              week === currentWeek ? 'ring-2 ring-accent-500' : ''
            }`}
          >
            <div className="bg-neutral-50 border-b border-neutral-200 p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-neutral-900">Week {week}</h3>
                <span className="text-sm text-neutral-500">{dateRange}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {contacts
                  .filter(contact => contact.prayer_week === week)
                  .map(contact => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-2 bg-neutral-50 rounded border border-neutral-200"
                    >
                      <span className="text-sm font-medium text-neutral-900">
                        {contact.name}
                      </span>
                      <select
                        value={contact.prayer_week}
                        onChange={(e) => onWeekChange(contact.id, parseInt(e.target.value))}
                        className="text-sm rounded-md border-neutral-300 focus:border-accent-500 focus:ring-accent-500"
                      >
                        {weekRanges.map(({ week }) => (
                          <option key={week} value={week}>
                            Week {week}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}