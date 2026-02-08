import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useTaskActions } from '../hooks/useTaskActions';
import { isOneTimeTask } from '../utils/taskUtils';
import AddTaskForm from '../components/AddTaskForm';
import CsvImport from '../components/CsvImport';
import TaskCatalogItem from '../components/TaskCatalogItem';
import { Task } from '../types';

const CatalogPage: React.FC = () => {
  const { tasks, addTask, updateTask, toggleTask, deleteTask } = useStore();
  const { backToSelection } = useTaskActions();
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'tasks' | 'archive'>('tasks');

  const filteredTasks = tasks.filter(t => {
    const oneTime = isOneTimeTask(t);
    if (view === 'tasks') return !oneTime || !t.isCompleted;
    if (view === 'archive') return oneTime && t.isCompleted;
    return false;
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6 fade-in flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl serif text-text">Task Catalog</h2>
        <button
          type="button"
          onClick={backToSelection}
          className="text-soft hover:text-accent transition-colors underline underline-offset-4"
        >
          Back to Nudge
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-surface pb-1">
        <button
          onClick={() => setView('tasks')}
          className={`pb-2 px-1 text-lg font-medium transition-colors relative ${
            view === 'tasks' ? 'text-text' : 'text-soft hover:text-text'
          }`}
        >
          Tasks
          {view === 'tasks' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
          )}
        </button>
        <button
          onClick={() => setView('archive')}
          className={`pb-2 px-1 text-lg font-medium transition-colors relative ${
            view === 'archive' ? 'text-text' : 'text-soft hover:text-text'
          }`}
        >
          Archive
          {view === 'archive' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 px-1">
        {isAdding ? (
          <AddTaskForm
            onSubmit={(task) => {
              addTask(task);
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        ) : editingTask ? (
          <AddTaskForm
            initialValues={editingTask}
            onSubmit={(updates) => {
              updateTask(editingTask.id, updates);
              setEditingTask(null);
            }}
            onCancel={() => setEditingTask(null)}
          />
        ) : (
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
        )}

        <ul className="space-y-3 pb-8">
          {filteredTasks.length === 0 && !isAdding && !editingTask && (
            <div className="text-center py-12 px-6">
              <p className="text-soft italic text-lg mb-2">
                {view === 'tasks' 
                  ? "Your catalog is quiet." 
                  : "No archived tasks."}
              </p>
              {view === 'tasks' && (
                <p className="text-soft text-sm opacity-60">
                  Add tasks you want to tackle later when you have the energy.
                </p>
              )}
            </div>
          )}
          {!editingTask && filteredTasks.map((task) => (
            <TaskCatalogItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={() => setEditingTask(task)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CatalogPage;
