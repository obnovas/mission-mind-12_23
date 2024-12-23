import { Journey } from '../../../types';
import { format } from 'date-fns';
import { formatJourneyData } from './formatters';

export function generateJourneysCsv(journeys: Journey[]): string {
  const rows = journeys.map(journey => ({
    name: journey.name,
    description: journey.description,
    stages: journey.stages.join(';'),
    created_at: format(new Date(journey.created_at), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(journey.updated_at), 'yyyy-MM-dd HH:mm:ss'),
  }));

  return formatJourneyData(rows);
}