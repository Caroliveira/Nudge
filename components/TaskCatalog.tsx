
import React, { useState } from 'react';
import { Task, EffortLevel, RecurrenceUnit } from '../types';

interface TaskCatalogProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onBack: () => void;
}

const TaskCatalog: React.FC<TaskCatalogProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask, onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLevel, setNewLevel] = useState<EffortLevel>(EffortLevel.LOW);
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [recurrenceUnit, setRecurrenceUnit] = useState<RecurrenceUnit>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle,
      description: newDesc,
      encouragement: "You've got this.",
      level: newLevel,
      isCustom: true,
      recurrenceInterval: recurrenceUnit !== 'none' ? recurrenceInterval : undefined,
      recurrenceUnit
    });
    setNewTitle('');
    setNewDesc('');
    setRecurrenceInterval(1);
    setRecurrenceUnit('none');
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 fade-in flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl serif text-[#586e75]">Task Catalog</h2>
        <button 
          onClick={onBack}
          className="text-soft hover:text-accent transition-colors underline underline-offset-4"
        >
          Back to Nudge
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-[#eee8d5] p-6 rounded-2xl space-y-4 fade-in border border-[#839496]/20">
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft mb-1">Title</label>
              <input 
                autoFocus
                className="w-full bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-1 focus:ring-accent outline-none"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What needs doing?"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft mb-1">Description (Optional)</label>
              <input 
                className="w-full bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-1 focus:ring-accent outline-none"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="A tiny detail..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-soft mb-1">Effort Level</label>
                <select 
                  className="w-full bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-1 focus:ring-accent outline-none"
                  value={newLevel}
                  onChange={e => setNewLevel(e.target.value as EffortLevel)}
                >
                  {Object.values(EffortLevel).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-soft mb-1">Recurrence</label>
                <div className="flex gap-2">
                  {recurrenceUnit !== 'none' && (
                    <input 
                      type="number"
                      min="1"
                      className="w-16 bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-1 focus:ring-accent outline-none"
                      value={recurrenceInterval}
                      onChange={e => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                    />
                  )}
                  <select 
                    className="flex-1 bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-1 focus:ring-accent outline-none"
                    value={recurrenceUnit}
                    onChange={e => setRecurrenceUnit(e.target.value as RecurrenceUnit)}
                  >
                    <option value="none">One-time</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-accent text-white py-2 rounded-lg hover:brightness-110 transition-all">Save Task</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-[#839496]/20 text-soft py-2 rounded-lg hover:bg-[#839496]/30 transition-all">Cancel</button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-[#eee8d5] rounded-2xl text-soft hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
          >
            <span className="text-2xl">+</span> Add a personal task
          </button>
        )}

        <div className="space-y-3">
          {tasks.length === 0 && !isAdding && (
            <p className="text-center text-soft italic py-12">Your catalog is quiet. Add tasks you want to tackle later.</p>
          )}
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-4 p-4 rounded-xl transition-all border ${task.isCompleted ? 'bg-transparent border-[#eee8d5] opacity-50' : 'bg-[#eee8d5]/50 border-transparent hover:border-[#839496]/30'}`}
            >
              <button 
                onClick={() => onToggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-accent border-accent text-[#fdf6e3]' : 'border-soft hover:border-accent'}`}
              >
                {task.isCompleted && '✓'}
              </button>
              <div className="flex-1">
                <h4 className={`font-medium ${task.isCompleted ? 'line-through text-soft' : 'text-[#586e75]'}`}>{task.title}</h4>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter text-soft mt-1">
                  <span>{task.level}</span>
                  {task.isCustom && <span className="px-1.5 py-0.5 bg-[#eee8d5] rounded">Personal</span>}
                  {task.recurrenceUnit && task.recurrenceUnit !== 'none' && (
                    <span className="px-1.5 py-0.5 bg-[#eee8d5] rounded italic">
                      Every {task.recurrenceInterval} {task.recurrenceUnit}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-soft hover:text-red-400 transition-all px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCatalog;
