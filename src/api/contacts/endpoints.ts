import { supabase } from '../../lib/supabase';
import { Contact } from '../../types';
import { validateApiKey } from '../auth/apiKey';

export async function getContacts(apiKey: string) {
  try {
    const user = await validateApiKey(apiKey);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  } catch (err) {
    throw new Error(`Failed to get contacts: ${err.message}`);
  }
}

export async function getContact(apiKey: string, id: string) {
  try {
    const user = await validateApiKey(apiKey);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw new Error(`Failed to get contact: ${err.message}`);
  }
}

export async function createContact(apiKey: string, contact: Omit<Contact, 'id' | 'user_id'>) {
  try {
    const user = await validateApiKey(apiKey);
    const { data, error } = await supabase
      .from('contacts')
      .insert({ ...contact, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw new Error(`Failed to create contact: ${err.message}`);
  }
}

export async function updateContact(apiKey: string, id: string, updates: Partial<Contact>) {
  try {
    const user = await validateApiKey(apiKey);
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('user_id', user.id)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw new Error(`Failed to update contact: ${err.message}`);
  }
}

export async function deleteContact(apiKey: string, id: string) {
  try {
    const user = await validateApiKey(apiKey);
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('user_id', user.id)
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    throw new Error(`Failed to delete contact: ${err.message}`);
  }
}