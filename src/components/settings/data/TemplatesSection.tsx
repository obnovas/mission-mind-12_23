import React from 'react';
import { Download } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import { downloadCsv } from '../../../utils/csv/exportData';

export function TemplatesSection() {
  const { settings } = useSettingsStore();

  const templates = {
    contacts: `name,type,email,phone,address,notes,check_in_frequency
"John Smith","Individual","john@example.com","555-0123","123 Main St","Regular attendee","Weekly"
"Community Center","Organization","info@center.org","555-0124","456 Oak Ave","Local outreach partner","Monthly"`,
    prayers: `contact_name,request,status,answer_notes
"John Smith","Strength and guidance","Active",""
"Sarah Johnson","Recovery from surgery","Answered","Full recovery achieved"`,
    journeys: `name,description,stages
"Discipleship Path","Guide through growth","Exploring,Learning,Growing,Serving,Leading"
"Leadership Development","Develop leaders","Discovery,Training,Practice,Mentoring,Leading"`,
    groups: `name,description,members
"Prayer Team","Prayer warriors","John Smith;Sarah Johnson"
"Outreach Team","Community engagement","Community Center;Lisa Brown"`
  };

  const handleDownload = (type: keyof typeof templates, filename: string) => {
    downloadCsv(templates[type], filename);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => handleDownload('contacts', 'contact_template.csv')}
        className="flex flex-col items-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-ocean-300 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-ocean-50 flex items-center justify-center mb-2">
          <Download className="h-5 w-5 text-ocean-600" />
        </div>
        <span className="text-sm font-medium">Contact Template</span>
      </button>

      <button
        onClick={() => handleDownload('prayers', `${settings.featureLabel.toLowerCase()}_template.csv`)}
        className="flex flex-col items-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-coral-300 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-coral-50 flex items-center justify-center mb-2">
          <Download className="h-5 w-5 text-coral-600" />
        </div>
        <span className="text-sm font-medium">{settings.featureLabel} Template</span>
      </button>

      <button
        onClick={() => handleDownload('journeys', 'journey_template.csv')}
        className="flex flex-col items-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sage-300 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-sage-50 flex items-center justify-center mb-2">
          <Download className="h-5 w-5 text-sage-600" />
        </div>
        <span className="text-sm font-medium">Journey Template</span>
      </button>

      <button
        onClick={() => handleDownload('groups', 'group_template.csv')}
        className="flex flex-col items-center p-4 bg-white rounded-lg border border-neutral-200 hover:border-sunset-300 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-sunset-50 flex items-center justify-center mb-2">
          <Download className="h-5 w-5 text-sunset-600" />
        </div>
        <span className="text-sm font-medium">Group Template</span>
      </button>
    </div>
  );
}