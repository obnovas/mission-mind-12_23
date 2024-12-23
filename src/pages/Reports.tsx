import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Calendar, ArrowUpRight, Network, Heart } from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import { useCheckInStore } from '../store/checkInStore';
import { usePrayerRequestStore } from '../store/prayerRequestStore';
import { useSettingsStore } from '../store/settingsStore';
import { generateDailyReport } from '../utils/reports/generateDailyReport';
import { generateMonthlyReport } from '../utils/reports/generateMonthlyReport';
import { generatePrayerWeekPDF } from '../utils/reports/generatePrayerWeekPDF';
import { format } from 'date-fns';

export function Reports() {
  const { items: contacts } = useContactStore();
  const { items: checkIns } = useCheckInStore();
  const { items: prayerRequests } = usePrayerRequestStore();
  const { settings } = useSettingsStore();
  const [loading, setLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    useContactStore.getState().fetch();
    useCheckInStore.getState().fetch();
    usePrayerRequestStore.getState().fetch();
  }, []);

  const handleGenerateReport = async (type: 'daily' | 'monthly' | 'prayer-week') => {
    try {
      setLoading(type);
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');

      let doc;
      let filename;

      switch (type) {
        case 'daily':
          doc = await generateDailyReport(contacts, checkIns, prayerRequests);
          filename = `mission_mind_daily_report_${timestamp}.pdf`;
          break;
        case 'monthly':
          doc = await generateMonthlyReport(contacts, checkIns, prayerRequests);
          filename = `mission_mind_monthly_report_${timestamp}.pdf`;
          break;
        case 'prayer-week':
          doc = generatePrayerWeekPDF(contacts);
          filename = `prayer_week_assignments_${timestamp}.pdf`;
          break;
      }

      doc.save(filename);
    } catch (err) {
      console.error(`Error generating ${type} report:`, err);
    } finally {
      setLoading(null);
    }
  };

  // ... rest of the component remains the same ...
}