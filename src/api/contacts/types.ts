import { Contact } from '../../types';

export interface ContactResponse {
  success: boolean;
  data?: Contact;
  error?: {
    message: string;
  };
}

export interface ContactsResponse {
  success: boolean;
  data?: Contact[];
  error?: {
    message: string;
  };
}