import { useState, useMemo } from 'react';
import { Task } from '../types';
import { isOneTimeTask } from '../utils/taskUtils';

export type CatalogView = 'tasks' | 'archive' | 'report';

export function useCatalogFilter(tasks: Task[]) {
  const [view, setView] = useState<CatalogView>('tasks');

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter(t => {
      const oneTime = isOneTimeTask(t);
      if (view === 'tasks') return !oneTime || !t.isCompleted;
      if (view === 'archive') return oneTime && t.isCompleted;
      return false;
    });

    return filtered.sort((a, b) => (a.isCompleted !== b.isCompleted) ? (a.isCompleted ? 1 : -1) : a.title.localeCompare(b.title));
  }, [tasks, view]);

  return {
    view,
    setView,
    filteredTasks
  };
}
