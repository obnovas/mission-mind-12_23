import { format, parseISO, isValid } from 'date-fns';

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Not scheduled';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Not scheduled';
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Not scheduled';
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Not scheduled';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Not scheduled';
    return format(date, 'MMM d, yyyy h:mm a');
  } catch {
    return 'Not scheduled';
  }
}