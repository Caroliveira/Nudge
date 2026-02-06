import { useMemo, useCallback } from 'react';
import { Task, EffortLevel } from '../types';

const recurrenceMap: Record<string, (last: Date, interval: number) => Date> = {
  days: (last, interval) => new Date(last.getTime() + interval * 24 * 60 * 60 * 1000),
  weeks: (last, interval) => new Date(last.getTime() + interval * 7 * 24 * 60 * 60 * 1000),
  months: (last, interval) => new Date(last.getFullYear(), last.getMonth() + interval, last.getDate()),
  years: (last, interval) => new Date(last.getFullYear() + interval, last.getMonth(), last.getDate()),
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
  return next !== null && Date.now() >= next.getTime();
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
    let minDiffMs = Infinity;
    let hasRecurring = false;

    for (const task of tasks) {
        if (task.isCompleted && task.recurrenceUnit && task.recurrenceUnit !== 'none' && task.lastCompletedAt) {
            const next = getNextAvailableDate(task);
            if (next) {
                hasRecurring = true;
                const diff = next.getTime() - Date.now();
                if (diff < minDiffMs) minDiffMs = diff;
            }
        }
    }

    if (!hasRecurring) return null;
    
    const diffDays = Math.ceil(minDiffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [tasks]);

  return { isTaskAvailable: isAvailable, availableCounts, totalIncomplete, nextRefreshDays };
}
