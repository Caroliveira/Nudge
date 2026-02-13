import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useStore } from './useStore';
import { EffortLevel, Task } from '../types';
import { STORAGE_KEY } from '../constants';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      tasks: [],
      currentTask: null,
      selectedLevel: null
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('adds a task correctly', () => {
    const taskData = {
      id: 'test-uuid',
      title: 'New Task',
      level: EffortLevel.MEDIUM,
      recurrenceUnit: 'none' as const,
      recurrenceInterval: 1,
      createdAt: Date.now(),
    };

    useStore.getState().addTask(taskData);

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject(taskData);
  });

  it('updates a task correctly', () => {
    const taskData = {
      id: 'test-uuid',
      title: 'Task',
      level: EffortLevel.LOW,
      recurrenceUnit: 'none' as const,
      recurrenceInterval: 1,
      createdAt: Date.now()
    };
    useStore.getState().addTask(taskData);
    
    useStore.getState().updateTask('test-uuid', { title: 'Updated Task' });

    const { tasks } = useStore.getState();
    expect(tasks[0].title).toBe('Updated Task');
  });

  it('deletes a task correctly', () => {
    const taskData = {
      id: 'test-uuid',
      title: 'Task',
      level: EffortLevel.LOW,
      recurrenceUnit: 'none' as const,
      recurrenceInterval: 1,
      createdAt: Date.now()
    };
    useStore.getState().addTask(taskData);
    
    useStore.getState().deleteTask('test-uuid');

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(0);
  });

  it('clears currentTask if the deleted task was selected', () => {
    const taskData = {
      id: 'test-uuid',
      title: 'Task',
      level: EffortLevel.LOW,
      recurrenceUnit: 'none' as const,
      recurrenceInterval: 1,
      createdAt: Date.now()
    };
    useStore.getState().addTask(taskData);
    const task = useStore.getState().tasks[0];
    useStore.getState().setCurrentTask(task);

    useStore.getState().deleteTask('test-uuid');

    const { currentTask } = useStore.getState();
    expect(currentTask).toBeNull();
  });

  it('refreshes recurring tasks that are due', () => {
    const pastDate = new Date('2020-01-01').getTime();
    const task: Task = {
      id: 'recurring-task',
      title: 'Recurring',
      level: EffortLevel.LOW,
      isCompleted: true,
      recurrenceUnit: 'days',
      recurrenceInterval: 1,
      lastCompletedAt: pastDate,
      nextAvailableAt: pastDate
    };

    useStore.setState({ tasks: [task] });

    useStore.getState().refreshRecurringTasks();

    const { tasks } = useStore.getState();
    expect(tasks[0].isCompleted).toBe(false);
    expect(tasks[0].nextAvailableAt).toBeUndefined();
  });
});
