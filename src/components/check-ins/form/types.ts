import { CheckIn, Contact, CheckInStatus } from '../../../types';

export interface CheckInFormData {
  date: string;
  time: string;
  notes: string;
  type: 'suggested' | 'planned';
  status: CheckInStatus;
  checkInDate: string;
}

export interface CheckInFormProps {
  contact: Contact;
  checkIn?: CheckIn;
  onSubmit: (data: CheckInFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: Error | null;
}

export interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  checkIn?: CheckIn;
}