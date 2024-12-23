import React from 'react';
import { Journey, Contact } from '../../types';
import { Users, Clock, TrendingUp } from 'lucide-react';

interface JourneyMetricsProps {
  journey: Journey;
  contactsByStage: Record<string, Contact[]>;
}

export function JourneyMetrics({ journey, contactsByStage }: JourneyMetricsProps) {
  const totalContacts = Object.values(contactsByStage).reduce(
    (sum, contacts) => sum + contacts.length,
    0
  );

  const completedContacts = contactsByStage[journey.stages[journey.stages.length - 1]]?.length || 0;
  const completionRate = totalContacts > 0 ? (completedContacts / totalContacts) * 100 : 0;

  const metrics = [
    {
      label: 'Total Participants',
      value: totalContacts,
      icon: Users,
      color: 'bg-ocean-50 text-ocean-600',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-sage-50 text-sage-600',
    },
    {
      label: 'Active Stages',
      value: journey.stages.length,
      icon: Clock,
      color: 'bg-coral-50 text-coral-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-neutral-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-900">
                {metric.value}
              </p>
            </div>
            <div className={`rounded-full p-3 ${metric.color}`}>
              <metric.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}