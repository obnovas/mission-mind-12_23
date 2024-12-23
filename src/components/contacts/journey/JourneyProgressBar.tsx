import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import clsx from 'clsx';

interface JourneyProgressBarProps {
  stages: string[];
  currentStage: string;
  onStageChange: (stage: string) => void;
  isEditable?: boolean;
}

export function JourneyProgressBar({
  stages,
  currentStage,
  onStageChange,
  isEditable = true,
}: JourneyProgressBarProps) {
  const currentIndex = stages.findIndex(stage => stage === currentStage);

  // Mobile dropdown view
  const renderMobileView = () => (
    <div className="w-full">
      <select
        value={currentStage}
        onChange={(e) => isEditable && onStageChange(e.target.value)}
        disabled={!isEditable}
        className={clsx(
          "w-full rounded-md border-neutral-300 shadow-sm",
          "focus:border-accent-500 focus:ring-accent-500",
          "disabled:opacity-50 disabled:bg-neutral-50",
          "text-sm"
        )}
      >
        {stages.map((stage, index) => (
          <option 
            key={stage} 
            value={stage}
            disabled={isEditable && index > currentIndex + 1}
          >
            {stage}
            {index < currentIndex && " ✓"}
          </option>
        ))}
      </select>
      <div className="mt-2 h-1 w-full bg-neutral-200 rounded">
        <div
          className="h-1 bg-accent-600 rounded transition-all duration-500"
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  // Desktop progress bar view
  const renderDesktopView = () => (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="h-0.5 w-full bg-neutral-200">
          <div
            className="h-0.5 bg-accent-600 transition-all duration-500"
            style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative flex justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = isEditable && (isCompleted || index <= currentIndex + 1);
          
          return (
            <button
              key={stage}
              onClick={() => isClickable && onStageChange(stage)}
              disabled={!isClickable}
              className={clsx(
                'flex flex-col items-center',
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
              )}
            >
              <div className="flex h-8 items-center">
                <div
                  className={clsx(
                    'rounded-full border-2 p-1 transition-colors duration-200',
                    isCompleted ? 'bg-accent-600 border-accent-600' :
                    isCurrent ? 'bg-honey-300 border-honey-400' :
                    'bg-white border-neutral-300'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className={clsx(
                      'h-4 w-4',
                      isCurrent ? 'text-honey-500' : 'text-neutral-300'
                    )} />
                  )}
                </div>
              </div>
              <span
                className={clsx(
                  'mt-2 text-sm whitespace-nowrap transition-colors duration-200',
                  isCompleted ? 'text-accent-600 font-medium' :
                  isCurrent ? 'text-honey-600 font-medium' :
                  'text-neutral-500'
                )}
              >
                {stage}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        {renderMobileView()}
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block">
        {renderDesktopView()}
      </div>
    </>
  );
}