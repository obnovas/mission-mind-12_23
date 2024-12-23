import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJourneyManagement } from '../useJourneyManagement';

describe('useJourneyManagement', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useJourneyManagement());

    expect(result.current.isSelectingJourney).toBe(false);
    expect(result.current.isSelectingStage).toBe(false);
    expect(result.current.selectedJourney).toBe(null);
  });

  it('should handle starting journey selection', () => {
    const { result } = renderHook(() => useJourneyManagement());

    act(() => {
      result.current.startJourneySelection();
    });

    expect(result.current.isSelectingJourney).toBe(true);
    expect(result.current.selectedJourney).toBe(null);
  });

  it('should handle journey selection', () => {
    const { result } = renderHook(() => useJourneyManagement());
    const mockJourney = { id: '1', name: 'Test Journey', stages: ['Stage 1'] };

    act(() => {
      result.current.handleJourneySelect(mockJourney);
    });

    expect(result.current.isSelectingJourney).toBe(false);
    expect(result.current.isSelectingStage).toBe(true);
    expect(result.current.selectedJourney).toBe(mockJourney);
  });

  it('should handle cancellation', () => {
    const { result } = renderHook(() => useJourneyManagement());
    const mockJourney = { id: '1', name: 'Test Journey', stages: ['Stage 1'] };

    act(() => {
      result.current.handleJourneySelect(mockJourney);
      result.current.handleCancel();
    });

    expect(result.current.isSelectingJourney).toBe(false);
    expect(result.current.isSelectingStage).toBe(false);
    expect(result.current.selectedJourney).toBe(null);
  });
});