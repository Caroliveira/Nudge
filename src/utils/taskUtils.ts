import { addDays, addWeeks, addMonths, addYears, isBefore } from 'date-fns';
import { Task, EffortLevel, RecurringUnit } from '../types';

const recurrenceMap: Record<RecurringUnit, (last: Date, interval: number) => Date> = {
  days: (last, interval) => addDays(last, interval),
  weeks: (last, interval) => addWeeks(last, interval),
  months: (last, interval) => addMonths(last, interval),
  years: (last, interval) => addYears(last, interval),
};

export function getNextAvailableDate(task: Task): Date | null {
  if (!task.lastCompletedAt || !task.recurrenceUnit || task.recurrenceUnit === 'none') return null;
  const last = new Date(task.lastCompletedAt);
  const interval = task.recurrenceInterval ?? 1;
  
  const calculator = recurrenceMap[task.recurrenceUnit as RecurringUnit];
  return calculator?.(last, interval) ?? last;
}

export function isTaskAvailable(task: Task, now: Date = new Date()): boolean {
  if (!task.isCompleted) return true;
  const next = getNextAvailableDate(task);
  if (!next) return false;
  return !isBefore(now, next);
}

export const pickRandomTask = (tasks: Task[]): Task | null => {
  if (tasks.length === 0) return null;
  return tasks[Math.floor(Math.random() * tasks.length)];
};

export const isOneTimeTask = (task: Task): boolean => {
  return !task.recurrenceUnit || task.recurrenceUnit === 'none';
};

export const getTasksForLevel = (tasks: Task[], level: EffortLevel, now: Date = new Date()): Task[] => {
  return tasks.filter(t => t.level === level && isTaskAvailable(t, now));
};
