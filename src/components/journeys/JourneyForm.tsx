import React from 'react';
import { Dialog } from '@headlessui/react';
import { Journey } from '../../types';
import { X, Plus, Minus, GripVertical } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';
import { useSettingsStore } from '../../store/settingsStore';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { JourneyTemplates } from './JourneyTemplates';

const MAX_STAGES = 9;

interface JourneyFormProps {
  isOpen: boolean;
  onClose: () => void;
  journey?: Journey;
}

export function JourneyForm({ isOpen, onClose, journey }: JourneyFormProps) {
  const [formData, setFormData] = React.useState<Partial<Journey>>({
    name: '',
    description: '',
    stages: [],
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const { loading, error, add, update, remove } = useJourneyStore();
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    if (isOpen) {
      setFormData(journey || {
        name: '',
        description: '',
        stages: settings.defaultJourneyStages,
      });
    }
  }, [isOpen, journey, settings.defaultJourneyStages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (journey) {
        await update(journey.id, {
          ...formData,
          updated_at: new Date().toISOString(),
        });
      } else {
        await add({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      onClose();
    } catch (err) {
      console.error('Error saving journey:', err);
    }
  };

  const handleDelete = async () => {
    if (!journey) return;
    try {
      await remove(journey.id);
      onClose();
    } catch (err) {
      console.error('Error deleting journey:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addStage = () => {
    if (!formData.stages || formData.stages.length >= MAX_STAGES) return;
    setFormData((prev) => ({
      ...prev,
      stages: [...(prev.stages || []), ''],
    }));
  };

  const removeStage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages?.filter((_, i) => i !== index),
    }));
  };

  const updateStage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stages: prev.stages?.map((stage, i) => (i === index ? value : stage)),
    }));
  };

  const handleTemplateSelect = (template: { stages: string[] }) => {
    setFormData(prev => ({
      ...prev,
      stages: [...template.stages]
    }));
  };

  const canAddStage = formData.stages ? formData.stages.length < MAX_STAGES : true;

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4">
            <div className="bg-ocean-50 rounded-t-lg border-b border-neutral-200 p-6">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-xl font-semibold text-neutral-900">
                  {journey ? 'Edit Journey' : 'Create Journey'}
                </Dialog.Title>
                <div className="flex items-center space-x-2">
                  {journey && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-2 text-coral-600 hover:text-coral-700 rounded-full hover:bg-white/50"
                      title="Delete Journey"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                        {error.message}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-neutral-700">
                          Stages
                        </label>
                        <button
                          type="button"
                          onClick={addStage}
                          disabled={!canAddStage}
                          className={`inline-flex items-center text-sm ${
                            canAddStage 
                              ? 'text-accent-600 hover:text-accent-700' 
                              : 'text-neutral-400 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Stage {formData.stages && `(${formData.stages.length}/${MAX_STAGES})`}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.stages?.map((stage, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <GripVertical className="h-4 w-4 text-neutral-400 cursor-move" />
                            <input
                              type="text"
                              value={stage}
                              onChange={(e) => updateStage(index, e.target.value)}
                              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
                              placeholder="Stage name"
                              required
                            />
                            {formData.stages!.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStage(index)}
                                className="text-coral-600 hover:text-coral-700"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : journey ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="border-l border-neutral-200 pl-6">
                  <JourneyTemplates 
                    onSelect={handleTemplateSelect}
                    disabled={journey?.id !== undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Journey"
        message={
          <>
            Are you sure you want to delete <strong>{journey?.name}</strong>? This action cannot be undone and will remove all associated contact progress data.
          </>
        }
        confirmLabel="Delete Journey"
        cancelLabel="Cancel"
        type="danger"
      />
    </>
  );
}