import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskExhausted from './TaskExhausted';

describe('TaskExhausted', () => {
  it('renders exhausted message', () => {
    render(<TaskExhausted onReset={vi.fn()} onBack={vi.fn()} />);

    expect(screen.getByText(/You've seen all tasks/)).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(<TaskExhausted onReset={onReset} onBack={vi.fn()} />);

    fireEvent.click(screen.getByText('Run same list again'));
    expect(onReset).toHaveBeenCalled();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<TaskExhausted onReset={vi.fn()} onBack={onBack} />);

    fireEvent.click(screen.getByText('Select other effort'));
    expect(onBack).toHaveBeenCalled();
  });
});
