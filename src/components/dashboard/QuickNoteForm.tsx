import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Contact } from '../../types';
import { useContactStore } from '../../store/contactStore';

interface QuickNoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
}

export function QuickNoteForm({ isOpen, onClose, contact }: QuickNoteFormProps) {
  const [note, setNote] = React.useState('');
  const { update } = useContactStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      await update(contact.id, {
        notes: contact.notes 
          ? `${contact.notes}\n\n${note}`
          : note,
        updated_at: new Date().toISOString(),
      });

      onClose();
      setNote('');
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4">
          <div className="bg-sage-50 rounded-t-lg border-b border-neutral-200 p-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-neutral-900">
                Add Note for {contact.name}
              </Dialog.Title>
              <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                placeholder="Enter your note..."
                required
                autoFocus
              />
            </div>

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
                disabled={!note.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}