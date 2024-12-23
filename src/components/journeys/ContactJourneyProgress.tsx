import React from 'react';
import { Contact, Journey, ContactJourney } from '../../types';
import { Map, Clock, Edit2, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { formatDate, isValidDateString } from '../../utils/dates';
import { JourneyProgressBar } from '../contacts/journey/JourneyProgressBar';
import { useContactJourneyStore } from '../../store/contactJourneyStore';
import { useContactStore } from '../../store/contactStore';

interface ContactJourneyProgressProps {
  contact: Contact;
  journey: Journey;
  contactJourney: ContactJourney;
  onRemove: (journeyId: string) => void;
}

export function ContactJourneyProgress({
  contact,
  journey,
  contactJourney,
  onRemove,
}: ContactJourneyProgressProps) {
  const [isEditingNotes, setIsEditingNotes] = React.useState(false);
  const [notes, setNotes] = React.useState(contactJourney.notes || '');
  const { updateJourneyStage, updateJourneyNotes } = useContactJourneyStore();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleStageChange = async (newStage: string) => {
    try {
      setIsUpdating(true);
      setError(null);

      await updateJourneyStage({
        contactId: contact.id,
        journeyId: journey.id,
        stage: newStage,
      });

      await useContactStore.getState().fetch();
    } catch (err) {
      console.error('Error updating stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to update stage');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      setError(null);

      await updateJourneyNotes({
        contactId: contact.id,
        journeyId: journey.id,
        notes,
      });

      await useContactStore.getState().fetch();
      setIsEditingNotes(false);
    } catch (err) {
      console.error('Error updating notes:', err);
      setError(err instanceof Error ? err.message : 'Failed to update notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const startDate = isValidDateString(contactJourney.started_at) 
    ? formatDate(contactJourney.started_at) 
    : 'N/A';

  return (
    <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-ocean-500 overflow-hidden">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="p-4 sm:p-6 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-ocean-600" />
              <h2 className="text-lg font-semibold text-neutral-900">{journey.name}</h2>
            </div>
            <p className="mt-1 text-sm text-neutral-600">{journey.description}</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="flex items-center text-sm text-neutral-500">
              <Clock className="h-4 w-4 mr-1" />
              <span className="whitespace-nowrap">Started {startDate}</span>
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
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Progress Bar */}
        <div className={isUpdating ? 'opacity-50 pointer-events-none' : ''}>
          <div className="w-full">
            <JourneyProgressBar
              stages={journey.stages}
              currentStage={contactJourney.stage}
              onStageChange={handleStageChange}
              isEditable={!isUpdating}
            />
          </div>
        </div>

        {/* Journey Notes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-neutral-900">Journey Notes</h3>
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-accent-600 hover:text-accent-700 transition-colors duration-200"
              disabled={isUpdating}
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
            <p className="text-sm text-neutral-600 break-words">
              {contactJourney.notes || 'No notes added yet.'}
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
        <div className="flex items-end sm:items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white w-full sm:max-w-lg sm:rounded-lg mx-auto sm:mx-4">
            <div className="p-4 sm:p-6">
              <Dialog.Title className="text-lg font-medium text-neutral-900 mb-4">
                Edit Journey Notes
              </Dialog.Title>

              <form onSubmit={handleNotesSubmit}>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                  disabled={isUpdating}
                />

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(false)}
                    disabled={isUpdating}
                    className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}