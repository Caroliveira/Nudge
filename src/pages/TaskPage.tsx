import React, { useMemo, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useTaskActions } from '../hooks/useTaskActions';
import { useTaskSession } from '../hooks/useTaskSession';
import { useTaskAvailability } from '../hooks/useTaskAvailability';
import Celebration from '../components/Celebration';
import CompletionFeedback from '../components/CompletionFeedback';
import TaskExhausted from '../components/TaskExhausted';
import { ENCOURAGEMENTS, APP_ROUTES } from '../constants';


const TaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTask, selectedLevel } = useStore();
  const { markTaskDone, backToSelection } = useTaskActions();
  const { isExhausted, refreshTask, resetLevel } = useTaskSession();
  const { availableCounts } = useTaskAvailability();
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionResult, setCompletionResult] = useState<{ levelCleared: boolean } | null>(null);

  const hasAlternatives = selectedLevel ? availableCounts[selectedLevel] > 1 : false;

  const encouragement = useMemo(() => {
    return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  }, [currentTask?.id]);

  const handleMarkDone = () => {
    const result = markTaskDone();
    setCompletionResult(result);
    setIsCompleting(true);
  };

  const handleFeedbackComplete = () => {
    if (completionResult?.levelCleared) {
      setIsCompleting(false);
      setShowCelebration(true);
    } else backToSelection();
  };

  useEffect(() => {
    if (!currentTask && !isExhausted) {
      navigate(APP_ROUTES.HOME);
    }
  }, [currentTask, isExhausted, navigate]);

  if (showCelebration) return <Celebration />;

  if (!currentTask && !isExhausted) return null;

  if (isExhausted) return <TaskExhausted onReset={resetLevel} onBack={backToSelection} />;

  if (!currentTask) return null;

  return (
    <>
      <AnimatePresence>
        {isCompleting && (
          <CompletionFeedback onComplete={handleFeedbackComplete} />
        )}
      </AnimatePresence>

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
    </>
  );
};

export default TaskPage;
