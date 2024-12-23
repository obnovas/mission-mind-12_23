import React from 'react';
import { Map, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { Tooltip } from '../common/Tooltip';

export interface JourneyTemplate {
  id: string;
  name: string;
  description: string;
  stages: string[];
}

export const predefinedTemplates: JourneyTemplate[] = [
  {
    id: 'engagement',
    name: 'Engagement Journey',
    description: 'Track progression from passive to loyal engagement',
    stages: ['Passive Interest', 'Active Interest', 'Trial', 'Committed', 'Loyal']
  },
  {
    id: 'agreement',
    name: 'Agreement Journey',
    description: 'Monitor progression from opposition to agreement',
    stages: ['Against', 'Entertaining', 'Interested', 'Agreeance']
  },
  {
    id: 'skill',
    name: 'Skill Development',
    description: 'Track skill progression from beginner to professional',
    stages: ['Beginner', 'Novice', 'Expert', 'Advanced', 'Pro']
  },
  {
    id: 'generic',
    name: 'Generic Journey',
    description: 'Simple numbered stages for general use',
    stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5']
  }
];

interface JourneyTemplatesProps {
  onSelect: (template: JourneyTemplate) => void;
  disabled?: boolean;
}

export function JourneyTemplates({ onSelect, disabled }: JourneyTemplatesProps) {
  const { settings } = useSettingsStore();

  // Create a template from default stages
  const defaultTemplate: JourneyTemplate = {
    id: 'default',
    name: 'Default Stages',
    description: 'Your customized default journey stages',
    stages: settings.defaultJourneyStages
  };

  // Combine default template with predefined templates
  const allTemplates = [defaultTemplate, ...predefinedTemplates];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Map className="h-5 w-5 text-accent-600" />
        <h3 className="text-sm font-medium text-neutral-900">Select a Template</h3>
      </div>

      {disabled && (
        <div className="mb-4 p-3 bg-honey-50 border border-honey-200 rounded-md flex items-start">
          <AlertCircle className="h-4 w-4 text-honey-600 mt-0.5 mr-2" />
          <p className="text-sm text-honey-800">
            Templates cannot be applied to journeys that have contacts assigned to stages.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {allTemplates.map((template) => (
          <Tooltip
            key={template.id}
            content={template.description}
            className="left-full ml-2"
          >
            <button
              onClick={() => !disabled && onSelect(template)}
              className={`text-left p-3 rounded-lg border ${
                disabled
                  ? 'border-neutral-200 bg-neutral-50 cursor-not-allowed'
                  : 'border-neutral-200 hover:border-accent-300 bg-white cursor-pointer'
              } transition-colors duration-200 w-full h-full`}
              disabled={disabled}
            >
              <h4 className="font-medium text-neutral-900 mb-2">{template.name}</h4>
              <div className="flex flex-wrap gap-1">
                {template.stages.map((stage, index) => (
                  <span
                    key={stage}
                    className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                      index === 0 ? 'bg-accent-100 text-accent-800' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {stage}
                  </span>
                ))}
              </div>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}