import { EffortLevel } from './types';

export const APP_ROUTES = {
  HOME: '/',
  TASK: '/task',
  CATALOG: '/catalog',
} as const;

export const STORAGE_KEY = 'nudge_tasks';

export const ENCOURAGEMENTS = [
  "Take a deep breath. You've got this.",
  "One step at a time is all it takes.",
  "Progress is progress, no matter how small.",
  "Focus on the now. The rest can wait.",
  "You are capable of more than you think.",
  "Slow and steady wins the race.",
  "Be kind to yourself as you move forward.",
  "Your effort today is enough.",
  "The mountain is climbed one pebble at a time.",
  "Start where you are. Use what you have.",
  "Quiet your mind and focus on the task at hand.",
  "Each small action builds a better tomorrow."
];

export const EFFORT_LABELS: Record<EffortLevel, string> = {
  [EffortLevel.LOW]: 'Low Effort',
  [EffortLevel.MEDIUM]: 'Medium Effort',
  [EffortLevel.HIGH]: 'High Effort',
};
