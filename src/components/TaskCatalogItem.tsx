import React from 'react';
import { Task } from '../types';
import { EFFORT_LABELS } from '../utils/taskUtils';
import SwipeableItem from './SwipeableItem';

interface TaskCatalogItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: () => void;
}

const TaskCatalogItem: React.FC<TaskCatalogItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  
  const renderDeleteAction = (offsetX: number) => (
    <div 
      className={`h-full w-full flex items-center justify-end pr-6 rounded-xl transition-colors ${
        offsetX < -150 ? 'bg-red-600' : 'bg-red-500'
      }`}
    >
      <button 
        onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
        }}
        className="text-white font-bold p-2 transition-transform"
        style={{ transform: offsetX < -150 ? 'scale(1.1)' : 'scale(1)' }}
        aria-label="Delete task"
      >
        {offsetX < -150 ? 'Release to Delete' : 'Delete'}
      </button>
    </div>
  );

  const renderEditAction = (offsetX: number) => (
    <div 
        className={`h-full w-full flex items-center justify-start pl-6 rounded-xl transition-colors ${
        offsetX > 150 ? 'bg-blue-600' : 'bg-blue-500'
        }`}
    >
        <button 
        onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
        }}
        className="text-white font-bold p-2 transition-transform"
        style={{ transform: offsetX > 150 ? 'scale(1.1)' : 'scale(1)' }}
        aria-label="Edit task"
        >
        {offsetX > 150 ? 'Release to Edit' : 'Edit'}
        </button>
    </div>
  );

  return (
    <SwipeableItem
      className="mb-3"
      onSwipeLeft={() => onDelete(task.id)}
      renderRightBackground={renderDeleteAction}
      onSwipeRight={onEdit}
      renderLeftBackground={onEdit ? renderEditAction : undefined}
    >
      <div
        className={`flex items-center gap-4 p-4 rounded-xl transition-transform duration-200 ease-out border ${
          task.isCompleted
            ? 'bg-warm border-surface'
            : 'bg-surface border-transparent shadow-sm'
        }`}
      >
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
            task.isCompleted ? 'bg-accent border-accent text-warm opacity-50' : 'border-soft hover:border-accent bg-warm'
          }`}
          aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.isCompleted && '✓'}
        </button>
        
        <div className={`flex-1 min-w-0 pointer-events-none ${task.isCompleted ? 'opacity-50' : ''}`}>
          <h4 className={`font-medium truncate ${task.isCompleted ? 'line-through text-soft' : 'text-text'}`}>
            {task.title}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-tighter text-soft mt-1">
            <span className="font-bold">{EFFORT_LABELS[task.level]}</span>
            {task.recurrenceUnit && task.recurrenceUnit !== 'none' && (
              <span className="px-1.5 py-0.5 bg-warm rounded italic">
                Every {task.recurrenceInterval} {task.recurrenceUnit}
              </span>
            )}
          </div>
        </div>
        
        {/* Slide hint (optional) */}
        <div className="text-soft opacity-20 text-lg">‹</div>
      </div>
    </SwipeableItem>
  );
};

export default TaskCatalogItem;
