
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppState, EffortLevel, Task, RecurrenceUnit } from './types';
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

  useEffect(() => {
    localStorage.setItem('nudge_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Helper to determine if a task is currently available for completion
  const isTaskAvailable = useCallback((task: Task): boolean => {
    if (!task.isCompleted) return true;
    if (!task.recurrenceUnit || task.recurrenceUnit === 'none' || !task.lastCompletedAt) return false;

    const last = new Date(task.lastCompletedAt);
    const interval = task.recurrenceInterval || 1;

    switch (task.recurrenceUnit) {
      case 'days':
        last.setDate(last.getDate() + interval);
        break;
      case 'weeks':
        last.setDate(last.getDate() + interval * 7);
        break;
      case 'months':
        last.setMonth(last.getMonth() + interval);
        break;
      case 'years':
        last.setFullYear(last.getFullYear() + interval);
        break;
      default:
        return false;
    }
    return Date.now() >= last.getTime();
  }, []);

  // Available (incomplete or recurring) tasks in each level
  const availableCounts = useMemo(() => {
    return {
      [EffortLevel.LOW]: tasks.filter(t => t.level === EffortLevel.LOW && isTaskAvailable(t)).length,
      [EffortLevel.MEDIUM]: tasks.filter(t => t.level === EffortLevel.MEDIUM && isTaskAvailable(t)).length,
      [EffortLevel.HIGH]: tasks.filter(t => t.level === EffortLevel.HIGH && isTaskAvailable(t)).length,
    };
  }, [tasks, isTaskAvailable]);

  const totalIncomplete = useMemo(() => {
    return tasks.filter(t => isTaskAvailable(t)).length;
  }, [tasks, isTaskAvailable]);

  const hasAnyTasks = tasks.length > 0;

  // Calculate the soonest refresh time among all completed recurring tasks
  const nextRefreshDays = useMemo(() => {
    const recurringTasks = tasks.filter(t => t.isCompleted && t.recurrenceUnit && t.recurrenceUnit !== 'none' && t.lastCompletedAt);
    if (recurringTasks.length === 0) return null;

    const nextTimes = recurringTasks.map(task => {
      const date = new Date(task.lastCompletedAt!);
      const interval = task.recurrenceInterval || 1;
      switch (task.recurrenceUnit) {
        case 'days': date.setDate(date.getDate() + interval); break;
        case 'weeks': date.setDate(date.getDate() + interval * 7); break;
        case 'months': date.setMonth(date.getMonth() + interval); break;
        case 'years': date.setFullYear(date.getFullYear() + interval); break;
      }
      return date.getTime();
    });

    const soonest = Math.min(...nextTimes);
    const diffMs = soonest - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; // Default to at least 1 day if it's very soon
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
        setState('selection');
        setCurrentTask(null);
        setSelectedLevel(null);
      }
    } else {
      setState('selection');
      setCurrentTask(null);
      setSelectedLevel(null);
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

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.isCompleted || (t.recurrenceUnit && t.recurrenceUnit !== 'none')));
    setState('selection');
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-warm p-4 select-none">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#eee8d5] rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#eee8d5] rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-4xl flex items-center justify-center">
        {state === 'selection' && (
          <div className="w-full flex flex-col items-center">
            <EffortSelector 
              onSelect={handleSelectLevel} 
              availableTasks={availableCounts}
              hasAnyTasks={hasAnyTasks}
            />
            <button 
              onClick={() => setState('catalog')}
              className="mt-12 text-soft hover:text-accent transition-colors flex items-center gap-2 group"
            >
              <span className="w-8 h-[1px] bg-soft group-hover:bg-accent transition-colors"></span>
              Task Catalog & Personal Planning
              <span className="w-8 h-[1px] bg-soft group-hover:bg-accent transition-colors"></span>
            </button>
          </div>
        )}

        {state === 'task' && currentTask && selectedLevel && (
          <TaskDisplay 
            task={currentTask} 
            onDone={handleMarkDone} 
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
            onReset={clearCompleted}
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
      </div>

      {state !== 'catalog' && state !== 'celebration' && state !== 'total-victory' && (
        <footer className="fixed bottom-8 text-center w-full z-10">
          <p className="text-xs text-soft opacity-50 uppercase tracking-widest font-medium">
            Be intentional with your energy.
          </p>
        </footer>
      )}
    </main>
  );
};

export default App;
