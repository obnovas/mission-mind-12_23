import { CheckInType, CheckInStatus } from '../../types';

export function validateCheckInType(type: string): type is CheckInType {
  return ['suggested', 'planned'].includes(type);
}

export function validateCheckInStatus(status: string): status is CheckInStatus {
  return ['Scheduled', 'Completed', 'Missed'].includes(status);
}

export function validateCheckInDate(date: string): boolean {
  const checkInDate = new Date(date);
  return !isNaN(checkInDate.getTime());
}