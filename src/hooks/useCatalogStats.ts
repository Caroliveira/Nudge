import { useMemo } from 'react';
import { differenceInCalendarDays, isToday, startOfDay } from 'date-fns';
import { Task, EffortLevel, RecurrenceUnit } from '../types';

export const useCatalogStats = (tasks: Task[]) => {
  return useMemo(() => {
    const effortDist = {
      [EffortLevel.LOW]: 0,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 0,
    };

    const recurrenceDist: Record<RecurrenceUnit, number> = {
      'days': 0,
      'weeks': 0,
      'months': 0,
      'years': 0,
      'none': 0
    };

    const totalDone = {
      [EffortLevel.LOW]: 0,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 0,
    };
    const totalLeft = {
      [EffortLevel.LOW]: 0,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 0,
    };

    let hasActivityToday = false;
    const registeredUnits = new Set<RecurrenceUnit>();
    const completionDaySet = new Set<number>();

    tasks.forEach(task => {
      const unit = task.recurrenceUnit || 'none';
      registeredUnits.add(unit);

      // Activity Today Logic
      if (task.isCompleted && task.lastCompletedAt && isToday(task.lastCompletedAt)) {
        effortDist[task.level]++;
        recurrenceDist[unit] = (recurrenceDist[unit] || 0) + 1;
        hasActivityToday = true;
      }

      if (task.lastCompletedAt) {
        completionDaySet.add(startOfDay(task.lastCompletedAt).getTime());
      }

      // Catalog Status Logic
      if (task.isCompleted) {
        totalDone[task.level]++;
      } else {
        totalLeft[task.level]++;
      }
    });

    const completionDays = Array.from(completionDaySet).sort((a, b) => b - a);
    const today = startOfDay(new Date());
    let currentStreak = 0;

    if (completionDays.length > 0) {
      const mostRecentDay = startOfDay(completionDays[0]);
      const diffFromToday = differenceInCalendarDays(today, mostRecentDay);

      if (diffFromToday === 0 || diffFromToday === 1) {
        currentStreak = 1;
        for (let i = 1; i < completionDays.length; i++) {
          const previous = startOfDay(completionDays[i - 1]);
          const current = startOfDay(completionDays[i]);
          const gap = differenceInCalendarDays(previous, current);

          if (gap === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    let bestStreak = 0;
    let streakRun = 0;
    let previousDay: Date | null = null;

    for (let i = completionDays.length - 1; i >= 0; i--) {
      const day = startOfDay(completionDays[i]);
      if (!previousDay) {
        streakRun = 1;
      } else {
        const gap = differenceInCalendarDays(day, previousDay);
        streakRun = gap === 1 ? streakRun + 1 : 1;
      }
      previousDay = day;
      bestStreak = Math.max(bestStreak, streakRun);
    }

    return {
      effortDist,
      recurrenceDist,
      totalDone,
      totalLeft,
      hasActivityToday,
      registeredUnits,
      currentStreak,
      bestStreak,
    };
  }, [tasks]);
};
