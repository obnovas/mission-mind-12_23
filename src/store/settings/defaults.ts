import { Settings } from './types';

export const defaultSettings: Settings = {
  dashboardTitle: 'Ministry Dashboard',
  welcomeNoteStyle: 'simple',
  dailyReportTitle: 'Daily Ministry Report',
  monthlyReportTitle: 'Monthly Ministry Report',
  featureLabel: 'Prayers',
  checkInLabel: 'Check-In',
  networkGroupLabel: 'Group',
  contactTypes: ['Individual', 'Organization', 'Business'],
  relationshipTypes: [
    'Friend',
    'Family',
    'Colleague',
    'Mentor',
    'Mentee',
    'Member',
    'Partner',
    'Other'
  ],
  defaultJourneyStages: [
    'Preparing',
    'First Effort',
    'Recurring Effort',
    'Consistent',
    'Achieved Goal',
    'Completed'
  ],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  upcomingCheckInsDays: 30,
  userName: '',
  optInContact: false,
  showSampleData: true,
  favoriteContacts: [],
  userId: null,
  emailAlerts: false,
  smsAlerts: false,
  alertPhoneNumber: '',
  alertProvider: '',
};

export function validateSettings(settings: Partial<Settings>): Settings {
  return {
    ...defaultSettings,
    ...settings,
    contactTypes: settings.contactTypes || defaultSettings.contactTypes,
    relationshipTypes: settings.relationshipTypes || defaultSettings.relationshipTypes,
    defaultJourneyStages: settings.defaultJourneyStages || defaultSettings.defaultJourneyStages,
    favoriteContacts: settings.favoriteContacts || defaultSettings.favoriteContacts,
    upcomingCheckInsDays: Math.min(Math.max(1, settings.upcomingCheckInsDays || defaultSettings.upcomingCheckInsDays), 90),
  };
}