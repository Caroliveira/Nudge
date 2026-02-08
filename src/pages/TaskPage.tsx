import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { useTaskActions } from '../hooks/useTaskActions';
import { useTaskAvailability } from '../hooks/useTaskAvailability';
import Celebration from '../components/Celebration';
import { ENCOURAGEMENTS } from '../constants';


const TaskPage: React.FC = () => {
  const { currentTask, selectedLevel, tasks } = useStore();
  const { markTaskDone, backToSelection, refreshTask } = useTaskActions();
  const { availableCounts } = useTaskAvailability(tasks);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const hasAlternatives = selectedLevel ? availableCounts[selectedLevel] > 1 : false;

  const encouragement = useMemo(() => {
    return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  }, [currentTask?.id]);

  const handleMarkDone = () => {
    const result = markTaskDone();
    if (result.levelCleared) setShowCelebration(true);
    else backToSelection();
  };

  if (showCelebration) return <Celebration />;

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
          onClick={handleMarkDone}
          className="w-full py-4 px-8 bg-success text-warm rounded-full text-lg font-medium hover:bg-success-dark transition-colors shadow-sm active:scale-95"
        >
          Mark as complete
        </button>
        {hasAlternatives && (
          <button
            onClick={refreshTask}
            className="w-full py-4 px-8 bg-transparent border-2 border-surface text-soft rounded-full text-lg font-medium hover:bg-surface hover:text-text transition-all active:scale-95"
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

export default TaskPage;
