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
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Map className="h-6 w-6 text-accent-600 mr-2" />
          <h2 className="text-xl font-semibold text-neutral-900">{journey.name}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-neutral-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Started {format(new Date(contact.lastContactDate), 'MMM d, yyyy')}</span>
          </div>
          <button
            onClick={() => onRemove(journey.id)}
            className="text-neutral-400 hover:text-coral-600 transition-colors duration-200"
            title="Remove from journey"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-neutral-600">{journey.description}</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Journey Progress</h3>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="h-0.5 w-full bg-neutral-200"></div>
            </div>
            <div className="relative flex justify-between">
              {journey.stages.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                
                return (
                  <button
                    key={stage}
                    onClick={() => onStageChange(stage)}
                    className={`flex flex-col items-center ${
                      isCompleted || isCurrent ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                        isCompleted
                          ? 'bg-accent-600 border-accent-600'
                          : isCurrent
                          ? 'bg-white border-accent-600'
                          : 'bg-white border-neutral-300'
                      }`}
                    >
                      {isCompleted && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm ${
                        isCompleted || isCurrent
                          ? 'text-accent-600 font-medium'
                          : 'text-neutral-500'
                      }`}
                    >
                      {stage}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Next Check-in</h3>
            <button
              onClick={() => setIsEditingCheckIn(true)}
              className="text-accent-600 hover:text-accent-700 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 flex items-center">
            <Calendar className="h-5 w-5 text-accent-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {format(new Date(contact.nextContactDate), 'MMMM d, yyyy')}
              </p>
              <p className="text-sm text-neutral-500">
                Frequency: {contact.checkInFrequency}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Journey Notes</h3>
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-accent-600 hover:text-accent-700 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
            <p className="text-sm text-neutral-600">
              {contact.notes || 'No notes added yet.'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Notes Dialog */}
      <Dialog
        open={isEditingNotes}
        onClose={() => setIsEditingNotes(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-neutral-900 mb-4">
              Edit Journey Notes
            </Dialog.Title>

            <form onSubmit={handleNotesSubmit}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              />

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Edit Check-in Dialog */}
      <Dialog
        open={isEditingCheckIn}
        onClose={() => setIsEditingCheckIn(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-neutral-900 mb-4">
              Edit Next Check-in Date
            </Dialog.Title>

            <form onSubmit={handleCheckInSubmit}>
              <input
                type="date"
                value={checkInDate.split('T')[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              />

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditingCheckIn(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200"
                >
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}