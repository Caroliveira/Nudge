
import React from 'react';
import { Task } from '../types';

interface TaskDisplayProps {
  task: Task;
  onDone: () => void;
  onRefresh: () => void;
  hasAlternatives: boolean;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ task, onDone, onRefresh, hasAlternatives }) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-6 text-center space-y-12 fade-in">
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl text-accent serif italic">{task.title}</h2>
        <p className="text-md text-soft max-w-md mx-auto italic">
          "{task.encouragement}"
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <button
          onClick={onDone}
          className="w-full py-4 px-8 bg-[#859900] text-[#fdf6e3] rounded-full text-lg font-medium hover:bg-[#718a00] transition-colors shadow-sm active:scale-95"
        >
          Mark as complete
        </button>
        {hasAlternatives && (
          <button
            onClick={onRefresh}
            className="w-full py-4 px-8 bg-transparent border-2 border-[#eee8d5] text-soft rounded-full text-lg font-medium hover:bg-[#eee8d5] hover:text-[#586e75] transition-all active:scale-95"
          >
            Something else
          </button>
        )}
      </div>
      
      <button 
        onClick={() => onDone()} // Simply navigate back
        className="text-soft hover:text-accent transition-colors text-sm underline underline-offset-4"
      >
        Go back to selection
      </button>
    </div>
  );
};

export default TaskDisplay;
