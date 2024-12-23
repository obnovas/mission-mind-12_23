import { supabase } from '../../lib/supabase';

export async function cleanupOldData() {
  const { user } = await supabase.auth.getUser();
  if (!user?.id) return;

  try {
    // Use the cleanup_old_data function
    await supabase.rpc('cleanup_old_data', {
      p_user_id: user.id,
      p_days_old: 180
    });
  } catch (err) {
    console.error('Error cleaning up old data:', err);
    // Don't throw error to prevent app initialization failure
  }
}