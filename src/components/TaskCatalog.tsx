import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import AddTaskForm from './AddTaskForm';
import CsvImport from './CsvImport';
import TaskCatalogItem from './TaskCatalogItem';

const TaskCatalog: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, backToSelection } = useStore();
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 fade-in flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl serif text-[#586e75]">Task Catalog</h2>
        <button
          type="button"
          onClick={backToSelection}
          className="text-soft hover:text-accent transition-colors underline underline-offset-4"
        >
          Back to Nudge
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {isAdding ? (
          <AddTaskForm
            onSubmit={(task) => {
              addTask(task);
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-[#eee8d5] rounded-2xl text-soft hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">+</span>
              Add a personal task
            </button>
            <CsvImport onAddTask={addTask} />
          </div>
        )}

        <div className="space-y-3 pb-8">
          {tasks.length === 0 && !isAdding && (
            <div className="text-center py-12 px-6">
              <p className="text-soft italic text-lg mb-2">Your catalog is quiet.</p>
              <p className="text-soft text-sm opacity-60">
                Add tasks you want to tackle later when you have the energy.
              </p>
            </div>
          )}
          {tasks.map((task) => (
            <TaskCatalogItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCatalog;
