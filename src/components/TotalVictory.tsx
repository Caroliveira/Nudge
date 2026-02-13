import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskAvailability } from '../hooks/useTaskAvailability';

const TotalVictory: React.FC = () => {
  const { nextRefreshDays } = useTaskAvailability();
  const navigate = useNavigate();
  
  const handleAddMore = () => navigate('/catalog');

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto px-6 text-center space-y-10 fade-in">
      <div className="space-y-4">
        <div className="text-6xl mb-6">✨</div>
        <h2 className="text-4xl md:text-5xl serif italic text-text">You've completed your quest!</h2>
        <h3 className="text-2xl md:text-3xl text-accent serif italic">Enjoy your rest.</h3>

        <div className="py-6">
          <p className="text-xl text-soft leading-relaxed max-w-md mx-auto">
            You've cleared your path. There are no more tasks waiting for your attention.
          </p>
          {nextRefreshDays !== null && (
            <div className="mt-8 p-6 bg-surface/30 rounded-2xl border border-surface fade-in">
              <p className="text-lg text-text font-medium">
                Your next set of tasks will be ready in {nextRefreshDays} {nextRefreshDays === 1 ? 'day' : 'days'}.
              </p>
              <p className="text-soft mt-1">Come back then for new challenges!</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          type="button"
          onClick={handleAddMore}
          className="py-4 px-8 bg-transparent border-2 border-surface text-soft rounded-full text-lg font-medium hover:bg-surface hover:text-text transition-all active:scale-95"
        >
          Add New Tasks
        </button>
      </div>
    </div>
  );
};

export default TotalVictory;
