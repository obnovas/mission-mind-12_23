import React from 'react';
import { Contact, Journey } from '../../types';
import { useContactStore } from '../../store/contactStore';
import { useJourneyStageUpdate } from '../../hooks/useJourneyStageUpdate';
import { AddContactDialog } from './AddContactDialog';
import { StageColumn } from './StageColumn';
import { journeyColorFamilies } from './constants';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Plus } from 'lucide-react';

interface JourneyBoardProps {
  journey: Journey;
  index: number;
}

export function JourneyBoard({ journey, index }: JourneyBoardProps) {
  const [addingToStage, setAddingToStage] = React.useState<string | null>(null);
  const [localContacts, setLocalContacts] = React.useState<Contact[]>([]);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { items: contacts } = useContactStore();
  const { updateStage, error } = useJourneyStageUpdate({
    onError: () => {
      // Revert to server state on error
      setLocalContacts(contacts.filter(contact =>
        contact.journeys?.some(j => j.journey_id === journey.id)
      ));
    }
  });

  // Initialize local contacts state
  React.useEffect(() => {
    const journeyContacts = contacts.filter(contact =>
      contact.journeys?.some(j => j.journey_id === journey.id)
    );
    setLocalContacts(journeyContacts);
  }, [contacts, journey.id]);

  const handleMoveContact = async (contactId: string, toStage: string) => {
    const contact = localContacts.find(c => c.id === contactId);
    if (!contact) return;

    // Optimistically update local state
    setLocalContacts(prevContacts => 
      prevContacts.map(c => {
        if (c.id === contactId) {
          return {
            ...c,
            journeys: c.journeys?.map(j => 
              j.journey_id === journey.id 
                ? { ...j, stage: toStage }
                : j
            )
          };
        }
        return c;
      })
    );

    try {
      setIsUpdating(true);
      // Update database in background
      await updateStage({
        contactId,
        journeyId: journey.id,
        stage: toStage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const colorFamily = journeyColorFamilies[index % journeyColorFamilies.length];

  return (
    <div className="relative">
      <LoadingSpinner isLoading={isUpdating} message="Updating journey..." />

      {error && (
        <div className="absolute top-4 right-4 bg-red-50 text-red-700 px-4 py-2 rounded-md">
          {error.message}
        </div>
      )}

      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="space-y-4 p-4">
          {journey.stages.map((stage, stageIndex) => (
            <div 
              key={stage}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
            >
              <div className="p-4 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-neutral-900">{stage}</h3>
                  <button
                    onClick={() => setAddingToStage(stage)}
                    className="p-1 rounded-full hover:bg-neutral-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <StageColumn
                  stage={stage}
                  contacts={localContacts.filter(c => 
                    c.journeys?.some(j => 
                      j.journey_id === journey.id && j.stage === stage
                    )
                  )}
                  journeyId={journey.id}
                  onAddContact={() => setAddingToStage(stage)}
                  colorFamily={colorFamily}
                  stageIndex={stageIndex}
                  onMoveContact={handleMoveContact}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex gap-6 min-w-full p-4">
          {journey.stages.map((stage, stageIndex) => (
            <StageColumn
              key={stage}
              stage={stage}
              contacts={localContacts.filter(c => 
                c.journeys?.some(j => 
                  j.journey_id === journey.id && j.stage === stage
                )
              )}
              journeyId={journey.id}
              onAddContact={() => setAddingToStage(stage)}
              colorFamily={colorFamily}
              stageIndex={stageIndex}
              onMoveContact={handleMoveContact}
            />
          ))}
        </div>
      </div>

      <AddContactDialog
        isOpen={!!addingToStage}
        onClose={() => setAddingToStage(null)}
        journeyId={journey.id}
        journeyName={journey.name}
        stageName={addingToStage || ''}
      />
    </div>
  );
}