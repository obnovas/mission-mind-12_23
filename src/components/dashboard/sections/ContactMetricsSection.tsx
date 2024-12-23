import React from 'react';
import { Contact } from '../../../types';
import { JourneyDistributionChart } from '../charts/JourneyDistributionChart';
import { CheckInActivityChart } from '../charts/CheckInActivityChart';
import { PieChart, LineChart } from 'lucide-react';

interface ContactMetricsSectionProps {
  contacts: Contact[];
}

export function ContactMetricsSection({ contacts }: ContactMetricsSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-4">
          <PieChart className="h-5 w-5 text-sage-500 mr-2" />
          <h2 className="nested-card-heading">Journey Distribution</h2>
        </div>
        <JourneyDistributionChart contacts={contacts} />
      </div>

      <div>
        <div className="flex items-center mb-4">
          <LineChart className="h-5 w-5 text-sage-500 mr-2" />
          <h2 className="nested-card-heading">Check-in Activity (30 Days)</h2>
        </div>
        <CheckInActivityChart contacts={contacts} />
      </div>
    </div>
  );
}