import React from 'react';
import { Edit2 } from 'lucide-react';

interface StageNotesProps {
  stageName: string;
  notes: string;
  onUpdate: (notes: string) => void;
}

export function StageNotes({ stageName, notes, onUpdate }: StageNotesProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localNotes, setLocalNotes] = React.useState(notes);

  const handleSubmit = () => {
    onUpdate(localNotes);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200">
      {/* Stage Header */}
      <div className="p-3 border-b border-neutral-200 bg-neutral-50">
        <h3 className="text-sm font-medium text-neutral-900">{`${stageName} Stage Notes`}</h3>
      </div>

      {/* Notes Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 text-sm"
              rows={4}
              placeholder={`Add notes about the ${stageName} stage...`}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 text-sm text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-2 py-1 text-sm text-accent-600 hover:text-accent-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="group relative min-h-[100px] text-sm text-neutral-600 hover:bg-neutral-50 rounded p-2 transition-colors duration-200 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {notes || `Add notes for ${stageName} stage...`}
            <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Edit2 className="h-3 w-3 text-neutral-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}