import React from 'react';
import { EffortLevel } from '../types';

interface EffortLevelButtonProps {
  level: EffortLevel;
  availableCount: number;
  onSelect: (level: EffortLevel) => void;
}

const EffortLevelButton: React.FC<EffortLevelButtonProps> = ({ level, availableCount, onSelect }) => {
  const isDisabled = availableCount === 0;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onSelect(level)}
      aria-label={
        isDisabled
          ? `${level}, no tasks available`
          : `${level}, ${availableCount} task${availableCount === 1 ? '' : 's'} available`
      }
      className={`group relative py-8 px-10 rounded-2xl transition-all duration-300 border shadow-sm active:scale-95 w-full
        ${
          isDisabled
            ? 'bg-transparent border-[#eee8d5] opacity-40 cursor-not-allowed'
            : 'bg-[#eee8d5] hover:bg-[#93a1a1] hover:text-[#fdf6e3] text-[#657b83] border-transparent hover:border-[#839496] hover:shadow-md'
        }`}
    >
      <span className="text-xl font-medium block">{level}</span>
      {!isDisabled && (
        <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-40 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
        </div>
      )}
    </button>
  );
};

export default EffortLevelButton;
