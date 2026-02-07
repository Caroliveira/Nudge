import { useMemo, useCallback } from 'react';
import { Task, EffortLevel } from '../types';
import { addDays, addWeeks, addMonths, addYears, isBefore, differenceInCalendarDays } from 'date-fns';

const recurrenceMap: Record<string, (last: Date, interval: number) => Date> = {
  days: (last, interval) => addDays(last, interval),
  weeks: (last, interval) => addWeeks(last, interval),
  months: (last, interval) => addMonths(last, interval),
  years: (last, interval) => addYears(last, interval),
};

function getNextAvailableDate(task: Task): Date | null {
  if (!task.lastCompletedAt || !task.recurrenceUnit || task.recurrenceUnit === 'none') return null;
  const last = new Date(task.lastCompletedAt);
  const interval = task.recurrenceInterval ?? 1;
  
  const calculator = recurrenceMap[task.recurrenceUnit];
  return calculator ? calculator(last, interval) : last;
}

export function isTaskAvailable(task: Task): boolean {
  if (!task.isCompleted) return true;
  const next = getNextAvailableDate(task);
  if (!next) return false;
  return !isBefore(new Date(), next);
}

export function useTaskAvailability(tasks: Task[]) {
  const isAvailable = useCallback((task: Task) => isTaskAvailable(task), []);

  const { availableCounts, totalIncomplete } = useMemo(() => {
    const counts = {
      [EffortLevel.LOW]: 0,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 0,
    };
    let total = 0;

    for (const task of tasks) {
      if (isTaskAvailable(task)) {
        if (counts[task.level] !== undefined) counts[task.level]++;
        total++;
      }
    }
    return { availableCounts: counts, totalIncomplete: total };
  }, [tasks]);

  const nextRefreshDays = useMemo(() => {
    let minDays = Infinity;
    let hasRecurring = false;
    const now = new Date();

    for (const task of tasks) {
        if (task.isCompleted && task.recurrenceUnit && task.recurrenceUnit !== 'none' && task.lastCompletedAt) {
            const next = getNextAvailableDate(task);
            if (next) {
                hasRecurring = true;
                const diff = differenceInCalendarDays(next, now);
                if (diff < minDays) minDays = diff;
            }
        }
    }

    if (!hasRecurring) return null;
    
    return minDays > 0 ? minDays : 1;
  }, [tasks]);

  return { isTaskAvailable: isAvailable, availableCounts, totalIncomplete, nextRefreshDays };
}
