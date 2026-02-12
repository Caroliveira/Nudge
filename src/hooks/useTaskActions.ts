import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { EffortLevel } from '../types';
import { getTasksForLevel, pickRandomTask, isTaskAvailable, calculateTaskCompletion } from '../utils/taskUtils';
import { APP_ROUTES } from '../constants';

export function useTaskActions() {
  const navigate = useNavigate();
  const { 
    tasks, 
    selectedLevel, 
    currentTask, 
    setSelectedLevel, 
    setCurrentTask, 
    updateTask,
  } = useStore();

  const selectLevel = (level: EffortLevel) => {
    const candidates = getTasksForLevel(tasks, level);
    
    if (candidates.length > 0) {
      const picked = pickRandomTask(candidates);
      if (picked) {
        setSelectedLevel(level);
        setCurrentTask(picked);
        navigate(APP_ROUTES.TASK);
      }
    }
  };

  const backToSelection = () => {
      setSelectedLevel(null);
      setCurrentTask(null);
      navigate(APP_ROUTES.HOME);
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const updated = calculateTaskCompletion(task, !task.isCompleted);
      updateTask(id, updated);
    }
  };

  const markTaskDone = () => {
    if (currentTask && selectedLevel) {
      const updated = calculateTaskCompletion(currentTask, true);
      
      updateTask(currentTask.id, updated);
     
      const freshTasks = useStore.getState().tasks;
      const now = new Date();
      
      const remainingInLevel = freshTasks.filter(t => 
        t.id !== currentTask.id &&
        t.level === selectedLevel && 
        isTaskAvailable(t, now)
      ).length;
      
      return { levelCleared: remainingInLevel === 0 };
    } 
    return { levelCleared: false };
  };

  return {
    selectLevel,
    markTaskDone,
    backToSelection,
    toggleTask
  };
}
