import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface StageNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stageName: string;
  notes: string;
  onUpdate: (notes: string) => void;
}

export function StageNotesDialog({
  isOpen,
  onClose,
  stageName,
  notes,
  onUpdate,
}: StageNotesDialogProps) {
  const [localNotes, setLocalNotes] = React.useState(notes);

  React.useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(localNotes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg w-full max-w-md">
          <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                {`${stageName} Stage Notes`}
              </Dialog.Title>
              <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
              rows={6}
              placeholder={`Add notes for ${stageName} stage...`}
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700"
              >
                Save Notes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}