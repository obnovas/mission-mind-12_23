import { parseISO, isValid } from 'date-fns';

export function isValidDateString(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
}

export function isDateInFuture(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return date > new Date();
  } catch {
    return false;
  }
}

export function isDateInPast(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return date < new Date();
  } catch {
    return false;
  }
}