import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EffortLevel, Task } from '../types';
import { calculateTaskCompletion, getNextAvailableDate } from '../utils/taskUtils';

interface StoreState {
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
  toggleTask: (id: string) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

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
          
          const updatedTask = { ...t, ...updates };
          
          if ('isCompleted' in updates) return calculateTaskCompletion(updatedTask, !!updates.isCompleted);
          
          return updatedTask;
        })
      })),

      toggleTask: (id) => set((state) => {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return {};

        return {
          tasks: state.tasks.map((t) =>
            t.id === id ? calculateTaskCompletion(t, !t.isCompleted) : t
          )
        };
      }),

      completeTask: (id) => set((state) => {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return {};

        return {
          tasks: state.tasks.map((t) =>
            t.id === id ? calculateTaskCompletion(t, true) : t
          )
        };
      }),

      deleteTask: (id) => set((state) => {
        const newTasks = state.tasks.filter((t) => t.id !== id);
        // If deleting current task, clear it
        if (state.currentTask?.id === id) {
             return { tasks: newTasks, currentTask: null };
        }
        return { tasks: newTasks };
      }),
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
