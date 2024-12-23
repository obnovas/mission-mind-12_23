import React from 'react';
import { Contact, Journey } from '../../types';
import { format } from 'date-fns';
import { Map, Clock, Calendar, Edit2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface ContactJourneyViewProps {
  contact: Contact;
  journey: Journey;
  onStageChange: (newStage: string) => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateCheckIn: (date: string) => void;
  onRemove: (journeyId: string) => void;
}

export function ContactJourneyView({
  contact,
  journey,
  onStageChange,
  onUpdateNotes,
  onUpdateCheckIn,
  onRemove,
}: ContactJourneyViewProps) {
  const [isEditingNotes, setIsEditingNotes] = React.useState(false);
  const [notes, setNotes] = React.useState(contact.notes || '');
  const [isEditingCheckIn, setIsEditingCheckIn] = React.useState(false);
  const [checkInDate, setCheckInDate] = React.useState(contact.nextContactDate);

  const currentStageIndex = journey.stages.findIndex(
    (stage) => stage === contact.journeyStage
  );

  const handleNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNotes(notes);
    setIsEditingNotes(false);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCheckIn(checkInDate);
    setIsEditingCheckIn(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Map className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">{journey.name}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Started {format(new Date(contact.lastContactDate), 'MMM d, yyyy')}</span>
          </div>
          <button
            onClick={() => onRemove(journey.id)}
            className="text-gray-400 hover:text-red-600"
            title="Remove from journey"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-gray-600">{journey.description}</p>
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
}