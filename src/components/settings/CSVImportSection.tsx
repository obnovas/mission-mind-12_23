import React from 'react';
import { Upload, AlertCircle, Check } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { usePrayerRequestStore } from '../../store/prayerRequestStore';
import { useJourneyStore } from '../../store/journeyStore';
import { useNetworkGroupStore } from '../../store/networkGroupStore';
import { useSettingsStore } from '../../store/settingsStore';
import Papa from 'papaparse';
import { CSVTemplatesSection } from './CSVTemplatesSection';
import { DataExportSection } from './DataExportSection';
import { DataManagementSection } from './DataManagementSection';

type ImportType = 'contacts' | 'prayers' | 'journeys' | 'groups';

export function CSVImportSection() {
  const [importType, setImportType] = React.useState<ImportType>('contacts');
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  
  const { add: addContact } = useContactStore();
  const { add: addPrayer } = usePrayerRequestStore();
  const { add: addJourney } = useJourneyStore();
  const { add: addGroup } = useNetworkGroupStore();
  const { settings } = useSettingsStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processCSV = async (file: File) => {
    setError(null);
    setSuccess(null);

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
          const errors: string[] = [];

          for (const row of results.data as any) {
            try {
              switch (importType) {
                case 'contacts':
                  await addContact(row);
                  break;
                case 'prayers':
                  await addPrayer(row);
                  break;
                case 'journeys':
                  await addJourney(row);
                  break;
                case 'groups':
                  await addGroup(row);
                  break;
              }
              successCount++;
            } catch (err) {
              errorCount++;
              errors.push(`Failed to import row: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }

          if (successCount > 0) {
            setSuccess(`Successfully imported ${successCount} items${
              errorCount > 0 ? ` (${errorCount} failed)` : ''
            }`);
          }

          if (errors.length > 0) {
            setError(`Errors:\n${errors.join('\n')}`);
          }
        } catch (err) {
          setError('Error importing data');
          console.error('Import error:', err);
        }
      },
      error: (error) => {
        setError(`Error parsing CSV file: ${error.message}`);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processCSV(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processCSV(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="bg-coral-50 p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-coral-600" />
            <h2 className="text-xl font-semibold text-neutral-900">Import & Export Data</h2>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {/* CSV Templates */}
          <CSVTemplatesSection />

          {/* Import Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-4">Import Data</h3>
            <div className="flex space-x-4 mb-4">
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
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging
                  ? 'border-accent-500 bg-accent-50'
                  : 'border-neutral-300 hover:border-accent-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-lg font-medium text-neutral-900 mb-1">
                  Drop your CSV file here
                </p>
                <p className="text-sm text-neutral-500">
                  or click to select a file
                </p>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className="border-t border-neutral-200 pt-8">
            <DataExportSection />
          </div>
        </div>
      </div>

      <DataManagementSection />
    </div>
  );
}