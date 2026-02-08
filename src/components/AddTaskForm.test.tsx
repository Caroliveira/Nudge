import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskForm from './AddTaskForm';
import { EffortLevel } from '../types';

describe('AddTaskForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly for new task', () => {
    render(<AddTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText('Add new task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs doing?')).toHaveValue('');
    expect(screen.getByText('Save Task')).toBeInTheDocument();
  });

  it('renders correctly for editing task', () => {
    const initialValues = {
      title: 'Existing Task',
      level: EffortLevel.HIGH,
      recurrenceUnit: 'days' as const,
      recurrenceInterval: 2
    };

    render(
      <AddTaskForm 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
        initialValues={initialValues} 
      />
    );

    expect(screen.getByLabelText('Edit task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('High Effort')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Days')).toBeInTheDocument();
    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });

  it('submits form with correct values', async () => {
    const user = userEvent.setup();
    render(<AddTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.type(screen.getByPlaceholderText('What needs doing?'), 'New Task');
    await user.selectOptions(screen.getByLabelText('Effort Level'), EffortLevel.MEDIUM);

    await user.click(screen.getByText('Save Task'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      level: EffortLevel.MEDIUM,
      recurrenceUnit: 'none',
      recurrenceInterval: undefined
    });
  });

  it('does not submit if title is empty', async () => {
    const user = userEvent.setup();
    render(<AddTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByText('Save Task'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows interval input only when recurrence is not none', async () => {
    const user = userEvent.setup();
    render(<AddTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.queryByLabelText('Recurrence interval')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Recurrence'), 'days');

    expect(screen.getByLabelText('Recurrence interval')).toBeInTheDocument();
  });
});
