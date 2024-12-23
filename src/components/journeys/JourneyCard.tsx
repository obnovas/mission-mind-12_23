import React from 'react';
import { Journey } from '../../types';
import { Map, Users, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface JourneyCardProps {
  journey: Journey;
  onEdit: (journey: Journey) => void;
  contactCount: number;
  colorFamily: {
    bg: string;
    border: string;
    text: string;
  };
}

export function JourneyCard({ journey, onEdit, contactCount, colorFamily }: JourneyCardProps) {
  const navigate = useNavigate();
  
  return (
    <div 
      className={`bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${colorFamily.border}`}
    >
      <div className={`p-4 sm:p-6 ${colorFamily.bg} border-b border-neutral-200`}>
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <Map className={`h-5 w-5 ${colorFamily.text}`} />
              <h3 className="text-lg font-semibold text-neutral-900">{journey.name}</h3>
            </div>
            <p className="text-sm text-neutral-600">{journey.description}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(journey);
            }}
            className="p-2 rounded-full hover:bg-white/50 text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-neutral-500" />
            <span className="text-sm text-neutral-600">{contactCount} participants</span>
          </div>
          <span className="text-xs text-neutral-500">
            Created {format(new Date(journey.created_at), 'MMM d, yyyy')}
          </span>
        </div>

        <div className="space-y-2">
          {journey.stages.map((stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${
                  index === 0 ? colorFamily.text : 'bg-neutral-300'
                }`}
              />
              <span className="text-sm text-neutral-600">{stage}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate(`/journeys/${journey.id}`)}
          className={`mt-4 w-full px-4 py-2 text-sm font-medium rounded-md border border-transparent ${colorFamily.bg} ${colorFamily.text} hover:bg-opacity-75 transition-colors duration-200`}
        >
          View Journey
        </button>
      </div>
    </div>
  );
}