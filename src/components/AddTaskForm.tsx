import React, { useState } from 'react';
import { Task, EffortLevel, RecurrenceUnit } from '../types';

interface AddTaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit, onCancel }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newLevel, setNewLevel] = useState<EffortLevel>(EffortLevel.LOW);
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [recurrenceUnit, setRecurrenceUnit] = useState<RecurrenceUnit>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSubmit({
      title: newTitle,
      level: newLevel,
      isCustom: true,
      recurrenceInterval: recurrenceUnit !== 'none' ? recurrenceInterval : undefined,
      recurrenceUnit,
    });
    setNewTitle('');
    setRecurrenceInterval(1);
    setRecurrenceUnit('none');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#eee8d5] p-6 rounded-2xl space-y-6 fade-in border border-[#839496]/20 shadow-sm"
    >
      <div>
        <label className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Title</label>
        <input
          autoFocus
          className="w-full bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none text-lg"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What needs doing?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Effort Level</label>
          <select
            className="w-full bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none appearance-none"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value as EffortLevel)}
          >
            {Object.values(EffortLevel).map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Recurrence</label>
          <div className="flex gap-2">
            {recurrenceUnit !== 'none' && (
              <input
                type="number"
                min={1}
                className="w-20 bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none"
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(parseInt(e.target.value, 10) || 1)}
              />
            )}
            <select
              className="flex-1 bg-[#fdf6e3] border-none rounded-lg p-3 text-[#586e75] focus:ring-2 focus:ring-accent outline-none appearance-none"
              value={recurrenceUnit}
              onChange={(e) => setRecurrenceUnit(e.target.value as RecurrenceUnit)}
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
          onClick={onCancel}
          className="flex-1 bg-[#839496]/10 text-soft py-4 rounded-xl hover:bg-[#839496]/20 transition-all font-medium active:scale-95"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
