import React from 'react';
import { Contact, Journey } from '../../../types';
import { ColorFamily } from '../types';
import { VerticalStage } from './VerticalStage';
import { JourneyStageLayout } from '../JourneyStageLayout';
import { useJourneyStore } from '../../../store/journeyStore';

interface VerticalJourneyBoardProps {
  journey: Journey;
  contacts: Contact[];
  onAddContact: (stage: string) => void;
  onMoveContact: (contactId: string, toStage: string) => void;
  colorFamily: ColorFamily;
}

export function VerticalJourneyBoard({
  journey,
  contacts,
  onAddContact,
  onMoveContact,
  colorFamily,
}: VerticalJourneyBoardProps) {
  const { update } = useJourneyStore();

  const handleUpdateStageNotes = async (stage: string, notes: string) => {
    try {
      const updatedNotes = {
        ...journey.stage_notes,
        [stage]: notes
      };
      
      await update(journey.id, {
        stage_notes: updatedNotes
      });
    } catch (err) {
      console.error('Error updating stage notes:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {journey.stages.map((stage, index) => {
          const stageContacts = contacts.filter(contact =>
            contact.journeys?.find(j => j.journey_id === journey.id)?.stage === stage
          );

          return (
            <JourneyStageLayout
              key={stage}
              stageName={stage}
              notes={journey.stage_notes?.[stage] || ''}
              onUpdateNotes={(notes) => handleUpdateStageNotes(stage, notes)}
            >
              <VerticalStage
                stage={stage}
                contacts={stageContacts}
                journeyId={journey.id}
                onAddContact={() => onAddContact(stage)}
                onMoveContact={onMoveContact}
                colorFamily={colorFamily}
                stageIndex={index}
                isLastStage={index === journey.stages.length - 1}
                notes={journey.stage_notes?.[stage] || ''}
                onUpdateNotes={(notes) => handleUpdateStageNotes(stage, notes)}
              />
            </JourneyStageLayout>
          );
        })}
      </div>
    </div>
  );
}