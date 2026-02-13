import { useState, useMemo } from 'react';
import { Task } from '../types';
import { isOneTimeTask } from '../utils/taskUtils';

export type CatalogView = 'tasks' | 'archive' | 'report';

export function useCatalogFilter(tasks: Task[]) {
  const [view, setView] = useState<CatalogView>('tasks');

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const oneTime = isOneTimeTask(t);
      if (view === 'tasks') return !oneTime || !t.isCompleted;
      if (view === 'archive') return oneTime && t.isCompleted;
      return false;
    });
  }, [tasks, view]);

  return {
    view,
    setView,
    filteredTasks
  };
}
