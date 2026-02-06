import React from 'react';
import { Task } from '../types';

interface TaskCatalogItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCatalogItem: React.FC<TaskCatalogItemProps> = ({ task, onToggle, onDelete }) => (
  <div
    className={`group flex items-center gap-4 p-4 rounded-xl transition-all border ${
      task.isCompleted
        ? 'bg-transparent border-[#eee8d5] opacity-50'
        : 'bg-[#eee8d5]/50 border-transparent hover:border-[#839496]/30 shadow-sm'
    }`}
  >
    <button
      type="button"
      onClick={() => onToggle(task.id)}
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
        task.isCompleted ? 'bg-accent border-accent text-[#fdf6e3]' : 'border-soft hover:border-accent bg-[#fdf6e3]'
      }`}
    >
      {task.isCompleted && '✓'}
    </button>
    <div className="flex-1 min-w-0">
      <h4 className={`font-medium truncate ${task.isCompleted ? 'line-through text-soft' : 'text-[#586e75]'}`}>
        {task.title}
      </h4>
      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-tighter text-soft mt-1">
        <span className="font-bold">{task.level}</span>
        {task.isCustom && (
          <span className="px-1.5 py-0.5 bg-[#eee8d5] rounded">Personal</span>
        )}
        {task.recurrenceUnit && task.recurrenceUnit !== 'none' && (
          <span className="px-1.5 py-0.5 bg-[#eee8d5] rounded italic">
            Every {task.recurrenceInterval} {task.recurrenceUnit}
          </span>
        )}
      </div>
    </div>
    <button
      type="button"
      onClick={() => onDelete(task.id)}
      className="opacity-0 group-hover:opacity-100 text-soft hover:text-red-400 transition-all p-2 shrink-0"
      aria-label="Delete task"
    >
      ✕
    </button>
  </div>
);

export default TaskCatalogItem;
