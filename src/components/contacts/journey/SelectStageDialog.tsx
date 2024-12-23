import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Journey } from '../../../types';
import { useContactJourneyStore } from '../../../store/contactJourneyStore';
import { useContactStore } from '../../../store/contactStore';

interface SelectStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  journey: Journey;
  contactId: string;
}

export function SelectStageDialog({
  isOpen,
  onClose,
  journey,
  contactId,
}: SelectStageDialogProps) {
  const [selectedStage, setSelectedStage] = React.useState(journey.stages[0]);
  const [notes, setNotes] = React.useState('');
  const { loading, error, addContactToJourney } = useContactJourneyStore();
  const { fetch: refreshContacts } = useContactStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addContactToJourney({
        contactId,
        journeyId: journey.id,
        stage: selectedStage,
        notes: notes.trim() || undefined,
      });

      // Immediately refresh contacts data to show the update
      await refreshContacts();
      
      // Reset form and close dialog
      setSelectedStage(journey.stages[0]);
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Error adding contact to journey:', err);
    }
  };

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedStage(journey.stages[0]);
      setNotes('');
    }
  }, [isOpen, journey.stages]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              Select Initial Stage
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Stage
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                required
              >
                {journey.stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                placeholder="Add any notes about starting this journey..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Start Journey'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}