import { useState, useMemo } from 'react';
import { Task } from '../types';

export type CatalogView = 'tasks' | 'report';

export function useCatalogFilter(tasks: Task[]) {
  const [view, setView] = useState<CatalogView>('tasks');

  const filteredTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (a.isCompleted !== b.isCompleted) ? (a.isCompleted ? 1 : -1) : a.title.localeCompare(b.title));
  }, [tasks]);

  return {
    view,
    setView,
    filteredTasks
  };
}
