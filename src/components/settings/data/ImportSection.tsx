import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useContactStore } from '../../../store/contactStore';
import { usePrayerRequestStore } from '../../../store/prayerRequestStore';
import { useJourneyStore } from '../../../store/journeyStore';
import { useNetworkGroupStore } from '../../../store/networkGroupStore';
import { useSettingsStore } from '../../../store/settingsStore';
import Papa from 'papaparse';

type ImportType = 'contacts' | 'prayers' | 'journeys' | 'groups';

export function ImportSection() {
  const [importType, setImportType] = React.useState<ImportType>('contacts');
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  
  const { add: addContact } = useContactStore();
  const { add: addPrayer } = usePrayerRequestStore();
  const { add: addJourney } = useJourneyStore();
  const { add: addGroup } = useNetworkGroupStore();
  const { settings } = useSettingsStore();

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          let successCount = 0;
          let errorCount = 0;

          for (const row of results.data as any) {
            try {
              switch (importType) {
                case 'contacts': await addContact(row); break;
                case 'prayers': await addPrayer(row); break;
                case 'journeys': await addJourney(row); break;
                case 'groups': await addGroup(row); break;
              }
              successCount++;
            } catch (err) {
              errorCount++;
            }
          }

          setSuccess(`Successfully imported ${successCount} items${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
        } catch (err) {
          setError('Error importing data');
        }
      },
      error: (error) => setError(`Error parsing CSV file: ${error.message}`),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <select
          value={importType}
          onChange={(e) => setImportType(e.target.value as ImportType)}
          className="rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
        >
          <option value="contacts">Contacts</option>
          <option value="prayers">{settings.featureLabel}</option>
          <option value="journeys">Journeys</option>
          <option value="groups">Groups</option>
        </select>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-accent-500 bg-accent-50' : 'border-neutral-300 hover:border-accent-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="flex flex-col items-center cursor-pointer">
          <Upload className="h-10 w-10 text-neutral-400 mb-3" />
          <p className="text-sm font-medium text-neutral-900">Drop CSV file here or click to browse</p>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-sage-50 text-sage-700 rounded-md text-sm">
          {success}
        </div>
      )}
    </div>
  );
}