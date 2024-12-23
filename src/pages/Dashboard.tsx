import React from 'react';
import { useContactStore } from '../store/contactStore';
import { useJourneyStore } from '../store/journeyStore';
import { usePrayerRequestStore } from '../store/prayerRequestStore';
import { useCheckInStore } from '../store/checkInStore';
import { useSettingsStore } from '../store/settingsStore';
import { Users, Map, HeartHandshake, Calendar } from 'lucide-react';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ContactsOverview } from '../components/dashboard/ContactsOverview';
import { DashboardMeetingsCard } from '../components/dashboard/DashboardMeetingsCard';
import { PrayerRequestsList } from '../components/PrayerRequestsList';
import { FavoriteContacts } from '../components/dashboard/FavoriteContacts';
import { getWelcomeNote } from '../utils/welcomeNote';
import { calculateDashboardMetrics } from '../utils/metrics/dashboardMetrics';
import { CheckInDialogHandler } from '../components/dashboard/CheckInDialogHandler';

export function Dashboard() {
  const [welcomeNote, setWelcomeNote] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  
  const { items: contacts } = useContactStore();
  const { items: journeys } = useJourneyStore();
  const { items: prayerRequests } = usePrayerRequestStore();
  const { items: checkIns } = useCheckInStore();
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await Promise.all([
          useContactStore.getState().fetch(),
          useJourneyStore.getState().fetch(),
          usePrayerRequestStore.getState().fetch(),
          useCheckInStore.getState().fetch(),
          getWelcomeNote().then(setWelcomeNote)
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const metrics = calculateDashboardMetrics({
    contacts,
    checkIns,
    prayerRequests,
    journeys,
    settings
  });

  const dashboardCards = [
    {
      title: 'Total Contacts',
      value: metrics.totalContacts,
      icon: Users,
      description: 'People in your network',
      color: 'ocean',
      link: '/contacts',
      tooltip: 'View all contacts',
      staggerIndex: 1
    },
    {
      title: `${settings.checkInLabel}s Due`,
      value: metrics.upcomingCheckIns,
      icon: Calendar,
      description: `Due within ${settings.upcomingCheckInsDays} days`,
      color: 'coral',
      link: '/check-ins',
      tooltip: `View ${settings.checkInLabel}s`,
      staggerIndex: 2
    },
    {
      title: settings.featureLabel,
      value: metrics.activePrayerRequests,
      icon: HeartHandshake,
      description: `Active ${settings.featureLabel.toLowerCase()}`,
      color: 'sage',
      link: '/prayer-requests',
      tooltip: `View ${settings.featureLabel}`,
      staggerIndex: 3
    },
    {
      title: 'Active Journeys',
      value: metrics.activeJourneys,
      icon: Map,
      description: 'Ongoing discipleship paths',
      color: 'sunset',
      link: '/journeys',
      tooltip: 'View all journeys',
      staggerIndex: 4
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-coral-500 overflow-hidden animate-fade-in">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="max-w-lg">
              <h1 className="text-3xl font-roboto font-bold text-neutral-900">{settings.dashboardTitle}</h1>
              <p className="mt-1 text-neutral-600 font-montserrat whitespace-pre-line">
                {welcomeNote}
              </p>
            </div>
            <div className="flex-shrink-0">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-honey-500 overflow-hidden">
            <div className="p-6">
              <FavoriteContacts contacts={contacts} />
            </div>
          </div>

          <ContactsOverview 
            contacts={contacts}
            prayerRequests={prayerRequests}
          />
        </div>

        <div className="space-y-8">
          <CheckInDialogHandler contacts={contacts}>
            {(handleCheckInSelect) => (
              <DashboardMeetingsCard 
                contacts={contacts} 
                checkIns={checkIns}
                onCheckInSelect={handleCheckInSelect}
              />
            )}
          </CheckInDialogHandler>

          <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-coral-500 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-roboto font-semibold text-neutral-900">
                  {settings.featureLabel}
                </h2>
                <span className="px-3 py-1 bg-coral-100 text-coral-800 rounded-full text-sm font-medium">
                  {metrics.activePrayerRequests} active
                </span>
              </div>
              <div className="mt-6">
                <PrayerRequestsList contacts={contacts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}