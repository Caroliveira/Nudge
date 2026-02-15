import { EffortLevel, RecurrenceUnit, CsvTaskRow, Task } from '../types';

export interface ProcessedImport {
  tasksToAdd: Omit<Task, 'id' | 'isCompleted' | 'lastCompletedAt' | 'nextAvailableAt'>[];
  skippedCount: number;
  count: number;
}

export const validateHeaders = (headers: string[]): boolean => {
  const requiredHeaders = ['title', 'effort', 'interval', 'unit'];
  return requiredHeaders.every((h) => headers.includes(h));
};

export const processImportedTasks = (
  data: CsvTaskRow[],
  existingTasks: Task[],
): ProcessedImport => {
  const tasksToAdd: ProcessedImport['tasksToAdd'] = [];
  let skippedCount = 0;

  data.forEach((taskData) => {
    if (!taskData.title?.trim() || !taskData.effort || !taskData.interval || !taskData.unit) {
      return;
    }

    const title = taskData.title.trim();
    const isDuplicate = existingTasks.some((t) => t.title.toLowerCase() === title.toLowerCase());

    if (isDuplicate) {
      skippedCount++;
      return;
    }

    let level = EffortLevel.LOW;
    const effortStr = taskData.effort.toLowerCase();
    if (effortStr.includes('medium')) level = EffortLevel.MEDIUM;
    if (effortStr.includes('high')) level = EffortLevel.HIGH;

    const interval = parseInt(taskData.interval, 10);
    const unitRaw = taskData.unit.toLowerCase();
    const unit: RecurrenceUnit = ['days', 'weeks', 'months', 'years'].includes(unitRaw)
      ? (unitRaw as RecurrenceUnit)
      : 'none';

    if (unit !== 'none' && (isNaN(interval) || interval <= 0)) return;

    tasksToAdd.push({
      title,
      level,
      recurrenceInterval: unit !== 'none' ? interval : undefined,
      recurrenceUnit: unit,
    });
  });

  return {
    tasksToAdd,
    skippedCount,
    count: tasksToAdd.length,
  };
};
