import React from 'react';
import { EffortLevel } from '../types';
import EffortLevelButton from './EffortLevelButton';

interface EffortSelectorProps {
  onSelect: (level: EffortLevel) => void;
  availableTasks: Record<EffortLevel, number>;
  hasAnyTasks: boolean;
}

const EffortSelector: React.FC<EffortSelectorProps> = ({ onSelect, availableTasks, hasAnyTasks }) => (
  <div className="flex flex-col items-center justify-center space-y-8 fade-in">
    <div className="text-center space-y-2">
      <h1 className="text-4xl md:text-5xl text-[#586e75] font-light">
        {!hasAnyTasks ? 'Welcome to Nudge' : 'What can you handle?'}
      </h1>
      <p className="text-lg text-soft italic">
        {!hasAnyTasks
          ? 'Add some tasks to your catalog to get started.'
          : 'Select an energy level to find your next step.'}
      </p>
    </div>

    <div className="flex flex-col gap-4 w-full max-w-sm px-4">
      {Object.values(EffortLevel).map((level) => (
        <EffortLevelButton
          key={level}
          level={level}
          availableCount={availableTasks[level]}
          onSelect={onSelect}
        />
      ))}
    </div>
  </div>
);

export default EffortSelector;
