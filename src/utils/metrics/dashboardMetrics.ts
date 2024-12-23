import { Contact, CheckIn, PrayerRequest, Journey } from '../../types';
import { addDays } from 'date-fns';

interface DashboardMetrics {
  totalContacts: number;
  upcomingCheckIns: number;
  activePrayerRequests: number;
  activeJourneys: number;
  completedCheckIns: number;
  missedCheckIns: number;
  checkInCompletionRate: number;
}

interface MetricsInput {
  contacts: Contact[];
  checkIns: CheckIn[];
  prayerRequests: PrayerRequest[];
  journeys: Journey[];
  settings: any;
}

export function calculateDashboardMetrics({
  contacts,
  checkIns,
  prayerRequests,
  journeys,
  settings
}: MetricsInput): DashboardMetrics {
  const now = new Date();
  const upcomingCutoff = addDays(now, settings.upcomingCheckInsDays || 30);

  // Calculate check-in metrics
  const upcomingCheckIns = contacts.filter(contact => {
    const nextDate = new Date(contact.next_contact_date);
    return nextDate > now && nextDate <= upcomingCutoff;
  }).length;

  const completedCheckIns = checkIns.filter(ci => ci.status === 'Completed').length;
  const missedCheckIns = checkIns.filter(ci => ci.status === 'Missed').length;
  const totalCheckIns = completedCheckIns + missedCheckIns;
  const checkInCompletionRate = totalCheckIns > 0 
    ? (completedCheckIns / totalCheckIns) * 100 
    : 0;

  return {
    totalContacts: contacts.length,
    upcomingCheckIns,
    activePrayerRequests: prayerRequests.filter(pr => pr.status === 'Active').length,
    activeJourneys: journeys.length,
    completedCheckIns,
    missedCheckIns,
    checkInCompletionRate
  };
}