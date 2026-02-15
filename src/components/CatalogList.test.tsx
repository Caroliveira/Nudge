import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CatalogList from './CatalogList';
import { Task, EffortLevel } from '../types';

vi.mock('./TaskCatalogItem', () => ({
  default: ({ task, onToggle, onDelete, onEdit }: any) => (
    <div data-testid="task-item">
      <span>{task.title}</span>
      <button onClick={() => onToggle(task.id)}>Toggle</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
      <button onClick={onEdit}>Edit</button>
    </div>
  ),
}));

vi.mock('./CatalogEmptyState', () => ({
  default: ({ view }: any) => <div data-testid="empty-state">Empty: {view}</div>,
}));

describe('CatalogList', () => {
  const mockProps = {
    tasks: [],
    view: 'tasks' as const,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
  };

  it('renders empty state when no tasks', () => {
    render(<CatalogList {...mockProps} />);
    expect(screen.getByTestId('empty-state')).toHaveTextContent('Empty: tasks');
  });

  it('renders list of tasks', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', level: EffortLevel.LOW, isCompleted: false, recurrenceUnit: 'none' },
      { id: '2', title: 'Task 2', level: EffortLevel.MEDIUM, isCompleted: false, recurrenceUnit: 'none' },
    ];
    render(<CatalogList {...mockProps} tasks={tasks} />);

    expect(screen.getAllByTestId('task-item')).toHaveLength(2);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('passes actions to items', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', level: EffortLevel.LOW, isCompleted: false, recurrenceUnit: 'none' },
    ];
    render(<CatalogList {...mockProps} tasks={tasks} />);

    screen.getByText('Toggle').click();
    expect(mockProps.onToggle).toHaveBeenCalledWith('1');

    screen.getByText('Delete').click();
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');

    screen.getByText('Edit').click();
    expect(mockProps.onEdit).toHaveBeenCalledWith(tasks[0]);
  });
});
