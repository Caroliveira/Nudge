import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useTaskActions } from '../hooks/useTaskActions';
import { useCatalogFilter, CatalogView } from '../hooks/useCatalogFilter';
import { isOneTimeTask } from '../utils/taskUtils';
import { Task } from '../types';
import CatalogTabs from '../components/CatalogTabs';
import CatalogContent from '../components/CatalogContent';

const CatalogPage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const { backToSelection, toggleTask } = useTaskActions();
  const { view, setView, filteredTasks } = useCatalogFilter(tasks);

  const hasArchivedTasks = tasks.some(t => isOneTimeTask(t) && t.isCompleted);

  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTabChange = (newView: CatalogView) => {
    setView(newView);
    setIsAdding(false);
    setEditingTask(null);
  };

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    addTask({ ...taskData, id: crypto.randomUUID() });
    setIsAdding(false);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    setEditingTask(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 fade-in flex flex-col h-[85dvh]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl serif text-text">Task Catalog</h2>
        <button
          type="button"
          onClick={backToSelection}
          className="text-soft hover:text-accent transition-colors flex items-center gap-2 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="underline underline-offset-4">Back</span>
        </button>
      </div>

      <CatalogTabs 
        view={view} 
        onViewChange={handleTabChange} 
        hasArchivedTasks={hasArchivedTasks} 
      />

      <div
        id="catalog-panel"
        role="tabpanel"
        aria-labelledby={`tab-${view}`}
        className="flex-1 overflow-y-auto pr-2 space-y-6 px-1"
      >
        <CatalogContent
          view={view}
          isAdding={isAdding}
          editingTask={editingTask}
          tasks={tasks}
          filteredTasks={filteredTasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          onCancelEdit={() => {
            setIsAdding(false);
            setEditingTask(null);
          }}
          onStartAdd={() => setIsAdding(true)}
          onStartEdit={setEditingTask}
        />
      </div>
    </div>
  );
};

export default CatalogPage;
