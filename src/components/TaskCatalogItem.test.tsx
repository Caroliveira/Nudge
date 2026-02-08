import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCatalogItem from './TaskCatalogItem';
import { EffortLevel, Task } from '../types';

vi.mock('./SwipeableItem', () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>
}));

vi.mock('./TaskCatalogActions', () => ({
  SwipeAction: () => <div>SwipeAction</div>
}));

describe('TaskCatalogItem', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    level: EffortLevel.LOW,
    isCompleted: false,
    recurrenceUnit: 'none',
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  it('renders task details correctly', () => {
    render(
      <TaskCatalogItem 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Low Effort')).toBeInTheDocument();
    expect(screen.getByLabelText('Mark as complete')).toBeInTheDocument();
  });

  it('renders completed task correctly', () => {
    const completedTask = { ...mockTask, isCompleted: true };
    render(
      <TaskCatalogItem 
        task={completedTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toHaveClass('line-through');
    expect(screen.getByLabelText('Mark as incomplete')).toBeInTheDocument();
  });

  it('calls onToggle when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCatalogItem 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete}
      />
    );

    await user.click(screen.getByLabelText('Mark as complete'));
    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('shows recurrence info if present', () => {
    const recurringTask: Task = {
      ...mockTask,
      recurrenceUnit: 'days',
      recurrenceInterval: 2
    };

    render(
      <TaskCatalogItem 
        task={recurringTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Every 2 days')).toBeInTheDocument();
  });
});
