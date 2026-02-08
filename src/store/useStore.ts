import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, EffortLevel, Task } from '../types';
import { isTaskAvailable, pickRandomTask, isOneTimeTask, getTasksForLevel, getNextAvailableDate } from '../utils/taskUtils';

interface StoreState {
  // State
  tasks: Task[];
  appState: AppState;
  currentTask: Task | null;
  selectedLevel: EffortLevel | null;

  // Actions
  setAppState: (state: AppState) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Complex Actions
  selectLevel: (level: EffortLevel) => void;
  refreshTask: () => void;
  markTaskDone: () => void;
  backToSelection: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tasks: [],
      appState: 'selection',
      currentTask: null,
      selectedLevel: null,

      setAppState: (appState) => set({ appState }),
      setTasks: (tasks) => set({ tasks }),
      
      addTask: (taskData) => set((state) => ({
        tasks: [
          {
            ...taskData,
            id: crypto.randomUUID(),
            isCompleted: false
          },
          ...state.tasks
        ]
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== id) return t;
          
          const updatedTask = { ...t, ...updates };
          
          if (updatedTask.isCompleted) {
             const nextDate = getNextAvailableDate(updatedTask);
             updatedTask.nextAvailableAt = nextDate ? nextDate.getTime() : undefined;
          } else updatedTask.nextAvailableAt = undefined;
          
          return updatedTask;
        })
      })),

      toggleTask: (id) => set((state) => {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return {};

        const isNowCompleted = !task.isCompleted;
        const lastCompletedAt = isNowCompleted ? Date.now() : undefined;
        
        const nextDate = isNowCompleted 
          ? getNextAvailableDate({ ...task, isCompleted: true, lastCompletedAt } as Task) 
          : null;

        return {
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { 
                  ...t, 
                  isCompleted: isNowCompleted, 
                  lastCompletedAt,
                  nextAvailableAt: nextDate ? nextDate.getTime() : undefined
                }
              : t
          )
        };
      }),

      deleteTask: (id) => set((state) => {
        const newTasks = state.tasks.filter((t) => t.id !== id);
        // If deleting current task, go back to selection
        if (state.currentTask?.id === id) {
             return { tasks: newTasks, appState: 'selection', currentTask: null };
        }
        return { tasks: newTasks };
      }),

      selectLevel: (level) => {
        const { tasks } = get();
        const candidates = getTasksForLevel(tasks, level);
        
        if (candidates.length > 0) {
          const picked = pickRandomTask(candidates);
          set({ 
            selectedLevel: level, 
            currentTask: picked, 
            appState: 'task' 
          });
        }
      },

      refreshTask: () => {
        const { tasks, selectedLevel, currentTask, selectLevel } = get();
        if (selectedLevel) {
          // Filter out the current task to ensure we get a new one if possible
          const candidates = getTasksForLevel(tasks, selectedLevel)
            .filter(t => t.id !== currentTask?.id);
          
          if (candidates.length > 0) {
            const picked = pickRandomTask(candidates);
            set({ currentTask: picked });
          } else {
             // If no other candidates, re-select (might pick the same one if it's the only one left)
             selectLevel(selectedLevel);
          }
        }
      },

      backToSelection: () => {
          set({
              appState: 'selection',
              currentTask: null,
              selectedLevel: null
          })
      },

      markTaskDone: () => {
        const { tasks, currentTask, selectedLevel, backToSelection } = get();
        if (currentTask && selectedLevel) {
          const now = Date.now();
          
          const updatedTasks = tasks.map(t => {
            if (t.id === currentTask.id) {
              const updatedTask = { ...t, isCompleted: true, lastCompletedAt: now };
              const nextDate = getNextAvailableDate(updatedTask);
              return {
                ...updatedTask,
                nextAvailableAt: nextDate ? nextDate.getTime() : undefined
              };
            }
            return t;
          });
          
          set({ tasks: updatedTasks });

          const remainingInLevel = updatedTasks.filter(t => t.level === selectedLevel && isTaskAvailable(t, new Date(now))).length;
          
          if (remainingInLevel === 0) {
            set({ appState: 'celebration' });
          } else {
            backToSelection();
          }
        } else {
            backToSelection();
        }
      }
    }),
    {
      name: 'nudge_tasks',
      partialize: (state) => ({ tasks: state.tasks }),
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          const state = persistedState as { tasks?: Task[] };
          const tasks = state.tasks || [];
          const migratedTasks = tasks.map((t: Task) => {
            if (t.isCompleted && t.lastCompletedAt && !t.nextAvailableAt) {
              const next = getNextAvailableDate(t);
              if (next) {
                return { ...t, nextAvailableAt: next.getTime() };
              }
            }
            return t;
          });
          return { ...(persistedState as Record<string, unknown>), tasks: migratedTasks };
        }
        return persistedState;
      },
    }
  )
);
