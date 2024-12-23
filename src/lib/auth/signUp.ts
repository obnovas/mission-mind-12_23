import { supabase } from '../supabase';
import { AuthError } from './errors';
import { AUTH_CONFIG } from './config';

export async function signUpUser(email: string, password: string, metadata?: Record<string, any>) {
  try {
    // Validate inputs
    if (!email?.trim()) throw new Error('Email is required');
    if (!password?.trim()) throw new Error('Password is required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/signin`,
        emailConfirm: false, // Disable email confirmation
      },
    });

    if (error) {
      // Handle specific error cases
      if (error.message?.includes('already registered')) {
        throw new AuthError('An account with this email already exists', 'USER_EXISTS');
      }
      throw error;
    }

    if (!data?.user) {
      throw new Error('No user data returned from signup');
    }

    return data.user;
  } catch (err) {
    console.error('Sign up error:', err);
    
    // Transform error into AuthError with appropriate message
    if (err instanceof AuthError) throw err;
    
    throw new AuthError(
      err instanceof Error ? err.message : 'Unable to create account',
      'SIGNUP_ERROR',
      err
    );
  }
}