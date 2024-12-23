import { CheckInFrequency } from '../../types';

export function validateCheckInFrequency(frequency: string): frequency is CheckInFrequency {
  return ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].includes(frequency);
}

export function getDefaultCheckInFrequency(): CheckInFrequency {
  return 'Monthly';
}