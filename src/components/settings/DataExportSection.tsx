import React from 'react';
import { Download, FileDown, Users, Heart, Map, Network } from 'lucide-react';
import { format } from 'date-fns';
import { useContactStore } from '../../store/contactStore';
import { usePrayerRequestStore } from '../../store/prayerRequestStore';
import { useJourneyStore } from '../../store/journeyStore';
import { useNetworkGroupStore } from '../../store/networkGroupStore';
import { useSettingsStore } from '../../store/settingsStore';
import { 
  generateContactsCsv,
  generatePrayersCsv,
  generateJourneysCsv,
  generateGroupsCsv,
  downloadCsv,
  contactTemplate 
} from '../../utils/csv/exportData';

export function DataExportSection() {
  const { items: contacts } = useContactStore();
  const { items: prayers } = usePrayerRequestStore();
  const { items: journeys } = useJourneyStore();
  const { items: groups } = useNetworkGroupStore();
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    // Ensure we have the latest data
    useContactStore.getState().fetch();
    usePrayerRequestStore.getState().fetch();
    useJourneyStore.getState().fetch();
    useNetworkGroupStore.getState().fetch();
  }, []);

  const handleDownloadTemplate = () => {
    downloadCsv(contactTemplate, 'contact_template.csv');
  };

  const handleExportContacts = () => {
    const csvContent = generateContactsCsv(contacts);
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    downloadCsv(csvContent, `mission_mind_contacts_export_${timestamp}.csv`);
  };

  const handleExportPrayers = () => {
    const csvContent = generatePrayersCsv(prayers, contacts);
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    downloadCsv(csvContent, `mission_mind_${settings.featureLabel.toLowerCase()}_export_${timestamp}.csv`);
  };

  const handleExportJourneys = () => {
    const csvContent = generateJourneysCsv(journeys);
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    downloadCsv(csvContent, `mission_mind_journeys_export_${timestamp}.csv`);
  };

  const handleExportGroups = () => {
    const csvContent = generateGroupsCsv(groups, contacts);
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    downloadCsv(csvContent, `mission_mind_groups_export_${timestamp}.csv`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-neutral-700 mb-4">Contact Template</h3>
        <button
          onClick={handleDownloadTemplate}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-ocean-300 transition-colors duration-200 group w-full sm:w-auto"
        >
          <div className="w-12 h-12 rounded-full bg-ocean-50 flex items-center justify-center mb-2 group-hover:bg-ocean-100 transition-colors duration-200">
            <Download className="h-6 w-6 text-ocean-600" />
          </div>
          <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Download Template</span>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-700 mb-4">Export Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleExportContacts}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-coral-300 transition-colors duration-200 group"
          >
            <div className="w-12 h-12 rounded-full bg-coral-50 flex items-center justify-center mb-2 group-hover:bg-coral-100 transition-colors duration-200">
              <Users className="h-6 w-6 text-coral-600" />
            </div>
            <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Export Contacts</span>
          </button>

          <button
            onClick={handleExportPrayers}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sage-300 transition-colors duration-200 group"
          >
            <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center mb-2 group-hover:bg-sage-100 transition-colors duration-200">
              <Heart className="h-6 w-6 text-sage-600" />
            </div>
            <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Export {settings.featureLabel}</span>
          </button>

          <button
            onClick={handleExportJourneys}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sunset-300 transition-colors duration-200 group"
          >
            <div className="w-12 h-12 rounded-full bg-sunset-50 flex items-center justify-center mb-2 group-hover:bg-sunset-100 transition-colors duration-200">
              <Map className="h-6 w-6 text-sunset-600" />
            </div>
            <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Export Journeys</span>
          </button>

          <button
            onClick={handleExportGroups}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-lavender-300 transition-colors duration-200 group"
          >
            <div className="w-12 h-12 rounded-full bg-lavender-50 flex items-center justify-center mb-2 group-hover:bg-lavender-100 transition-colors duration-200">
              <Network className="h-6 w-6 text-lavender-600" />
            </div>
            <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Export Groups</span>
          </button>
        </div>
      </div>
    </div>
  );
}