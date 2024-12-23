import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import { PrayerWeekCalendar } from '../components/prayer-week/PrayerWeekCalendar';
import { useSettingsStore } from '../store/settingsStore';
import { generatePrayerWeekPDF } from '../utils/reports/generatePrayerWeekPDF';
import { format } from 'date-fns';

export function PrayerWeek() {
  const navigate = useNavigate();
  const { items: contacts, loading, error, update } = useContactStore();
  const { settings } = useSettingsStore();
  const [exportLoading, setExportLoading] = React.useState(false);

  React.useEffect(() => {
    useContactStore.getState().fetch();
  }, []);

  const handleWeekChange = async (contactId: string, week: number) => {
    try {
      await update(contactId, {
        prayer_week: week,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error updating prayer week:', err);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportLoading(true);
      const doc = generatePrayerWeekPDF(contacts);
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      doc.save(`pray_by_week_${timestamp}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading contacts: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/tools')}
                className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-accent-600 mr-2" />
                <h1 className="text-2xl sm:text-3xl font-roboto font-bold text-neutral-900">
                  Pray by Week
                </h1>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={exportLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200 disabled:opacity-50"
            >
              {exportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <PrayerWeekCalendar 
        contacts={contacts}
        onWeekChange={handleWeekChange}
      />
    </div>
  );
}