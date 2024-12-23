import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface UseJourneyStageUpdateOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useJourneyStageUpdate(options?: UseJourneyStageUpdateOptions) {
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthStore();

  const updateStage = async (params: {
    contactId: string;
    journeyId: string;
    stage: string;
  }) => {
    if (!user) return;

    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('contact_journeys')
        .update({
          stage: params.stage,
          updated_at: new Date().toISOString(),
        })
        .eq('contact_id', params.contactId)
        .eq('journey_id', params.journeyId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      options?.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update stage');
      setError(error);
      options?.onError?.(error);
      throw error;
    }
  };

  return { updateStage, error };
}