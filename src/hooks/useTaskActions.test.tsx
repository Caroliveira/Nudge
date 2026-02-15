import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('markTaskDone does nothing if no current task', () => {
    useStore.setState({
      tasks: mockTasks,
      selectedLevel: EffortLevel.LOW,
      currentTask: null
    });

    const { result } = renderHook(() => useTaskActions());

    let response;
    act(() => {
      response = result.current.markTaskDone();
    });

    expect(response).toEqual({ levelCleared: false });
  });
});
