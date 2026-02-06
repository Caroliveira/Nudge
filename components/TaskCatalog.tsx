
import React, { useState, useRef } from 'react';
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
  const [importStatus, setImportStatus] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/);
      if (lines.length < 2) return;

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      let count = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Simple CSV parser handling basic commas (doesn't handle quoted commas for simplicity)
        const values = lines[i].split(',').map(v => v.trim());
        const taskData: any = {};
        
        headers.forEach((header, index) => {
          taskData[header] = values[index];
        });

        if (taskData.title || taskData.name) {
          // Map Effort
          let level = EffortLevel.LOW;
          const effortStr = (taskData.effort || taskData.level || '').toLowerCase();
          if (effortStr.includes('medium')) level = EffortLevel.MEDIUM;
          if (effortStr.includes('high')) level = EffortLevel.HIGH;

          // Map Recurrence
          const interval = parseInt(taskData.interval || taskData.recurrenceinterval) || 1;
          const unitRaw = (taskData.unit || taskData.recurrenceunit || 'none').toLowerCase() as RecurrenceUnit;
          const unit: RecurrenceUnit = ['days', 'weeks', 'months', 'years'].includes(unitRaw) ? unitRaw : 'none';

          onAddTask({
            title: taskData.title || taskData.name,
            description: taskData.description || taskData.desc || '',
            encouragement: "Imported challenge.",
            level,
            isCustom: true,
            recurrenceInterval: unit !== 'none' ? interval : undefined,
            recurrenceUnit: unit
          });
          count++;
        }
      }
      setImportStatus(`Successfully imported ${count} tasks.`);
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,title,description,effort,interval,unit\nRead a book,Chapter 1,Low,1,days\nDeep Work Session,Project Alpha,High,1,weeks";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "nudge_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <form onSubmit={handleSubmit} className="bg-[#eee8d5] p-6 rounded-2xl space-y-6 fade-in border border-[#839496]/20 shadow-sm">
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Title</label>
              <input 
                autoFocus
                className="w-full bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none text-lg"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What needs doing?"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Description (Optional)</label>
              <input 
                className="w-full bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="A tiny detail..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Effort Level</label>
                <select 
                  className="w-full bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none appearance-none"
                  value={newLevel}
                  onChange={e => setNewLevel(e.target.value as EffortLevel)}
                >
                  {Object.values(EffortLevel).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Recurrence</label>
                <div className="flex gap-2">
                  {recurrenceUnit !== 'none' && (
                    <input 
                      type="number"
                      min="1"
                      className="w-20 bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none"
                      value={recurrenceInterval}
                      onChange={e => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                    />
                  )}
                  <select 
                    className="flex-1 bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none appearance-none"
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

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                type="submit" 
                className="flex-[2] bg-[#859900] text-[#fdf6e3] py-4 rounded-xl hover:bg-[#718a00] transition-all font-bold text-lg shadow-md active:scale-95"
              >
                Save Task
              </button>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                className="flex-1 bg-[#839496]/10 text-soft py-4 rounded-xl hover:bg-[#839496]/20 transition-all font-medium active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full py-4 border-2 border-dashed border-[#eee8d5] rounded-2xl text-soft hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">+</span> 
              Add a personal task
            </button>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 px-4 bg-[#eee8d5]/40 border border-[#eee8d5] rounded-xl text-soft hover:bg-[#eee8d5] hover:text-[#586e75] transition-all text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Import CSV
              </button>
              <button 
                onClick={downloadTemplate}
                className="py-3 px-4 text-soft hover:text-accent transition-all text-xs underline underline-offset-4"
              >
                Get CSV Template
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportCSV} 
                accept=".csv" 
                className="hidden" 
              />
            </div>
            {importStatus && (
              <p className="text-center text-accent text-sm font-medium animate-pulse">{importStatus}</p>
            )}
          </div>
        )}

        <div className="space-y-3 pb-8">
          {tasks.length === 0 && !isAdding && (
            <div className="text-center py-12 px-6">
              <p className="text-soft italic text-lg mb-2">Your catalog is quiet.</p>
              <p className="text-soft text-sm opacity-60">Add tasks you want to tackle later when you have the energy.</p>
            </div>
          )}
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-4 p-4 rounded-xl transition-all border ${task.isCompleted ? 'bg-transparent border-[#eee8d5] opacity-50' : 'bg-[#eee8d5]/50 border-transparent hover:border-[#839496]/30 shadow-sm'}`}
            >
              <button 
                onClick={() => onToggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${task.isCompleted ? 'bg-accent border-accent text-[#fdf6e3]' : 'border-soft hover:border-accent bg-[#fdf6e3]'}`}
              >
                {task.isCompleted && '✓'}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${task.isCompleted ? 'line-through text-soft' : 'text-[#586e75]'}`}>{task.title}</h4>
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-tighter text-soft mt-1">
                  <span className="font-bold">{task.level}</span>
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
                className="opacity-0 group-hover:opacity-100 text-soft hover:text-red-400 transition-all p-2 shrink-0"
                aria-label="Delete task"
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
