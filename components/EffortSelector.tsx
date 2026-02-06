
import React from 'react';
import { EffortLevel } from '../types';

interface EffortSelectorProps {
  onSelect: (level: EffortLevel) => void;
  availableTasks: Record<EffortLevel, number>;
  hasAnyTasks: boolean;
}

const EffortSelector: React.FC<EffortSelectorProps> = ({ onSelect, availableTasks, hasAnyTasks }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl text-[#586e75] font-light">
          {!hasAnyTasks ? "Welcome to Nudge" : "What can you handle?"}
        </h1>
        <p className="text-lg text-soft italic">
          {!hasAnyTasks 
            ? "Add some tasks to your catalog to get started." 
            : "Select an energy level to find your next step."}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl px-4">
        {Object.values(EffortLevel).map((level) => {
          const count = availableTasks[level];
          const isDisabled = count === 0;
          
          return (
            <button
              key={level}
              disabled={isDisabled}
              onClick={() => onSelect(level)}
              className={`group relative p-10 rounded-2xl transition-all duration-300 border shadow-sm active:scale-95
                ${isDisabled 
                  ? 'bg-transparent border-[#eee8d5] opacity-40 cursor-not-allowed' 
                  : 'bg-[#eee8d5] hover:bg-[#93a1a1] hover:text-[#fdf6e3] text-[#657b83] border-transparent hover:border-[#839496] hover:shadow-md'
                }`}
            >
              <span className="text-xl font-medium block">{level}</span>
              {!isDisabled && (
                <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-40 transition-opacity">
                   <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EffortSelector;
