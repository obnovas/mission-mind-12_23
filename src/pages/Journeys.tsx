import React from 'react';
import { useJourneyStore } from '../store/journeyStore';
import { useContactStore } from '../store/contactStore';
import { JourneyCard } from '../components/journeys/JourneyCard';
import { JourneyForm } from '../components/journeys/JourneyForm';
import { Plus } from 'lucide-react';
import { journeyColorFamilies } from '../components/journeys/constants';

export function Journeys() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedJourney, setSelectedJourney] = React.useState<Journey>();
  const { items: journeys, loading, error } = useJourneyStore();
  const { items: contacts } = useContactStore();

  React.useEffect(() => {
    Promise.all([
      useJourneyStore.getState().fetch(),
      useContactStore.getState().fetch()
    ]).catch(console.error);
  }, []);

  const handleAdd = () => {
    setSelectedJourney(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (journey: Journey) => {
    setSelectedJourney(journey);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading journeys: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-accent-500 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-roboto font-bold text-neutral-900">Journeys</h1>
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Journey
            </button>
          </div>
        </div>
      </div>

      {journeys.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No journeys</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new journey.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeys.map((journey, index) => {
            const colorFamily = journeyColorFamilies[index % journeyColorFamilies.length];
            const contactCount = contacts.filter(contact =>
              contact.journeys?.some(j => j.journey_id === journey.id)
            ).length;

            return (
              <JourneyCard
                key={journey.id}
                journey={journey}
                onEdit={handleEdit}
                contactCount={contactCount}
                colorFamily={{
                  bg: `bg-${colorFamily.name}-50`,
                  border: `border-l-4 border-l-${colorFamily.name}-500`,
                  text: `text-${colorFamily.name}-600`
                }}
              />
            );
          })}
        </div>
      )}

      <JourneyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        journey={selectedJourney}
      />
    </div>
  );
}