import { CheckInStatus, CheckInType } from '../../types';

export function determineCheckInStatus(checkInDate: string): CheckInStatus {
  const checkInTime = new Date(checkInDate);
  const now = new Date();
  
  // Set both dates to start of day for comparison
  checkInTime.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  if (checkInTime < now) {
    return 'Missed';
  } else if (checkInTime.getTime() === now.getTime()) {
    return 'Completed';
  } else {
    return 'Scheduled';
  }
}

export function canCompleteCheckIn(checkInDate: string): boolean {
  const checkInTime = new Date(checkInDate);
  const now = new Date();
  
  // Can complete if date is today or in past
  checkInTime.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  return checkInTime <= now;
}

export function getCheckInTypeStyles(type: CheckInType) {
  return {
    text: type === 'planned' ? 'font-medium' : 'font-normal text-neutral-500',
    bg: type === 'planned' ? 'bg-white' : 'bg-neutral-50',
    border: type === 'planned' ? 'border-neutral-200' : 'border-neutral-100',
    hover: type === 'planned' ? 'hover:border-accent-300' : 'hover:border-neutral-200'
  };
}