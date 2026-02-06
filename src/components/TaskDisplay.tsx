
import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useTaskAvailability } from '../hooks/useTaskAvailability';

const ENCOURAGEMENTS = [
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

const TaskDisplay: React.FC = () => {
  const { currentTask, selectedLevel, markTaskDone, backToSelection, refreshTask, tasks } = useStore();
  const { availableCounts } = useTaskAvailability(tasks);
  
  const hasAlternatives = selectedLevel ? availableCounts[selectedLevel] > 1 : false;

  const encouragement = useMemo(() => {
    return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  }, [currentTask?.id]);

  if (!currentTask) return null;

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-6 text-center space-y-12 fade-in">
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl text-accent serif italic">{currentTask.title}</h2>
        <p className="text-md text-soft max-w-md mx-auto italic">
          "{encouragement}"
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <button
          onClick={markTaskDone}
          className="w-full py-4 px-8 bg-[#859900] text-[#fdf6e3] rounded-full text-lg font-medium hover:bg-[#718a00] transition-colors shadow-sm active:scale-95"
        >
          Mark as complete
        </button>
        {hasAlternatives && (
          <button
            onClick={refreshTask}
            className="w-full py-4 px-8 bg-transparent border-2 border-[#eee8d5] text-soft rounded-full text-lg font-medium hover:bg-[#eee8d5] hover:text-[#586e75] transition-all active:scale-95"
          >
            Something else
          </button>
        )}
      </div>
      
      <button 
        onClick={backToSelection}
        className="text-soft hover:text-accent transition-colors text-sm underline underline-offset-4"
      >
        Go back to selection
      </button>
    </div>
  );
};

export default TaskDisplay;
