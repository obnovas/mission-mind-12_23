import { supabase } from '../../lib/supabase';
import { CheckInFrequency } from '../../types';

export async function updateCheckInFrequency(params: {
  contactId: string;
  userId: string;
  newFrequency: CheckInFrequency;
  lastContactDate: string;
}) {
  try {
    const { error } = await supabase.rpc('update_suggested_checkins', {
      p_contact_id: params.contactId,
      p_user_id: params.userId,
      p_new_frequency: params.newFrequency,
      p_last_contact_date: params.lastContactDate
    });

    if (error) throw error;
  } catch (err) {
    console.error('Error updating check-in frequency:', err);
    throw err;
  }
}