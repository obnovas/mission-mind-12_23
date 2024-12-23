import React from 'react';
import { Download, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { useContactStore } from '../../../store/contactStore';
import { usePrayerRequestStore } from '../../../store/prayerRequestStore';
import { useJourneyStore } from '../../../store/journeyStore';
import { useNetworkGroupStore } from '../../../store/networkGroupStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { generateContactsCsv, generatePrayersCsv, generateJourneysCsv, generateGroupsCsv, downloadCsv } from '../../../utils/csv/exportData';

export function ExportSection() {
  const { items: contacts } = useContactStore();
  const { items: prayers } = usePrayerRequestStore();
  const { items: journeys } = useJourneyStore();
  const { items: groups } = useNetworkGroupStore();
  const { settings } = useSettingsStore();

  const handleExport = (type: 'contacts' | 'prayers' | 'journeys' | 'groups') => {
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    let csvContent: string;
    let filename: string;

    switch (type) {
      case 'contacts':
        csvContent = generateContactsCsv(contacts);
        filename = `contacts_export_${timestamp}.csv`;
        break;
      case 'prayers':
        csvContent = generatePrayersCsv(prayers, contacts);
        filename = `${settings.featureLabel.toLowerCase()}_export_${timestamp}.csv`;
        break;
      case 'journeys':
        csvContent = generateJourneysCsv(journeys);
        filename = `journeys_export_${timestamp}.csv`;
        break;
      case 'groups':
        csvContent = generateGroupsCsv(groups, contacts);
        filename = `groups_export_${timestamp}.csv`;
        break;
    }

    downloadCsv(csvContent, filename);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => handleExport('contacts')}
        className="flex flex-col items-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-ocean-300 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-ocean-50 flex items-center justify-center mb-2">
          <FileDown className="h-5 w-5 text-ocean-600" />
        </div>
        <span className="text-sm font-medium">Export Contacts</span>
      </button>

      <button
        onClick={() => handleExport('prayers')}
        className="flex flex-col items-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-coral-300 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-coral-50 flex items-center justify-center mb-2">
          <FileDown className="h-5 w-5 text-coral-600" />
        </div>
        <span className="text-sm font-medium">Export {settings.featureLabel}</span>
      </button>

      <button
        onClick={() => handleExport('journeys')}
        className="flex flex-col items-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sage-300 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-sage-50 flex items-center justify-center mb-2">
          <FileDown className="h-5 w-5 text-sage-600" />
        </div>
        <span className="text-sm font-medium">Export Journeys</span>
      </button>

      <button
        onClick={() => handleExport('groups')}
        className="flex flex-col items-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sunset-300 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-sunset-50 flex items-center justify-center mb-2">
          <FileDown className="h-5 w-5 text-sunset-600" />
        </div>
        <span className="text-sm font-medium">Export Groups</span>
      </button>
    </div>
  );
}