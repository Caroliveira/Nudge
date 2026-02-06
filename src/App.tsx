import React, { useState, useEffect } from 'react';
import { AppState, EffortLevel, Task } from './types';
import { useTaskAvailability } from './hooks/useTaskAvailability';
import AppLayout from './components/AppLayout';
import EffortSelector from './components/EffortSelector';
import TaskDisplay from './components/TaskDisplay';
import TaskCatalog from './components/TaskCatalog';
import Celebration from './components/Celebration';
import TotalVictory from './components/TotalVictory';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('selection');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EffortLevel | null>(null);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nudge_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const { isTaskAvailable, availableCounts, totalIncomplete, nextRefreshDays } = useTaskAvailability(tasks);
  const hasAnyTasks = tasks.length > 0;

  useEffect(() => {
    localStorage.setItem('nudge_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle transitions between Selection and Total Victory
  useEffect(() => {
    if (state === 'total-victory' && totalIncomplete > 0) {
      setState('selection');
    } else if (state === 'selection' && hasAnyTasks && totalIncomplete === 0) {
      setState('total-victory');
    }
  }, [state, totalIncomplete, hasAnyTasks]);

  const handleSelectLevel = (level: EffortLevel) => {
    const candidates = tasks.filter(t => t.level === level && isTaskAvailable(t));
    
    if (candidates.length > 0) {
      setSelectedLevel(level);
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      setCurrentTask(picked);
      setState('task');
    }
  };

  const handleRefresh = () => {
    if (selectedLevel) {
      const candidates = tasks.filter(t => t.level === selectedLevel && isTaskAvailable(t) && t.id !== currentTask?.id);
      if (candidates.length > 0) {
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        setCurrentTask(picked);
      } else {
        handleSelectLevel(selectedLevel);
      }
    }
  };

  const handleBackToSelection = () => {
        setState('selection');
        setCurrentTask(null);
        setSelectedLevel(null);
  }

  const handleMarkDone = () => {
    if (currentTask && selectedLevel) {
      const now = Date.now();
      const updatedTasks = tasks.map(t => 
        t.id === currentTask.id 
          ? { ...t, isCompleted: true, lastCompletedAt: now } 
          : t
      );
      setTasks(updatedTasks);

      const remainingInLevel = updatedTasks.filter(t => t.level === selectedLevel && isTaskAvailable(t)).length;
      
      if (remainingInLevel === 0) {
        setState('celebration');
      } else {
        handleBackToSelection()
      }
    } else {
      handleBackToSelection()
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      isCompleted: false
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, isCompleted: !t.isCompleted, lastCompletedAt: !t.isCompleted ? Date.now() : t.lastCompletedAt } 
        : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (currentTask?.id === id) {
      setState('selection');
      setCurrentTask(null);
    }
  };

  return (
    <AppLayout state={state}>
      {state === 'selection' && (
          <div className="w-full flex flex-col items-center">
            <EffortSelector 
              onSelect={handleSelectLevel} 
              availableTasks={availableCounts}
              hasAnyTasks={hasAnyTasks}
            />
            <button
              type="button"
              onClick={() => setState('catalog')}
              className="mt-12 text-soft hover:text-accent transition-colors flex items-center gap-2 group"
            >
              <span className="w-8 h-[1px] bg-soft group-hover:bg-accent transition-colors" />
              Task Catalog & Personal Planning
              <span className="w-8 h-[1px] bg-soft group-hover:bg-accent transition-colors" />
            </button>
          </div>
        )}

        {state === 'task' && currentTask && selectedLevel && (
          <TaskDisplay 
            task={currentTask} 
            onDone={handleMarkDone} 
            onBack={handleBackToSelection}
            onRefresh={handleRefresh}
            hasAlternatives={availableCounts[selectedLevel] > 1}
          />
        )}

        {state === 'celebration' && selectedLevel && (
          <Celebration 
            level={selectedLevel} 
            onBack={() => {
              setState('selection');
              setSelectedLevel(null);
              setCurrentTask(null);
            }} 
          />
        )}

        {state === 'total-victory' && (
          <TotalVictory 
            onAddMore={() => setState('catalog')}
            nextRefreshDays={nextRefreshDays}
          />
        )}

        {state === 'catalog' && (
          <TaskCatalog 
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onBack={() => setState('selection')}
          />
        )}
    </AppLayout>
  );
};

export default App;
