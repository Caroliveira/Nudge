import { useMemo } from 'react';
import { Task, EffortLevel } from '../types';
import { differenceInCalendarDays } from 'date-fns';
import { isTaskAvailable, getNextAvailableDate } from '../utils/taskUtils';

export { isTaskAvailable };

export function useTaskAvailability(tasks: Task[]) {
  const { availableCounts, totalIncomplete, nextRefreshDays } = useMemo(() => {
    const counts = {
      [EffortLevel.LOW]: 0,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 0,
    };
    let total = 0;
    let minDays = Infinity;
    let hasRecurring = false;
    const now = new Date();

    for (const task of tasks) {
      // Calculate availability counts
      if (isTaskAvailable(task, now)) {
        if (counts[task.level] !== undefined) counts[task.level]++;
        total++;
      }

      // Calculate next refresh days
      if (task.isCompleted && task.recurrenceUnit && task.recurrenceUnit !== 'none' && task.lastCompletedAt) {
        const next = getNextAvailableDate(task);
        if (next) {
          hasRecurring = true;
          const diff = differenceInCalendarDays(next, now);
          if (diff < minDays) minDays = diff;
        }
      }
    }

    const refreshDays = !hasRecurring ? null : (minDays > 0 ? minDays : 1);

    return { 
      availableCounts: counts, 
      totalIncomplete: total,
      nextRefreshDays: refreshDays
    };
  }, [tasks]);

  return { isTaskAvailable, availableCounts, totalIncomplete, nextRefreshDays };
}
