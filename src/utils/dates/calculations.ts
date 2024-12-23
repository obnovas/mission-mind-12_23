import { addDays, addMonths, addWeeks, addYears } from 'date-fns';
import { CheckInFrequency } from '../../types';

export function calculateNextCheckInDate(frequency: CheckInFrequency, fromDate = new Date()): Date | null {
  const baseDate = fromDate instanceof Date ? fromDate : new Date(fromDate);
  const now = new Date();
  let nextDate: Date;
  
  switch (frequency) {
    case 'Daily':
      nextDate = addDays(baseDate, 1);
      break;
    case 'Weekly':
      nextDate = addWeeks(baseDate, 1);
      break;
    case 'Monthly':
      nextDate = addMonths(baseDate, 1);
      break;
    case 'Quarterly':
      nextDate = addMonths(baseDate, 3);
      break;
    case 'Yearly':
      nextDate = addYears(baseDate, 1);
      break;
    default:
      nextDate = addMonths(baseDate, 1);
  }

  // If calculated next date is in the past, return null
  return nextDate > now ? nextDate : null;
}