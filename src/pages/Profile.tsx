import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  UserCircle, 
  Bell,
  Globe,
  Layout,
  Map,
  Users,
  Heart,
  Upload,
  Calendar
} from 'lucide-react';

import { SettingsCard } from '../components/settings/SettingsCard';
import { UserDataSection } from '../components/settings/UserDataSection';
import { AlertPreferencesSection } from '../components/settings/AlertPreferencesSection';
import { TimezoneSection } from '../components/settings/TimezoneSection';
import { WelcomeNoteSection } from '../components/settings/WelcomeNoteSection';
import { ReportTitlesSection } from '../components/settings/ReportTitlesSection';
import { DefaultJourneyStagesSection } from '../components/settings/DefaultJourneyStagesSection';
import { RelationshipTypesSection } from '../components/settings/RelationshipTypesSection';
import { ContactTypesSection } from '../components/settings/ContactTypesSection';
import { NetworkGroupLabelSection } from '../components/settings/NetworkGroupLabelSection';
import { CheckInLabelSection } from '../components/settings/CheckInLabelSection';
import { FeatureLabelSection } from '../components/settings/FeatureLabelSection';
import { CheckInDaysSection } from '../components/settings/CheckInDaysSection';
import { PrayerWeekAssignmentSection } from '../components/settings/PrayerWeekAssignmentSection';
import { DataManagementSection } from '../components/settings/data/DataManagementSection';

export function Profile() {
  const { signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <UserCircle className="h-8 w-8 text-accent-600 mr-2" />
              <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-coral-600 hover:bg-coral-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <SettingsCard
        title="Account Settings"
        icon={UserCircle}
        color="ocean"
      >
        <UserDataSection />
      </SettingsCard>

      {/* Notifications */}
      <SettingsCard
        title="Notifications"
        icon={Bell}
        color="coral"
      >
        <AlertPreferencesSection />
      </SettingsCard>

      {/* Localization */}
      <SettingsCard
        title="Localization"
        icon={Globe}
        color="sage"
      >
        <TimezoneSection />
      </SettingsCard>

      {/* Display & Personalization */}
      <SettingsCard
        title="Display & Personalization"
        icon={Layout}
        color="sunset"
      >
        <div className="space-y-8">
          <WelcomeNoteSection />
          <ReportTitlesSection />
        </div>
      </SettingsCard>

      {/* Journey Configuration */}
      <SettingsCard
        title="Journey Configuration"
        icon={Map}
        color="lavender"
      >
        <DefaultJourneyStagesSection />
      </SettingsCard>

      {/* Contact Management */}
      <SettingsCard
        title="Contact Management"
        icon={Users}
        color="mint"
      >
        <div className="space-y-8">
          <RelationshipTypesSection />
          <ContactTypesSection />
          <NetworkGroupLabelSection />
        </div>
      </SettingsCard>

      {/* Feature Labels */}
      <SettingsCard
        title="Feature Labels"
        icon={Heart}
        color="berry"
      >
        <div className="space-y-8">
          <CheckInLabelSection />
          <FeatureLabelSection />
        </div>
      </SettingsCard>

      {/* Scheduling */}
      <SettingsCard
        title="Scheduling"
        icon={Calendar}
        color="honey"
      >
        <div className="space-y-8">
          <CheckInDaysSection />
          <PrayerWeekAssignmentSection />
        </div>
      </SettingsCard>

      {/* Data Management */}
      <DataManagementSection />
    </div>
  );
}