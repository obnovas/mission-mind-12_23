import { supabase } from '../../lib/supabase';
import { Contact } from '../../types';
import { validateContact } from './validation';
import { validateApiKey } from '../auth/apiKey';
import { ContactResponse, ContactsResponse } from './types';

export async function getContacts(apiKey: string): Promise<ContactsResponse> {
  try {
    const user = await validateApiKey(apiKey);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: { message: err.message }
    };
  }
}

export async function getContact(apiKey: string, id: string): Promise<ContactResponse> {
  try {
    const user = await validateApiKey(apiKey);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: { message: err.message }
    };
  }
}

export async function createContact(
  apiKey: string, 
  contact: Omit<Contact, 'id' | 'user_id'>
): Promise<ContactResponse> {
  try {
    const validationError = validateContact(contact);
    if (validationError) {
      throw new Error(validationError);
    }

    const user = await validateApiKey(apiKey);
    const { data, error } = await supabase
      .from('contacts')
      .insert({ ...contact, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: { message: err.message }
    };
  }
}

export async function updateContact(
  apiKey: string, 
  id: string, 
  updates: Partial<Contact>
): Promise<ContactResponse> {
  try {
    const validationError = validateContact(updates);
    if (validationError) {
      throw new Error(validationError);
    }

    const user = await validateApiKey(apiKey);
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('user_id', user.id)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: { message: err.message }
    };
  }
}

export async function deleteContact(apiKey: string, id: string): Promise<ContactResponse> {
  try {
    const user = await validateApiKey(apiKey);
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('user_id', user.id)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: { message: err.message }
    };
  }
}