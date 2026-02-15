import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CompletionFeedback from './CompletionFeedback';

describe('CompletionFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders feedback message', () => {
    render(<CompletionFeedback onComplete={vi.fn()} />);
    expect(screen.getByText('Nice!')).toBeInTheDocument();
  });

  it('calls onComplete after timeout', () => {
    const onComplete = vi.fn();
    render(<CompletionFeedback onComplete={onComplete} />);

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalled();
  });
});
