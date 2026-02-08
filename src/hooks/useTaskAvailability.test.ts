import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTaskAvailability } from './useTaskAvailability';
import { EffortLevel, Task } from '../types';
import { addDays } from 'date-fns';

describe('useTaskAvailability', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      level: EffortLevel.LOW,
      isCompleted: false,
      recurrenceUnit: 'days',
      recurrenceInterval: 1,
    },
    {
      id: '2',
      title: 'Task 2',
      level: EffortLevel.MEDIUM,
      isCompleted: false,
      recurrenceUnit: 'days',
      recurrenceInterval: 1,
    },
    {
      id: '3',
      title: 'Task 3',
      level: EffortLevel.LOW,
      isCompleted: true,
      recurrenceUnit: 'days',
      recurrenceInterval: 1,
    }
  ];

  it('calculates available counts correctly', () => {
    const { result } = renderHook(() => useTaskAvailability(mockTasks));

    expect(result.current.availableCounts[EffortLevel.LOW]).toBe(1);
    expect(result.current.availableCounts[EffortLevel.MEDIUM]).toBe(1);
    expect(result.current.availableCounts[EffortLevel.HIGH]).toBe(0);
    expect(result.current.totalIncomplete).toBe(2);
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates next refresh days correctly', () => {
    const futureDate = addDays(new Date(), 2).getTime();
    const recurringTask: Task = {
      ...mockTasks[2],
      nextAvailableAt: futureDate
    };
    
    const { result } = renderHook(() => useTaskAvailability([...mockTasks.slice(0, 2), recurringTask]));

    expect(result.current.nextRefreshDays).toBe(2);
  });

  it('returns null for nextRefreshDays if no recurring tasks', () => {
    const noRecurringTasks = mockTasks.map(t => ({ ...t, recurrenceUnit: 'none' as const }));
    const { result } = renderHook(() => useTaskAvailability(noRecurringTasks));

    expect(result.current.nextRefreshDays).toBeNull();
  });
});
