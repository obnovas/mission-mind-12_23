import React from 'react';
import { Download } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { downloadCsv } from '../../utils/csv/exportData';

export function CSVTemplatesSection() {
  const { settings } = useSettingsStore();

  const templates = {
    contacts: `name,type,email,phone,address,notes,check_in_frequency
"John Smith","Individual","john@example.com","555-0123","123 Main St","Regular attendee","Weekly"
"Community Center","Organization","info@center.org","555-0124","456 Oak Ave","Local outreach partner","Monthly"
"Tech Corp","Business","contact@techcorp.com","555-0125","789 Pine St","Technology partner","Quarterly"`,

    prayers: `contact_name,request,status,answer_notes
"John Smith","Strength and guidance for new ministry role","Active",""
"Sarah Johnson","Recovery from surgery","Answered","Full recovery achieved"
"Community Center","Funding for youth program","Active",""`,

    journeys: `name,description,stages
"Discipleship Path","Guide individuals through spiritual growth","Exploring,Learning,Growing,Serving,Leading,Multiplying"
"Leadership Development","Develop ministry leaders","Discovery,Training,Practice,Mentoring,Leading"`,

    groups: `name,description,members
"Prayer Team","Dedicated prayer warriors","John Smith;Sarah Johnson;Mark Wilson"
"Outreach Team","Community engagement group","Community Center;Tech Corp;Lisa Brown"`
  };

  const handleDownloadTemplate = (type: keyof typeof templates, filename: string) => {
    downloadCsv(templates[type], filename);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-700">CSV Templates</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleDownloadTemplate('contacts', 'contact_template.csv')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-ocean-300 transition-colors duration-200 group"
        >
          <div className="w-12 h-12 rounded-full bg-ocean-50 flex items-center justify-center mb-2 group-hover:bg-ocean-100 transition-colors duration-200">
            <Download className="h-6 w-6 text-ocean-600" />
          </div>
          <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Contacts Template</span>
        </button>

        <button
          onClick={() => handleDownloadTemplate('prayers', `${settings.featureLabel.toLowerCase()}_template.csv`)}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-coral-300 transition-colors duration-200 group"
        >
          <div className="w-12 h-12 rounded-full bg-coral-50 flex items-center justify-center mb-2 group-hover:bg-coral-100 transition-colors duration-200">
            <Download className="h-6 w-6 text-coral-600" />
          </div>
          <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">{settings.featureLabel} Template</span>
        </button>

        <button
          onClick={() => handleDownloadTemplate('journeys', 'journey_template.csv')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sage-300 transition-colors duration-200 group"
        >
          <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center mb-2 group-hover:bg-sage-100 transition-colors duration-200">
            <Download className="h-6 w-6 text-sage-600" />
          </div>
          <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Journeys Template</span>
        </button>

        <button
          onClick={() => handleDownloadTemplate('groups', 'group_template.csv')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-lavender-300 transition-colors duration-200 group"
        >
          <div className="w-12 h-12 rounded-full bg-lavender-50 flex items-center justify-center mb-2 group-hover:bg-lavender-100 transition-colors duration-200">
            <Download className="h-6 w-6 text-lavender-600" />
          </div>
          <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">Groups Template</span>
        </button>
      </div>
    </div>
  );
}