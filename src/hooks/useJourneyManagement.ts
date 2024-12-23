import { useState } from 'react';
import { Journey } from '../types';

export function useJourneyManagement() {
  const [isSelectingJourney, setIsSelectingJourney] = useState(false);
  const [isSelectingStage, setIsSelectingStage] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);

  const startJourneySelection = () => {
    setIsSelectingJourney(true);
    setSelectedJourney(null);
  };

  const handleJourneySelect = (journey: Journey) => {
    setSelectedJourney(journey);
    setIsSelectingJourney(false);
    setIsSelectingStage(true);
  };

  const handleCancel = () => {
    setIsSelectingJourney(false);
    setIsSelectingStage(false);
    setSelectedJourney(null);
  };

  return {
    isSelectingJourney,
    isSelectingStage,
    selectedJourney,
    startJourneySelection,
    handleJourneySelect,
    handleCancel,
  };
}