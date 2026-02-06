import React from 'react';
import { EffortLevel } from '../types';
import EffortLevelButton from './EffortLevelButton';
import { useStore } from '../store/useStore';
import { useTaskAvailability } from '../hooks/useTaskAvailability';

const EffortSelector: React.FC = () => {
  const tasks = useStore((state) => state.tasks);
  const selectLevel = useStore((state) => state.selectLevel);
  const { availableCounts } = useTaskAvailability(tasks);
  const hasAnyTasks = tasks.length > 0;

  return (
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
            availableCount={availableCounts[level]}
            onSelect={selectLevel}
          />
        ))}
      </div>
    </div>
  );
};

export default EffortSelector;
