import React from 'react';
import { Dialog } from '@headlessui/react';
import { Contact, Journey } from '../../types';
import { X, Search } from 'lucide-react';

interface AddJourneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (journeyId: string, initialStage: string) => void;
  contact: Contact;
  journeys: Journey[];
  existingJourneyIds: string[];
}

export function AddJourneyDialog({
  isOpen,
  onClose,
  onAdd,
  contact,
  journeys,
  existingJourneyIds,
}: AddJourneyDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedJourney, setSelectedJourney] = React.useState('');
  const [selectedStage, setSelectedStage] = React.useState('');

  const filteredJourneys = journeys.filter(
    (journey) =>
      !existingJourneyIds.includes(journey.id) &&
      journey.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJourney && selectedStage) {
      onAdd(selectedJourney, selectedStage);
      setSelectedJourney('');
      setSelectedStage('');
      setSearchQuery('');
      onClose();
    }
  };

  const currentJourney = journeys.find((j) => j.id === selectedJourney);

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
              Add {contact.name} to Journey
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Journeys
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search journeys..."
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
              {filteredJourneys.map((journey) => (
                <label
                  key={journey.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="journey"
                    value={journey.id}
                    checked={selectedJourney === journey.id}
                    onChange={(e) => {
                      setSelectedJourney(e.target.value);
                      setSelectedStage('');
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {journey.name}
                    </p>
                    <p className="text-sm text-gray-500">{journey.description}</p>
                  </div>
                </label>
              ))}
              {filteredJourneys.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  No available journeys found
                </div>
              )}
            </div>

            {selectedJourney && currentJourney && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a stage</option>
                  {currentJourney.stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedJourney || !selectedStage}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add to Journey
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}