import React from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { NestedSection } from './sections/NestedSection';

const DEFAULT_TYPES = ['Individual', 'Organization', 'Business'];

export function ContactTypesSection() {
  const { settings, updateSettings } = useSettingsStore();
  const [newType, setNewType] = React.useState('');

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newType.trim() && !settings.contactTypes.includes(newType.trim())) {
      updateSettings({
        contactTypes: [...settings.contactTypes, newType.trim()],
      });
      setNewType('');
    }
  };

  const handleRemoveType = (type: string) => {
    if (DEFAULT_TYPES.includes(type)) {
      return;
    }
    updateSettings({
      contactTypes: settings.contactTypes.filter((t) => t !== type),
    });
  };

  return (
    <NestedSection title="Contact Types">
      <div className="bg-honey-50 border border-honey-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-honey-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-honey-800">
            <p className="font-medium mb-1">About Contact Types</p>
            <p>Contact types help categorize your ministry relationships. Default types cannot be removed, but you can add custom types specific to your ministry context.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddType} className="flex gap-4">
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="Add new contact type..."
          className="flex-1 rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
        />
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        {settings.contactTypes.map((type) => {
          const isDefault = DEFAULT_TYPES.includes(type);
          return (
            <div
              key={type}
              className={`flex items-center justify-between p-3 bg-white rounded-lg border ${
                isDefault ? 'border-neutral-200' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-neutral-900">{type}</span>
                {isDefault && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600">
                    Default
                  </span>
                )}
              </div>
              <button
                onClick={() => handleRemoveType(type)}
                className={`text-sm ${
                  isDefault 
                    ? 'text-neutral-300 cursor-not-allowed' 
                    : 'text-coral-600 hover:text-coral-700'
                }`}
                disabled={isDefault}
                title={isDefault ? 'Default types cannot be removed' : 'Remove type'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NestedSection>
  );
}