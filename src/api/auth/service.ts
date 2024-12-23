import { supabase } from '../../lib/supabase';
import { nanoid } from 'nanoid';
import { ApiKeyResponse } from './types';

export async function generateApiKey(userId: string): Promise<ApiKeyResponse> {
  try {
    const apiKey = `mk_${nanoid(32)}`;
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        key: apiKey,
        created_at: new Date().toISOString(),
      })
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

export async function validateApiKey(apiKey: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key', apiKey)
    .is('revoked_at', null)
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

export async function revokeApiKey(userId: string, keyId: string): Promise<ApiKeyResponse> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        revoked_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('id', keyId)
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