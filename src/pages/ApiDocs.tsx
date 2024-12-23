import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Key, Users, Calendar, Heart, Network, Rocket } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { OverviewSection } from '../components/api-docs/sections/OverviewSection';
import { ContactsSection } from '../components/api-docs/sections/ContactsSection';
import { CheckInsSection } from '../components/api-docs/sections/CheckInsSection';
import { PrayersSection } from '../components/api-docs/sections/PrayersSection';
import { GroupsSection } from '../components/api-docs/sections/GroupsSection';

export function ApiDocs() {
  const [activeSection, setActiveSection] = React.useState('overview');
  const { settings } = useSettingsStore();

  const sections = [
    { id: 'overview', label: 'Overview', icon: Key, component: OverviewSection },
    { id: 'contacts', label: 'Contacts API', icon: Users, component: ContactsSection },
    { id: 'check-ins', label: `${settings.checkInLabel}s API`, icon: Calendar, component: CheckInsSection },
    { id: 'prayers', label: `${settings.featureLabel} API`, icon: Heart, component: PrayersSection },
    { id: 'groups', label: 'Network Groups API', icon: Network, component: GroupsSection },
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || OverviewSection;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-coral-100 p-2">
              <Rocket className="h-8 w-8 text-coral-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Integrations</h1>
              <p className="mt-1 text-lg text-neutral-600">API Documentation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeSection === id
                    ? 'bg-accent-50 text-accent-700'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 prose prose-neutral max-w-none">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}