import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EffortLevel, Task, StoreState } from '../types';
import { getNextAvailableDate } from '../utils/taskUtils';
import { STORAGE_KEY } from '../constants';


export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      tasks: [],
      currentTask: null,
      selectedLevel: null,

      setTasks: (tasks) => set({ tasks }),
      setCurrentTask: (currentTask) => set({ currentTask }),
      setSelectedLevel: (selectedLevel) => set({ selectedLevel }),
      
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
          return { ...t, ...updates };
        })
      })),

      deleteTask: (id) => set((state) => {
        const newTasks = state.tasks.filter((t) => t.id !== id);
        // If deleting current task, clear it
        if (state.currentTask?.id === id) {
             return { tasks: newTasks, currentTask: null };
        }
        return { tasks: newTasks };
      }),

      refreshRecurringTasks: () => set((state) => {
        const now = Date.now();
        const tasks = state.tasks.map((t) => {
          if (t.isCompleted && t.nextAvailableAt && now >= t.nextAvailableAt) {
            return {
              ...t,
              isCompleted: false,
              nextAvailableAt: undefined
            };
          }
          return t;
        });
        return { tasks };
      }),
    }),
    {
      name: STORAGE_KEY,
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
