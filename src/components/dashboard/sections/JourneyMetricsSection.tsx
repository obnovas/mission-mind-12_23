import React from 'react';
import { Journey } from '../../../types';
import { JourneyProgressChart } from '../charts/JourneyProgressChart';
import { Map } from 'lucide-react';

interface JourneyMetricsSectionProps {
  journeys: Journey[];
  journeyProgress: Array<{
    journey: Journey;
    totalParticipants: number;
    stageStats: Array<{ stage: string; count: number }>;
  }>;
}

export function JourneyMetricsSection({ journeys, journeyProgress }: JourneyMetricsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {journeyProgress.map(({ journey, stageStats }) => (
        <div key={journey.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Map className="h-5 w-5 text-ocean-600" />
                <h2 className="nested-card-heading">{journey.name}</h2>
              </div>
              <span className="text-sm text-neutral-500">
                {stageStats.reduce((sum, { count }) => sum + count, 0)} participants
              </span>
            </div>
          </div>
          <div className="p-6">
            <JourneyProgressChart journey={journey} data={stageStats} />
          </div>
        </div>
      ))}
    </div>
  );
}