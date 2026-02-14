import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useTaskActions } from '../hooks/useTaskActions';
import { useCatalogFilter, CatalogView } from '../hooks/useCatalogFilter';
import { isOneTimeTask } from '../utils/taskUtils';
import TaskForm from '../components/TaskForm';
import CsvImport from '../components/CsvImport';
import CatalogReport from '../components/CatalogReport';
import CatalogList from '../components/CatalogList';
import { Task } from '../types';

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

  const renderContent = () => {
    if (isAdding) {
      return (
        <TaskForm
          onSubmit={(taskData) => {
            addTask({ ...taskData, id: crypto.randomUUID() });
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      );
    }

    if (editingTask) {
      return (
        <TaskForm
          initialValues={editingTask}
          onSubmit={(updates) => {
            updateTask(editingTask.id, updates);
            setEditingTask(null);
          }}
          onCancel={() => setEditingTask(null)}
        />
      );
    }

    if (view === 'report') {
      return <CatalogReport tasks={tasks} />;
    }

    return (
      <>
        <div className="space-y-4">
          {view === 'tasks' && (
            <>
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="w-full py-4 border-2 border-dashed border-surface rounded-2xl text-soft hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">+</span>
                Add a personal task
              </button>
              <CsvImport />
            </>
          )}
        </div>

        <CatalogList
          tasks={filteredTasks}
          view={view}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={(task) => setEditingTask(task)}
        />
      </>
    );
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

      <div className="bg-surface/30 p-1.5 rounded-2xl flex items-center mb-8 relative" role="tablist" aria-label="Catalog views">
        <button
          onClick={() => handleTabChange('tasks')}
          role="tab"
          aria-selected={view === 'tasks'}
          aria-controls="catalog-panel"
          id="tab-tasks"
          className={`flex-1 relative py-3 text-sm font-bold rounded-xl transition-colors z-10 ${
            view === 'tasks' ? 'text-text' : 'text-soft hover:text-text/80'
          }`}
        >
          {view === 'tasks' && (
            <motion.div
              layoutId="activeCatalogTab"
              className="absolute inset-0 bg-white/70 shadow-sm rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: -1 }}
            />
          )}
          Tasks
        </button>

        {hasArchivedTasks && (
          <button
            onClick={() => handleTabChange('archive')}
            role="tab"
            aria-selected={view === 'archive'}
            aria-controls="catalog-panel"
            id="tab-archive"
            className={`flex-1 relative py-3 text-sm font-bold rounded-xl transition-colors z-10 ${
              view === 'archive' ? 'text-text' : 'text-soft hover:text-text/80'
            }`}
          >
            {view === 'archive' && (
              <motion.div
                layoutId="activeCatalogTab"
                className="absolute inset-0 bg-white/70 shadow-sm rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                style={{ zIndex: -1 }}
              />
            )}
            Archive
          </button>
        )}

        <button
          onClick={() => handleTabChange('report')}
          role="tab"
          aria-selected={view === 'report'}
          aria-controls="catalog-panel"
          id="tab-report"
          className={`flex-1 relative py-3 text-sm font-bold rounded-xl transition-colors z-10 ${
            view === 'report' ? 'text-text' : 'text-soft hover:text-text/80'
          }`}
        >
          {view === 'report' && (
            <motion.div
              layoutId="activeCatalogTab"
              className="absolute inset-0 bg-white/70 shadow-sm rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: -1 }}
            />
          )}
          Report
        </button>
      </div>

      <div
        id="catalog-panel"
        role="tabpanel"
        aria-labelledby={`tab-${view}`}
        className="flex-1 overflow-y-auto pr-2 space-y-6 px-1"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default CatalogPage;
