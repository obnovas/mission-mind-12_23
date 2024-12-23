import React from 'react';
import { Upload } from 'lucide-react';
import { ImportSection } from './ImportSection';
import { ExportSection } from './ExportSection';
import { TemplatesSection } from './TemplatesSection';
import { ClearDataSection } from './ClearDataSection';
import { ApiKeySection } from './ApiKeySection';

export function DataManagementSection() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="bg-coral-50 p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-coral-600" />
          <h2 className="text-xl font-semibold text-neutral-900">Data Management</h2>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* API Key Section */}
        <div className="border-b border-neutral-200 pb-8">
          <ApiKeySection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Import Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-700">Import Data</h3>
            <ImportSection />
          </div>

          {/* Export Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-700">Export Data</h3>
            <ExportSection />
          </div>
        </div>

        {/* Templates Section */}
        <div className="space-y-4 border-t border-neutral-200 pt-8">
          <h3 className="text-sm font-medium text-neutral-700">CSV Templates</h3>
          <TemplatesSection />
        </div>

        {/* Clear Data Section */}
        <div className="border-t border-neutral-200 pt-8">
          <h3 className="text-sm font-medium text-neutral-700 mb-4">Clear Data</h3>
          <ClearDataSection />
        </div>
      </div>
    </div>
  );
}