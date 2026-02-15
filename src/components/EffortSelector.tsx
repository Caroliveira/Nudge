import React from 'react';
import { useTranslation } from 'react-i18next';
import { EffortLevel } from '../types';
import EffortLevelButton from './EffortLevelButton';
import { useStore } from '../store/useStore';
import { useTaskActions } from '../hooks/useTaskActions';
import { useTaskAvailability } from '../hooks/useTaskAvailability';

const EffortSelector: React.FC = () => {
  const { t } = useTranslation();
  const tasks = useStore((state) => state.tasks);
  const { selectLevel } = useTaskActions();
  const { availableCounts } = useTaskAvailability();
  const hasAnyTasks = tasks.length > 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl text-text font-light">
          {!hasAnyTasks ? t('welcome') : t('home.whatCanYouHandle')}
        </h1>
        <p className="text-lg text-soft italic">
          {!hasAnyTasks
            ? t('home.addTasks')
            : t('home.selectLevel')}
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
