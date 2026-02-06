
export enum EffortLevel {
  LOW = 'Low Effort',
  MEDIUM = 'Medium Effort',
  HIGH = 'High Effort'
}

export type RecurrenceUnit = 'days' | 'weeks' | 'months' | 'years' | 'none';

export interface Task {
  id: string;
  title: string;
  level: EffortLevel;
  isCompleted: boolean;
  isCustom?: boolean;
  recurrenceInterval?: number;
  recurrenceUnit?: RecurrenceUnit;
  lastCompletedAt?: number;
}

export type AppState = 'selection' | 'task' | 'catalog' | 'celebration' | 'total-victory';
