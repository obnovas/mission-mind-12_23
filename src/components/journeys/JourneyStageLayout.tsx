import React from 'react';
import { StageNotes } from './StageNotes';

interface JourneyStageLayoutProps {
  children: React.ReactNode;
  stageName: string;
  notes: string;
  onUpdateNotes: (notes: string) => void;
}

export function JourneyStageLayout({ 
  children, 
  stageName,
  notes, 
  onUpdateNotes 
}: JourneyStageLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        {children}
      </div>
      <div className="hidden lg:block">
        <StageNotes 
          stageName={stageName}
          notes={notes} 
          onUpdate={onUpdateNotes} 
        />
      </div>
    </div>
  );
}