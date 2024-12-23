import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JourneyProgressBar } from '../JourneyProgressBar';

describe('JourneyProgressBar', () => {
  const mockStages = ['Stage 1', 'Stage 2', 'Stage 3'];
  const mockOnStageChange = vi.fn();

  it('should render all stages', () => {
    render(
      <JourneyProgressBar
        stages={mockStages}
        currentStage="Stage 1"
        onStageChange={mockOnStageChange}
      />
    );

    mockStages.forEach(stage => {
      expect(screen.getByText(stage)).toBeInTheDocument();
    });
  });

  it('should highlight current stage', () => {
    render(
      <JourneyProgressBar
        stages={mockStages}
        currentStage="Stage 2"
        onStageChange={mockOnStageChange}
      />
    );

    const currentStage = screen.getByText('Stage 2');
    expect(currentStage).toHaveClass('text-accent-600');
  });

  it('should call onStageChange when clicking a stage', () => {
    render(
      <JourneyProgressBar
        stages={mockStages}
        currentStage="Stage 1"
        onStageChange={mockOnStageChange}
      />
    );

    fireEvent.click(screen.getByText('Stage 2'));
    expect(mockOnStageChange).toHaveBeenCalledWith('Stage 2');
  });

  it('should not allow clicking stages beyond next available stage', () => {
    render(
      <JourneyProgressBar
        stages={mockStages}
        currentStage="Stage 1"
        onStageChange={mockOnStageChange}
      />
    );

    fireEvent.click(screen.getByText('Stage 3'));
    expect(mockOnStageChange).not.toHaveBeenCalled();
  });

  it('should disable stage selection when isEditable is false', () => {
    render(
      <JourneyProgressBar
        stages={mockStages}
        currentStage="Stage 1"
        onStageChange={mockOnStageChange}
        isEditable={false}
      />
    );

    fireEvent.click(screen.getByText('Stage 2'));
    expect(mockOnStageChange).not.toHaveBeenCalled();
  });
});