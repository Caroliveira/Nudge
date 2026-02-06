import React from 'react';
import { EffortLevel } from '../types';
import { useStore } from '../store/useStore';

const LEVEL_CONTENT: Record<EffortLevel, { title: string; message: string; color: string }> = {
  [EffortLevel.LOW]: {
    title: "Level Cleared",
    message: "A steady ripple leads to a calm sea. You're finding your rhythm.",
    color: "text-[#b58900]"
  },
  [EffortLevel.MEDIUM]: {
    title: "Incredible Progress",
    message: "You tackled the core of your day with grace. You're truly in the flow now.",
    color: "text-[#859900]"
  },
  [EffortLevel.HIGH]: {
    title: "Absolute Powerhouse",
    message: "You've conquered the heavy lifting. The mountain is behind you. Time for a well-deserved rest.",
    color: "text-[#268bd2]"
  },
};

const Celebration: React.FC = () => {
  const { selectedLevel, backToSelection } = useStore();
  
  if (!selectedLevel) return null;

  const content = LEVEL_CONTENT[selectedLevel];

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-6 text-center space-y-8 fade-in">
      <div className="space-y-4">
        <div className="inline-block p-4 bg-[#eee8d5] rounded-full mb-4 animate-bounce">
          <svg className={`w-12 h-12 ${content.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className={`text-4xl md:text-5xl serif italic ${content.color}`}>{content.title}</h2>
        <p className="text-xl md:text-2xl text-[#586e75] leading-relaxed">
          {content.message}
        </p>
      </div>

      <button
        onClick={backToSelection}
        className="w-full max-w-xs py-4 px-8 bg-[#586e75] text-[#fdf6e3] rounded-full text-lg font-medium hover:bg-[#657b83] transition-colors shadow-sm active:scale-95"
      >
        Back to Start
      </button>
    </div>
  );
};

export default Celebration;
