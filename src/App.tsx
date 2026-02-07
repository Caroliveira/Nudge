import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useTaskAvailability } from './hooks/useTaskAvailability';
import AppLayout from './components/AppLayout';
import EffortSelector from './components/EffortSelector';
import TaskDisplay from './components/TaskDisplay';
import TaskCatalog from './components/TaskCatalog';
import Celebration from './components/Celebration';
import TotalVictory from './components/TotalVictory';

const App: React.FC = () => {
  const { appState, setAppState, tasks } = useStore();
  const { totalIncomplete } = useTaskAvailability(tasks);
  const hasAnyTasks = tasks.length > 0;

  // Handle transitions between Selection and Total Victory
  useEffect(() => {
    if (appState === 'total-victory' && totalIncomplete > 0) {
      setAppState('selection');
    } else if (appState === 'selection' && hasAnyTasks && totalIncomplete === 0) {
      setAppState('total-victory');
    }
  }, [appState, totalIncomplete, hasAnyTasks, setAppState]);

  return (
    <AppLayout state={appState}>
      {appState === 'selection' && (
          <div className="w-full flex flex-col items-center">
            <EffortSelector />
            <button
              type="button"
              onClick={() => setAppState('catalog')}
              className="mt-12 text-soft hover:text-accent transition-colors flex items-center gap-2 group"
            >
              <span className="w-8 h-px bg-soft group-hover:bg-accent transition-colors" />
              Task Catalog & Personal Planning
              <span className="w-8 h-px bg-soft group-hover:bg-accent transition-colors" />
            </button>
          </div>
        )}

        {appState === 'task' && (
          <TaskDisplay />
        )}

        {appState === 'celebration' && (
          <Celebration />
        )}

        {appState === 'total-victory' && (
          <TotalVictory />
        )}

        {appState === 'catalog' && (
          <TaskCatalog />
        )}
    </AppLayout>
  );
};

export default App;
