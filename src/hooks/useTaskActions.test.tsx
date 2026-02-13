import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskActions } from './useTaskActions';
import { useStore } from '../store/useStore';
import { EffortLevel, Task } from '../types';
import { APP_ROUTES } from '../constants';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useTaskActions', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      level: EffortLevel.LOW,
      recurrenceUnit: 'none',
    },
    {
      id: '2',
      title: 'Task 2',
      level: EffortLevel.LOW,
      recurrenceUnit: 'none',
    },
    {
      id: '3',
      title: 'Task 3',
      level: EffortLevel.HIGH,
      recurrenceUnit: 'none',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useStore.setState({
      tasks: [],
      currentTask: null,
      selectedLevel: null,
    });
  });

  it('selectLevel picks a random task and navigates', () => {
    useStore.setState({ tasks: mockTasks });
    const { result } = renderHook(() => useTaskActions());

    act(() => {
      result.current.selectLevel(EffortLevel.LOW);
    });

    const state = useStore.getState();
    expect(state.selectedLevel).toBe(EffortLevel.LOW);
    expect(state.currentTask).not.toBeNull();
    expect(state.currentTask?.level).toBe(EffortLevel.LOW);
    expect(mockNavigate).toHaveBeenCalledWith(APP_ROUTES.TASK);
  });

  it('selectLevel does nothing if no tasks available', () => {
    useStore.setState({ tasks: [] });
    const { result } = renderHook(() => useTaskActions());

    act(() => {
      result.current.selectLevel(EffortLevel.LOW);
    });

    const state = useStore.getState();
    expect(state.selectedLevel).toBeNull();
    expect(state.currentTask).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

/*
  // TODO: Move these tests to useTaskSession.test.tsx as refreshTask is now part of useTaskSession
  it('refreshTask picks a different task if available', () => {
    useStore.setState({ 
      tasks: mockTasks,
      selectedLevel: EffortLevel.LOW,
      currentTask: mockTasks[0] // Task 1
    });

    const { result } = renderHook(() => useTaskActions());

    act(() => {
      result.current.refreshTask();
    });

    const state = useStore.getState();
    expect(state.currentTask?.id).toBe('2'); // Should be Task 2 since it's the only other LOW task
  });

  it('refreshTask keeps same task if it is the only one', () => {
    const singleTask = [mockTasks[0]];
    useStore.setState({ 
      tasks: singleTask,
      selectedLevel: EffortLevel.LOW,
      currentTask: mockTasks[0]
    });

    const { result } = renderHook(() => useTaskActions());

    act(() => {
      result.current.refreshTask();
    });

    const state = useStore.getState();
    expect(state.currentTask?.id).toBe('1');
  });
  */

  it('backToSelection clears state and navigates home', () => {
    useStore.setState({ 
      selectedLevel: EffortLevel.LOW,
      currentTask: mockTasks[0]
    });

    const { result } = renderHook(() => useTaskActions());

    act(() => {
      result.current.backToSelection();
    });

    const state = useStore.getState();
    expect(state.selectedLevel).toBeNull();
    expect(state.currentTask).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith(APP_ROUTES.HOME);
  });

  it('toggleTask updates task completion status', () => {
    useStore.setState({ tasks: mockTasks });
    const { result } = renderHook(() => useTaskActions());

    act(() => {
      result.current.toggleTask('1');
    });

    const state = useStore.getState();
    const task = state.tasks.find(t => t.id === '1');
    expect(task?.isCompleted).toBe(true);
  });

    it('markTaskDone completes current task and checks for level completion', () => {
    useStore.setState({ 
      tasks: mockTasks,
      selectedLevel: EffortLevel.LOW,
      currentTask: mockTasks[0]
    });

    const { result } = renderHook(() => useTaskActions());

    let response;
    act(() => {
      response = result.current.markTaskDone();
    });

    const state = useStore.getState();
    const task = state.tasks.find(t => t.id === '1');
    
    expect(task?.isCompleted).toBe(true);

    expect(response).toEqual({ levelCleared: false });
  });

  it('markTaskDone returns levelCleared true when last task is finished', () => {
    const tasks = [
      { ...mockTasks[0] },
      { ...mockTasks[1], isCompleted: true },
    ];

    useStore.setState({ 
      tasks: tasks,
      selectedLevel: EffortLevel.LOW,
      currentTask: tasks[0]
    });

    const { result } = renderHook(() => useTaskActions());

    let response;
    act(() => {
      response = result.current.markTaskDone();
    });

    expect(response).toEqual({ levelCleared: true });
  });
});
