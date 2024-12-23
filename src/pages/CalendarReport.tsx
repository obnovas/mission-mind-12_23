import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import { useCheckInStore } from '../store/checkInStore';
import { CalendarReport as CalendarReportComponent } from '../components/reports/CalendarReport';
import { format, subMonths, addMonths } from 'date-fns';
import { useSettingsStore } from '../store/settingsStore';

export function CalendarReportPage() {
  const navigate = useNavigate();
  const { items: contacts } = useContactStore();
  const { items: checkIns } = useCheckInStore();
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    useContactStore.getState().fetch();
    useCheckInStore.getState().fetch();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/tools')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-roboto font-bold text-neutral-900">
              Monthly {settings.checkInLabel} Report
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedMonth(prev => subMonths(prev, 1))}
          className="px-3 py-1 text-sm text-accent-600 hover:text-accent-700"
        >
          Previous Month
        </button>
        <button
          onClick={() => setSelectedMonth(new Date())}
          className="px-3 py-1 text-sm text-accent-600 hover:text-accent-700"
        >
          Today
        </button>
        <button
          onClick={() => setSelectedMonth(prev => addMonths(prev, 1))}
          className="px-3 py-1 text-sm text-accent-600 hover:text-accent-700"
        >
          Next Month
        </button>
      </div>

      <CalendarReportComponent 
        checkIns={checkIns}
        contacts={contacts}
        month={selectedMonth}
      />
    </div>
  );
}