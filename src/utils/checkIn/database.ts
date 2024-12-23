import { supabase } from '../../lib/supabase';
import { CheckIn, CheckInStatus, CheckInType } from '../../types';

export async function createCheckIn(params: {
  userId: string;
  contactId: string;
  checkInDate: string;
  notes?: string;
  status: CheckInStatus;
  type: CheckInType;
}): Promise<CheckIn> {
  const { data, error } = await supabase
    .from('check_ins')
    .insert({
      user_id: params.userId,
      contact_id: params.contactId,
      check_in_date: new Date(params.checkInDate).toISOString(),
      check_in_notes: params.notes,
      status: params.status,
      check_in_type: params.type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCheckIn(params: {
  userId: string;
  checkInId: string;
  updates: Partial<{
    check_in_date: string;
    check_in_notes: string;
    status: CheckInStatus;
    check_in_type: CheckInType;
  }>;
}): Promise<CheckIn> {
  const { data, error } = await supabase
    .from('check_ins')
    .update({
      ...params.updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.checkInId)
    .eq('user_id', params.userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function convertCheckInType(params: {
  userId: string;
  checkInId: string;
  newType: CheckInType;
}): Promise<void> {
  const { error } = await supabase.rpc('convert_check_in_type', {
    p_check_in_id: params.checkInId,
    p_user_id: params.userId,
    p_new_type: params.newType
  });

  if (error) throw error;
}