import { EffortLevel } from './types';

export const APP_ROUTES = {
  HOME: '/',
  TASK: '/task',
  CATALOG: '/catalog',
} as const;

export const STORAGE_KEY = 'nudge_tasks';

export const IMPORT_CONFIG = {
  MAX_FILE_SIZE_BYTES: 1024 * 1024, // 1MB
  STATUS_MESSAGE_DURATION_MS: 5000,
} as const;

export const SWIPE_CONFIG = {
  THRESHOLD_PX: 150,
  DRAG_CONSTRAINT_PX: 300,
  DRAG_END_TIMEOUT_MS: 50,
} as const;

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

export const SWIPE_ACTIONS = {
  DELETE: {
    threshold: -150,
    baseText: "Delete",
    activeText: "Release to Delete",
    baseColor: "rgb(239, 68, 68)", // red-500
    activeColor: "rgb(220, 38, 38)", // red-600
    alignment: "end" as const,
  },
  EDIT: {
    threshold: 150,
    baseText: "Edit",
    activeText: "Release to Edit",
    baseColor: "rgb(59, 130, 246)", // blue-500
    activeColor: "rgb(37, 99, 235)", // blue-600
    alignment: "start" as const,
  },
} as const;
