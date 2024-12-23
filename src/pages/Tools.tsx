import React from 'react';
import { Calendar, Network, FileText } from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import { useCheckInStore } from '../store/checkInStore';
import { usePrayerRequestStore } from '../store/prayerRequestStore';
import { useSettingsStore } from '../store/settingsStore';
import { generateDailyReport } from '../utils/reports/generateDailyReport';
import { generateMonthlyReport } from '../utils/reports/generateMonthlyReport';
import { generatePrayerWeekPDF } from '../utils/reports/generatePrayerWeekPDF';
import { format } from 'date-fns';
import { ToolCard } from '../components/tools/ToolCard';

export function Tools() {
  const [generatingReport, setGeneratingReport] = React.useState<string | null>(null);
  const { items: contacts } = useContactStore();
  const { items: checkIns } = useCheckInStore();
  const { items: prayerRequests } = usePrayerRequestStore();
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    useContactStore.getState().fetch();
    useCheckInStore.getState().fetch();
    usePrayerRequestStore.getState().fetch();
  }, []);

  const handleGenerateReport = async (type: 'daily' | 'monthly' | 'prayer-week') => {
    try {
      setGeneratingReport(type);
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      let doc;

      switch (type) {
        case 'daily':
          doc = await generateDailyReport(contacts, checkIns, prayerRequests);
          doc.save(`mission_mind_daily_report_${timestamp}.pdf`);
          break;
        case 'monthly':
          doc = await generateMonthlyReport(contacts, checkIns, prayerRequests);
          doc.save(`mission_mind_monthly_report_${timestamp}.pdf`);
          break;
        case 'prayer-week':
          doc = generatePrayerWeekPDF(contacts);
          doc.save(`pray_by_week_${timestamp}.pdf`);
          break;
      }
    } catch (err) {
      console.error(`Error generating ${type} report:`, err);
    } finally {
      setGeneratingReport(null);
    }
  };

  const tools = [
    {
      title: 'Calendar Report',
      description: `View and export ${settings.checkInLabel.toLowerCase()}s in a calendar format`,
      icon: Calendar,
      link: '/tools/calendar',
      color: 'ocean' as const,
      report: {
        label: 'Export Calendar PDF',
        type: 'monthly' as const
      }
    },
    {
      title: 'Sphere of Influence',
      description: 'Visualize your network connections and influence',
      icon: Network,
      link: '/tools/influence',
      color: 'coral' as const
    },
    {
      title: 'Pray by Week',
      description: 'Manage and view prayer week assignments',
      icon: Calendar,
      link: '/tools/prayer-week',
      color: 'sage' as const,
      report: {
        label: 'Export Schedule PDF',
        type: 'prayer-week' as const
      }
    },
    {
      title: 'Daily Report',
      description: `Summary of daily activities and ${settings.checkInLabel.toLowerCase()}s`,
      icon: FileText,
      color: 'sunset' as const,
      report: {
        label: 'Generate Daily Report',
        type: 'daily' as const
      }
    },
    {
      title: 'Monthly Report',
      description: 'Comprehensive monthly ministry activity summary',
      icon: FileText,
      color: 'lavender' as const,
      report: {
        label: 'Generate Monthly Report',
        type: 'monthly' as const
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-roboto font-bold text-neutral-900">Tools</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            {...tool}
            onGenerateReport={tool.report ? handleGenerateReport : undefined}
            isGenerating={generatingReport === tool.report?.type}
          />
        ))}
      </div>
    </div>
  );
}