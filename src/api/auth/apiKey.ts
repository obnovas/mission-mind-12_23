import { supabase } from '../../lib/supabase';
import { nanoid } from 'nanoid';

export async function generateApiKey(userId: string): Promise<string> {
  const apiKey = `mk_${nanoid(32)}`;
  
  const { error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      key: apiKey,
      created_at: new Date().toISOString(),
    });

  if (error) throw error;
  return apiKey;
}

export async function validateApiKey(apiKey: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key', apiKey)
    .single();

  if (error || !data) {
    throw new Error('Invalid API key');
  }

  const { data: user } = await supabase.auth.getUser(data.user_id);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}