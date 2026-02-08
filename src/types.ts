
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

export interface StoreState {
  // State
  tasks: Task[];
  currentTask: Task | null;
  selectedLevel: EffortLevel | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  setCurrentTask: (task: Task | null) => void;
  setSelectedLevel: (level: EffortLevel | null) => void;
  
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  refreshRecurringTasks: () => void;
}

export interface CsvTaskRow {
  title: string;
  effort: string;
  interval: string;
  unit: string;
}
