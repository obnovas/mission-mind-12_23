import { supabase } from '../supabase';
import { Contact, Journey, PrayerRequest, NetworkGroup } from '../../types';

// Contacts
export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      contact_journeys (
        journey_id,
        stage,
        notes,
        started_at,
        updated_at,
        journeys (
          name
        )
      )
    `)
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function createContact(contact: Omit<Contact, 'id' | 'userId'>) {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateContact(id: string, contact: Partial<Contact>) {
  const { data, error } = await supabase
    .from('contacts')
    .update(contact)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Journeys
export async function getJourneys() {
  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function createJourney(journey: Omit<Journey, 'id' | 'userId'>) {
  const { data, error } = await supabase
    .from('journeys')
    .insert(journey)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateJourney(id: string, journey: Partial<Journey>) {
  const { data, error } = await supabase
    .from('journeys')
    .update(journey)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteJourney(id: string) {
  const { error } = await supabase
    .from('journeys')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Prayer Requests
export async function getPrayerRequests() {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select(`
      *,
      contacts (
        name,
        email
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createPrayerRequest(request: Omit<PrayerRequest, 'id' | 'userId'>) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .insert(request)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePrayerRequest(id: string, request: Partial<PrayerRequest>) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .update(request)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deletePrayerRequest(id: string) {
  const { error } = await supabase
    .from('prayer_requests')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Network Groups
export async function getNetworkGroups() {
  const { data, error } = await supabase
    .from('network_groups')
    .select(`
      *,
      network_group_members (
        contact_id,
        contacts (
          name,
          email
        )
      )
    `)
    .order('name');
  
  if (error) throw error;
  return data;
}

export async function createNetworkGroup(group: Omit<NetworkGroup, 'id' | 'userId'>) {
  const { data, error } = await supabase
    .from('network_groups')
    .insert(group)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateNetworkGroup(id: string, group: Partial<NetworkGroup>) {
  const { data, error } = await supabase
    .from('network_groups')
    .update(group)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteNetworkGroup(id: string) {
  const { error } = await supabase
    .from('network_groups')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}