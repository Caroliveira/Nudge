import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { EffortLevel, Task } from '../types';
import { getTasksForLevel, pickRandomTask, getNextAvailableDate, isTaskAvailable } from '../utils/taskUtils';

export function useTaskActions() {
  const navigate = useNavigate();
  const { 
    tasks, 
    selectedLevel, 
    currentTask, 
    setSelectedLevel, 
    setCurrentTask, 
    setTasks 
  } = useStore();

  const selectLevel = (level: EffortLevel) => {
    const candidates = getTasksForLevel(tasks, level);
    
    if (candidates.length > 0) {
      const picked = pickRandomTask(candidates);
      setSelectedLevel(level);
      setCurrentTask(picked);
      navigate('/task');
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
      navigate('/');
  };

  const markTaskDone = () => {
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
      
      setTasks(updatedTasks);

      const remainingInLevel = updatedTasks.filter(t => t.level === selectedLevel && isTaskAvailable(t, new Date(now))).length;
      
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
