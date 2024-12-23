import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useDatabase } from '../../database/hooks';
import { handleAuthError } from '../errors';
import { updatePastScheduledCheckIns } from '../../../utils/checkIn/statusUpdate';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { client } = useDatabase();
  const { setUser } = useAuthStore();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setUser(data.user);

      // Update past scheduled check-ins after successful sign in
      await updatePastScheduledCheckIns();
      
      navigate('/');
    } catch (err) {
      const authError = handleAuthError(err);
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the code remains the same
}