import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useCheckInStore } from '../../store/checkInStore';

// Keep track of the last update time to prevent redundant updates
let lastUpdateTime: number | null = null;
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export async function updatePastScheduledCheckIns() {
  const { user } = useAuthStore.getState();
  if (!user) return;

  // Skip if last update was recent
  const now = Date.now();
  if (lastUpdateTime && now - lastUpdateTime < UPDATE_INTERVAL) {
    return;
  }

  try {
    // Use a single efficient query to update status
    const { error } = await supabase.rpc(
      'update_past_scheduled_checkins',
      {
        p_user_id: user.id,
        p_current_time: new Date().toISOString()
      }
    );

    if (error) {
      console.error('Error calling update function:', error);
      return;
    }

    // Update last update time
    lastUpdateTime = now;

    // Refresh check-ins store in background
    await useCheckInStore.getState().fetch();
  } catch (err) {
    console.error('Error updating past check-ins:', err);
  }
}