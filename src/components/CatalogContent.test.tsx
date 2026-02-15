import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CatalogContent from './CatalogContent';
import { Task, EffortLevel } from '../types';

vi.mock('./TaskForm', () => ({
  default: ({ onSubmit, onCancel, initialValues }: any) => (
    <div data-testid="task-form">
      {initialValues ? 'Edit Form' : 'Add Form'}
      <button onClick={() => onSubmit({ title: 'New Task' })}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

vi.mock('./CsvImport', () => ({
  default: () => <div data-testid="csv-import">CsvImport</div>,
}));

vi.mock('./CatalogReport', () => ({
  default: () => <div data-testid="catalog-report">CatalogReport</div>,
}));

vi.mock('./CatalogList', () => ({
  default: ({ onEdit }: any) => (
    <div data-testid="catalog-list">
      CatalogList
      <button onClick={() => onEdit({ id: '1' })}>Edit Task</button>
    </div>
  ),
}));

describe('CatalogContent', () => {
  const mockProps = {
    view: 'tasks' as const,
    isAdding: false,
    editingTask: null,
    tasks: [],
    filteredTasks: [],
    onAddTask: vi.fn(),
    onUpdateTask: vi.fn(),
    onDeleteTask: vi.fn(),
    onToggleTask: vi.fn(),
    onCancelEdit: vi.fn(),
    onStartAdd: vi.fn(),
    onStartEdit: vi.fn(),
  };

  it('renders task list view by default', () => {
    render(<CatalogContent {...mockProps} />);

    expect(screen.getByText('Add a personal task')).toBeInTheDocument();
    expect(screen.getByTestId('csv-import')).toBeInTheDocument();
    expect(screen.getByTestId('catalog-list')).toBeInTheDocument();
  });

  it('renders add form when isAdding is true', () => {
    render(<CatalogContent {...mockProps} isAdding={true} />);

    expect(screen.getByTestId('task-form')).toHaveTextContent('Add Form');
    expect(screen.queryByTestId('catalog-list')).not.toBeInTheDocument();
  });

  it('renders edit form when editingTask is present', () => {
    const task: Task = {
      id: '1',
      title: 'Task 1',
      level: EffortLevel.LOW,
      isCompleted: false,
      recurrenceUnit: 'none'
    };
    render(<CatalogContent {...mockProps} editingTask={task} />);

    expect(screen.getByTestId('task-form')).toHaveTextContent('Edit Form');
    expect(screen.queryByTestId('catalog-list')).not.toBeInTheDocument();
  });

  it('renders report view', () => {
    render(<CatalogContent {...mockProps} view="report" />);

    expect(screen.getByTestId('catalog-report')).toBeInTheDocument();
    expect(screen.queryByTestId('catalog-list')).not.toBeInTheDocument();
  });

  it('calls onStartAdd when add button is clicked', () => {
    render(<CatalogContent {...mockProps} />);

    fireEvent.click(screen.getByText('Add a personal task'));
    expect(mockProps.onStartAdd).toHaveBeenCalled();
  });

  it('calls onAddTask when form is submitted in add mode', () => {
    render(<CatalogContent {...mockProps} isAdding={true} />);

    fireEvent.click(screen.getByText('Submit'));
    expect(mockProps.onAddTask).toHaveBeenCalledWith({ title: 'New Task' });
  });

  it('calls onUpdateTask when form is submitted in edit mode', () => {
    const task: Task = {
      id: '1',
      title: 'Task 1',
      level: EffortLevel.LOW,
      isCompleted: false,
      recurrenceUnit: 'none'
    };
    render(<CatalogContent {...mockProps} editingTask={task} />);

    fireEvent.click(screen.getByText('Submit'));
    expect(mockProps.onUpdateTask).toHaveBeenCalledWith('1', { title: 'New Task' });
  });

  it('calls onStartEdit when edit is triggered from list', () => {
    render(<CatalogContent {...mockProps} />);

    fireEvent.click(screen.getByText('Edit Task'));
    expect(mockProps.onStartEdit).toHaveBeenCalled();
  });
});
