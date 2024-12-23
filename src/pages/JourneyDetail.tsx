import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJourneyStore } from '../store/journeyStore';
import { useContactStore } from '../store/contactStore';
import { VerticalJourneyBoard } from '../components/journeys/vertical';
import { JourneyMetrics } from '../components/journeys/JourneyMetrics';
import { JourneyForm } from '../components/journeys/JourneyForm';
import { AddContactToJourneyDialog } from '../components/journeys/AddContactToJourneyDialog';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { journeyColorFamilies } from '../components/journeys/constants';

export function JourneyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isAddingContact, setIsAddingContact] = React.useState(false);
  const [selectedStage, setSelectedStage] = React.useState<string | null>(null);
  
  const { items: journeys, updateContactStage } = useJourneyStore();
  const { items: contacts } = useContactStore();

  const journey = journeys.find(j => j.id === id);
  if (!journey) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Journey not found.</p>
      </div>
    );
  }

  const journeyContacts = contacts.filter(contact =>
    contact.journeys?.some(j => j.journey_id === journey.id)
  );

  const handleAddContact = (stage: string) => {
    setSelectedStage(stage);
    setIsAddingContact(true);
  };

  const handleMoveContact = async (contactId: string, toStage: string) => {
    try {
      await updateContactStage(journey.id, contactId, toStage);
    } catch (err) {
      console.error('Error moving contact:', err);
    }
  };

  const colorFamily = journeyColorFamilies[0]; // Use first color family for consistency

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/journeys')}
            className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{journey.name}</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Created {format(new Date(journey.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="text-accent-600 hover:text-accent-700 transition-colors duration-200"
          title="Edit Journey"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>

      <JourneyMetrics 
        journey={journey} 
        contactsByStage={journey.stages.reduce((acc, stage) => {
          acc[stage] = journeyContacts.filter(contact =>
            contact.journeys?.find(j => j.journey_id === journey.id)?.stage === stage
          );
          return acc;
        }, {} as Record<string, typeof contacts>)}
      />

      <VerticalJourneyBoard
        journey={journey}
        contacts={journeyContacts}
        onAddContact={handleAddContact}
        onMoveContact={handleMoveContact}
        colorFamily={colorFamily}
      />

      <JourneyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        journey={journey}
      />

      {selectedStage && (
        <AddContactToJourneyDialog
          isOpen={isAddingContact}
          onClose={() => {
            setIsAddingContact(false);
            setSelectedStage(null);
          }}
          journey={journey}
          contacts={contacts}
          onAddContact={async (contactId) => {
            await handleMoveContact(contactId, selectedStage);
          }}
          existingContactIds={journeyContacts.map(c => c.id)}
        />
      )}
    </div>
  );
}