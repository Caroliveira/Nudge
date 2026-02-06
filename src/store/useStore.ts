import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, EffortLevel, Task } from '../types';
import { isTaskAvailable } from '../hooks/useTaskAvailability';

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

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? { ...t, isCompleted: !t.isCompleted, lastCompletedAt: !t.isCompleted ? Date.now() : t.lastCompletedAt }
            : t
        )
      })),

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
        const candidates = tasks.filter(t => t.level === level && isTaskAvailable(t));
        
        if (candidates.length > 0) {
          const picked = candidates[Math.floor(Math.random() * candidates.length)];
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
          const candidates = tasks.filter(t => t.level === selectedLevel && isTaskAvailable(t) && t.id !== currentTask?.id);
          if (candidates.length > 0) {
            const picked = candidates[Math.floor(Math.random() * candidates.length)];
            set({ currentTask: picked });
          } else {
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
          const updatedTasks = tasks.map(t => 
            t.id === currentTask.id 
              ? { ...t, isCompleted: true, lastCompletedAt: now } 
              : t
          );
          
          set({ tasks: updatedTasks });

          const remainingInLevel = updatedTasks.filter(t => t.level === selectedLevel && isTaskAvailable(t)).length;
          
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
    }
  )
);
