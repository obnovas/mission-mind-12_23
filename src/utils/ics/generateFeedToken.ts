import { supabase } from '../../lib/supabase';
import { nanoid } from 'nanoid';

export async function generateFeedToken(userId: string): Promise<string> {
  try {
    // Generate a secure random token
    const token = nanoid(32);

    // Store the token in the database
    const { error } = await supabase
      .from('calendar_feed_tokens')
      .insert({
        user_id: userId,
        token,
      });

    if (error) throw error;
    return token;
  } catch (err) {
    console.error('Error generating feed token:', err);
    throw new Error('Failed to generate calendar feed token');
  }
}

export async function getFeedUrl(userId: string): Promise<string> {
  try {
    // Check for existing token
    const { data: existing, error: fetchError } = await supabase
      .from('calendar_feed_tokens')
      .select('token')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    // If token exists, return it
    if (existing?.token) {
      return `${window.location.origin}/api/calendar/${existing.token}/feed.ics`;
    }

    // Generate new token
    const token = await generateFeedToken(userId);
    return `${window.location.origin}/api/calendar/${token}/feed.ics`;
  } catch (err) {
    console.error('Error getting feed URL:', err);
    throw new Error('Failed to get calendar feed URL');
  }
}