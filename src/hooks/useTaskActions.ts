import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { EffortLevel } from '../types';
import { getTasksForLevel, pickRandomTask, isTaskAvailable } from '../utils/taskUtils';
import { APP_ROUTES } from '../constants';

export function useTaskActions() {
  const navigate = useNavigate();
  const { 
    tasks, 
    selectedLevel, 
    currentTask, 
    setSelectedLevel, 
    setCurrentTask, 
    completeTask
  } = useStore();

  const selectLevel = (level: EffortLevel) => {
    const candidates = getTasksForLevel(tasks, level);
    
    if (candidates.length > 0) {
      const picked = pickRandomTask(candidates);
      setSelectedLevel(level);
      setCurrentTask(picked);
      navigate(APP_ROUTES.TASK);
    }
  };

  const refreshTask = () => {
    if (selectedLevel) {
      // Filter out the current task to ensure we get a new one if possible
      const candidates = getTasksForLevel(tasks, selectedLevel)
        .filter(t => t.id !== currentTask?.id);
      
      if (candidates.length > 0) {
        const picked = pickRandomTask(candidates);
        setCurrentTask(picked);
      } else {
         // If no other candidates, re-select (might pick the same one if it's the only one left)
         const allCandidates = getTasksForLevel(tasks, selectedLevel);
         if (allCandidates.length > 0) {
            const picked = pickRandomTask(allCandidates);
            setCurrentTask(picked);
         }
      }
    }
  };

  const backToSelection = () => {
      setSelectedLevel(null);
      setCurrentTask(null);
      navigate(APP_ROUTES.HOME);
  };

  const markTaskDone = () => {
    if (currentTask && selectedLevel) {
      completeTask(currentTask.id);
     
      const now = new Date();
      const remainingInLevel = tasks.filter(t => 
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
    refreshTask,
    markTaskDone,
    backToSelection
  };
}
