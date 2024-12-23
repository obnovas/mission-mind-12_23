import { DatabaseClient } from '../../database/types';
import { AuthCredentials } from '../types';
import { handleAuthError } from '../errors';

export class EmailAuthProvider {
  constructor(private client: DatabaseClient) {}

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      throw handleAuthError(err);
    }
  }

  async signUp(credentials: AuthCredentials) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: credentials.email!,
        password: credentials.password!,
        options: {
          data: credentials.metadata,
          emailRedirectTo: `${window.location.origin}/signin`,
          emailConfirm: false, // Disable email confirmation
        },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      throw handleAuthError(err);
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (err) {
      throw handleAuthError(err);
    }
  }

  async updatePassword(newPassword: string) {
    try {
      const { error } = await this.client.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (err) {
      throw handleAuthError(err);
    }
  }
}