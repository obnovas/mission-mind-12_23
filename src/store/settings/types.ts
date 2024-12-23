export interface Settings {
  dashboardTitle: string;
  contactTypes: string[];
  relationshipTypes: string[];
  featureLabel: 'Prayers' | 'Actions' | 'Tasks' | 'Requests' | 'Needs';
  showSampleData: boolean;
  userId: string | null;
  upcomingCheckInsDays: number;
  timezone: string;
  favoriteContacts: string[];
  defaultJourneyStages: string[];
  userName: string;
  optInContact: boolean;
  networkGroupLabel: 'Group' | 'Network' | 'Team' | 'Association';
  checkInLabel: 'Check-In' | 'Interaction' | 'Session' | 'Follow-Up' | 'Meeting';
  dailyReportTitle: string;
  monthlyReportTitle: string;
  welcomeNoteStyle: 'biblical' | 'inspirational' | 'simple';
  emailAlerts: boolean;
  smsAlerts: boolean;
  alertPhoneNumber?: string;
  alertProvider?: string;
  apiKey?: string | null;
}

export interface SettingsStore {
  settings: Settings;
  initializeSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  setUserId: (userId: string | null) => void;
}