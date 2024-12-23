import { addDays, addMonths, addWeeks, addYears, parseISO, isValid, format } from 'date-fns';
import { CheckInFrequency } from '../types';

export function calculateNextCheckInDate(frequency: CheckInFrequency, fromDate = new Date()): Date {
  // Ensure we have a valid date object
  const baseDate = fromDate instanceof Date ? fromDate : new Date(fromDate);
  
  switch (frequency) {
    case 'Daily':
      return addDays(baseDate, 1);
    case 'Weekly':
      return addWeeks(baseDate, 1);
    case 'Monthly':
      return addMonths(baseDate, 1);
    case 'Quarterly':
      return addMonths(baseDate, 3);
    case 'Yearly':
      return addYears(baseDate, 1);
    default:
      return addMonths(baseDate, 1);
  }
}

export function formatDate(dateString: string | null | undefined, formatStr = 'MMM d, yyyy'): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'N/A';
    return format(date, formatStr);
  } catch {
    return 'N/A';
  }
}

export function formatShortDate(dateString: string | null | undefined): string {
  return formatDate(dateString, 'MMM d');
}

export function ensureValidDate(dateString: string | null | undefined): string {
  if (!dateString) return new Date().toISOString();
  
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date.toISOString() : new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function isValidDateString(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
}