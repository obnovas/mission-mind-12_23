import React from 'react';
import { Map, Plus, Minus, GripVertical } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useDrag, useDrop } from 'react-dnd';

const MAX_STAGES = 9;

interface DraggableStageProps {
  stage: string;
  index: number;
  moveStage: (dragIndex: number, hoverIndex: number) => void;
  updateStage: (index: number, value: string) => void;
  removeStage: (index: number) => void;
  isRemovable: boolean;
}

const DraggableStage: React.FC<DraggableStageProps> = ({
  stage,
  index,
  moveStage,
  updateStage,
  removeStage,
  isRemovable,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'DEFAULT_STAGE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'DEFAULT_STAGE',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveStage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center space-x-2 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="cursor-move text-neutral-400">
        <GripVertical className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={stage}
        onChange={(e) => updateStage(index, e.target.value)}
        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-accent-500 focus:ring-accent-500"
        placeholder="Stage name"
        required
      />
      {isRemovable && (
        <button
          type="button"
          onClick={() => removeStage(index)}
          className="text-coral-600 hover:text-coral-700"
        >
          <Minus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export function DefaultJourneyStagesSection() {
  const { settings, updateSettings } = useSettingsStore();
  const [stages, setStages] = React.useState<string[]>(
    settings.defaultJourneyStages || [
      'Preparing',
      'First Effort',
      'Recurring Effort',
      'Consistent',
      'Achieved Goal',
      'Completed'
    ]
  );

  const handleAddStage = () => {
    if (stages.length >= MAX_STAGES) return;
    setStages([...stages, '']);
  };

  const handleRemoveStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleUpdateStage = (index: number, value: string) => {
    setStages(stages.map((stage, i) => (i === index ? value : stage)));
  };

  const handleMoveStage = (dragIndex: number, hoverIndex: number) => {
    const newStages = [...stages];
    const dragStage = newStages[dragIndex];
    newStages.splice(dragIndex, 1);
    newStages.splice(hoverIndex, 0, dragStage);
    setStages(newStages);
  };

  const handleSave = () => {
    updateSettings({ defaultJourneyStages: stages });
  };

  const canAddStage = stages.length < MAX_STAGES;

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600">
        Configure the default stages for new journeys. These settings will not affect existing journeys.
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-700">
            Stages (drag to reorder)
          </span>
          <button
            type="button"
            onClick={handleAddStage}
            disabled={!canAddStage}
            className={`inline-flex items-center text-sm ${
              canAddStage 
                ? 'text-accent-600 hover:text-accent-700' 
                : 'text-neutral-400 cursor-not-allowed'
            }`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Stage {`(${stages.length}/${MAX_STAGES})`}
          </button>
        </div>

        <div className="space-y-2">
          {stages.map((stage, index) => (
            <DraggableStage
              key={index}
              stage={stage}
              index={index}
              moveStage={handleMoveStage}
              updateStage={handleUpdateStage}
              removeStage={handleRemoveStage}
              isRemovable={stages.length > 1}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}