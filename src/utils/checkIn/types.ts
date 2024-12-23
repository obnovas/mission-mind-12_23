import { CheckInType, CheckInStatus } from '../../types';

export interface CheckInData {
  contactId: string;
  checkInDate: string;
  notes?: string;
  status: CheckInStatus;
  type: CheckInType;
}

export interface CheckInTypeStyles {
  text: string;
  bg: string;
  border: string;
  hover: string;
}