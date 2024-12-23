import React from 'react';
import { Journey } from '../../types';
import { useNavigate } from 'react-router-dom';

interface JourneySummaryProps {
  journey: Journey;
  totalParticipants: number;
  stageStats: Array<{ stage: string; count: number }>;
}

export function JourneySummary({ journey, totalParticipants, stageStats }: JourneySummaryProps) {
  const navigate = useNavigate();
  const maxCount = Math.max(...stageStats.map(s => s.count));

  return (
    <div 
      className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-accent-300 transition-colors duration-200 cursor-pointer"
      onClick={() => navigate(`/journeys/${journey.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium text-gray-900">{journey.name}</h4>
          <p className="text-sm text-gray-500">{totalParticipants} participants</p>
        </div>
      </div>
      <div className="space-y-2">
        {stageStats.map(({ stage, count }) => (
          <div key={stage} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{stage}</span>
              <span className="text-gray-900">{count}</span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-600 rounded-full transition-all duration-500"
                style={{
                  width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}