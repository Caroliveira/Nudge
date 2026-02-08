import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EffortSelector from './EffortSelector';
import { useStore } from '../store/useStore';
import { useTaskAvailability } from '../hooks/useTaskAvailability';
import { useTaskActions } from '../hooks/useTaskActions';
import { EffortLevel } from '../types';

vi.mock('../store/useStore');
vi.mock('../hooks/useTaskAvailability');
vi.mock('../hooks/useTaskActions');
vi.mock('./EffortLevelButton', () => ({
  default: ({ level, availableCount, onSelect }: any) => (
    <button onClick={() => onSelect(level)} disabled={availableCount === 0}>
      {level} ({availableCount})
    </button>
  ),
}));

describe('EffortSelector', () => {
  const mockSelectLevel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTaskActions as any).mockReturnValue({
      selectLevel: mockSelectLevel,
    });
  });

  it('renders welcome message when no tasks exist', () => {
    (useStore as any).mockReturnValue([]); // tasks array
    (useTaskAvailability as any).mockReturnValue({
      availableCounts: {
        [EffortLevel.LOW]: 0,
        [EffortLevel.MEDIUM]: 0,
        [EffortLevel.HIGH]: 0,
      },
    });

    render(<EffortSelector />);

    expect(screen.getByText('Welcome to Nudge')).toBeInTheDocument();
    expect(screen.getByText('Add some tasks to your catalog to get started.')).toBeInTheDocument();
  });

  it('renders selection prompt when tasks exist', () => {
    (useStore as any).mockReturnValue([{ id: '1' }]);
    (useTaskAvailability as any).mockReturnValue({
      availableCounts: {
        [EffortLevel.LOW]: 1,
        [EffortLevel.MEDIUM]: 0,
        [EffortLevel.HIGH]: 0,
      },
    });

    render(<EffortSelector />);

    expect(screen.getByText('What can you handle?')).toBeInTheDocument();
    expect(screen.getByText('Select an energy level to find your next step.')).toBeInTheDocument();
  });

  it('renders buttons for each effort level', () => {
    (useStore as any).mockReturnValue([{ id: '1' }]);
    (useTaskAvailability as any).mockReturnValue({
      availableCounts: {
        [EffortLevel.LOW]: 5,
        [EffortLevel.MEDIUM]: 2,
        [EffortLevel.HIGH]: 0,
      },
    });

    render(<EffortSelector />);

    expect(screen.getByText(`${EffortLevel.LOW} (5)`)).toBeInTheDocument();
    expect(screen.getByText(`${EffortLevel.MEDIUM} (2)`)).toBeInTheDocument();
    expect(screen.getByText(`${EffortLevel.HIGH} (0)`)).toBeInTheDocument();
  });

  it('calls selectLevel when a button is clicked', async () => {
    const user = userEvent.setup();
    (useStore as any).mockReturnValue([{ id: '1' }]);
    (useTaskAvailability as any).mockReturnValue({
      availableCounts: {
        [EffortLevel.LOW]: 1,
        [EffortLevel.MEDIUM]: 0,
        [EffortLevel.HIGH]: 0,
      },
    });

    render(<EffortSelector />);

    await user.click(screen.getByText(`${EffortLevel.LOW} (1)`));
    expect(mockSelectLevel).toHaveBeenCalledWith(EffortLevel.LOW);
  });
});
