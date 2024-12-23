import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Search } from 'lucide-react';
import { Journey } from '../../../types';
import { useJourneyStore } from '../../../store/journeyStore';

interface SelectJourneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (journey: Journey) => void;
  existingJourneyIds: string[];
}

export function SelectJourneyDialog({
  isOpen,
  onClose,
  onSelect,
  existingJourneyIds,
}: SelectJourneyDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const journeys = useJourneyStore((state) => state.items);

  // Filter out journeys the contact is already part of
  const availableJourneys = journeys.filter(
    journey => !existingJourneyIds.includes(journey.id) &&
    journey.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Select Journey
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 sm:text-sm"
                placeholder="Search journeys..."
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableJourneys.map((journey) => (
              <button
                key={journey.id}
                onClick={() => onSelect(journey)}
                className="w-full text-left p-4 rounded-lg border border-neutral-200 hover:border-accent-300 bg-white transition-colors duration-200"
              >
                <h3 className="font-medium text-neutral-900">{journey.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{journey.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {journey.stages.map((stage, index) => (
                    <span
                      key={stage}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        index === 0 ? 'bg-accent-100 text-accent-800' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            {availableJourneys.length === 0 && (
              <div className="text-center py-4 text-neutral-500">
                No available journeys found
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}