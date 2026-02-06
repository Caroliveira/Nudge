
import React from 'react';

interface TotalVictoryProps {
  onAddMore: () => void;
  nextRefreshDays: number | null;
}

const TotalVictory: React.FC<TotalVictoryProps> = ({ onAddMore, nextRefreshDays }) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto px-6 text-center space-y-10 fade-in">
      <div className="space-y-4">
        <div className="text-6xl mb-6">✨</div>
        <h2 className="text-4xl md:text-5xl serif italic text-[#586e75]">You’ve completed your quest!</h2>
        <h3 className="text-2xl md:text-3xl text-accent serif italic">Enjoy your rest.</h3>
        
        <div className="py-6">
          <p className="text-xl text-soft leading-relaxed max-w-md mx-auto">
            You've cleared your path. There are no more tasks waiting for your attention.
          </p>
          
          {nextRefreshDays !== null && (
            <div className="mt-8 p-6 bg-[#eee8d5]/30 rounded-2xl border border-[#eee8d5] fade-in">
              <p className="text-lg text-[#586e75] font-medium">
                Your next set of tasks will be ready in {nextRefreshDays} {nextRefreshDays === 1 ? 'day' : 'days'}.
              </p>
              <p className="text-soft mt-1">
                Come back then for new challenges!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={onAddMore}
          className="py-4 px-8 bg-transparent border-2 border-[#eee8d5] text-soft rounded-full text-lg font-medium hover:bg-[#eee8d5] hover:text-[#586e75] transition-all active:scale-95"
        >
          Add New Tasks
        </button>
      </div>
      
      <p className="text-sm text-soft opacity-60">
        You've found complete stillness for now. You earned it.
      </p>
    </div>
  );
};

export default TotalVictory;
