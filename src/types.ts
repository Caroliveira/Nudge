
export enum EffortLevel { 
  LOW = 'LOW', 
  MEDIUM = 'MEDIUM', 
  HIGH = 'HIGH'
}

export type RecurrenceUnit = 'days' | 'weeks' | 'months' | 'years' | 'none';
export type RecurringUnit = Exclude<RecurrenceUnit, 'none'>;

export interface Task {
  id: string;
  title: string;
  level: EffortLevel;
  isCompleted: boolean;
  recurrenceInterval?: number;
  recurrenceUnit?: RecurrenceUnit;
  lastCompletedAt?: number;
  nextAvailableAt?: number;
}

export type AppState = 'selection' | 'task' | 'catalog';
