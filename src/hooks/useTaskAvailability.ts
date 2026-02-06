import { useMemo, useCallback } from 'react';
import { Task, EffortLevel } from '../types';

function getNextAvailableDate(task: Task): Date | null {
  if (!task.lastCompletedAt || !task.recurrenceUnit || task.recurrenceUnit === 'none') return null;
  const last = new Date(task.lastCompletedAt);
  const interval = task.recurrenceInterval ?? 1;
  const map: Record<string, () => Date> = {
    days: () => new Date(last.getTime() + interval * 24 * 60 * 60 * 1000),
    weeks: () => new Date(last.getTime() + interval * 7 * 24 * 60 * 60 * 1000),
    months: () => new Date(last.getFullYear(), last.getMonth() + interval, last.getDate()),
    years: () => new Date(last.getFullYear() + interval, last.getMonth(), last.getDate()),
  };
  return map[task.recurrenceUnit]?.() ?? last;
}

export function isTaskAvailable(task: Task): boolean {
  if (!task.isCompleted) return true;
  const next = getNextAvailableDate(task);
  return next !== null && Date.now() >= next.getTime();
}

export function useTaskAvailability(tasks: Task[]) {
  const isAvailable = useCallback((task: Task) => isTaskAvailable(task), []);

  const availableCounts = useMemo(
    () => ({
      [EffortLevel.LOW]: tasks.filter((t) => t.level === EffortLevel.LOW && isTaskAvailable(t)).length,
      [EffortLevel.MEDIUM]: tasks.filter((t) => t.level === EffortLevel.MEDIUM && isTaskAvailable(t)).length,
      [EffortLevel.HIGH]: tasks.filter((t) => t.level === EffortLevel.HIGH && isTaskAvailable(t)).length,
    }),
    [tasks]
  );

  const totalIncomplete = useMemo(
    () => tasks.filter((t) => isTaskAvailable(t)).length,
    [tasks]
  );

  const nextRefreshDays = useMemo(() => {
    const recurring = tasks.filter(
      (t) => t.isCompleted && t.recurrenceUnit && t.recurrenceUnit !== 'none' && t.lastCompletedAt
    );
    if (recurring.length === 0) return null;
    const nextTimes = recurring.map((task) => {
      const next = getNextAvailableDate(task);
      return next?.getTime() ?? 0;
    });
    const soonest = Math.min(...nextTimes);
    const diffMs = soonest - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [tasks]);

  return { isTaskAvailable: isAvailable, availableCounts, totalIncomplete, nextRefreshDays };
}
