import { supabase } from '../supabase';
import { AuthError } from './errors';

export async function signOutUser() {
  try {
    // First attempt to sign out from Supabase
    const { error: signOutError } = await supabase.auth.signOut({
      scope: 'global'
    });

    // Clear local storage even if API call fails
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('mission-mind-auth');
    sessionStorage.clear();

    // If there was an error signing out, throw it after clearing storage
    if (signOutError) throw signOutError;

    // Clear any remaining session state
    await supabase.auth.clearSession();
  } catch (err) {
    console.error('Sign out error:', err);
    throw new AuthError(
      'Unable to complete sign out on server, but you have been logged out locally',
      'PARTIAL_SIGNOUT',
      err
    );
  }
}