import React, { useState } from 'react';
import { Task, EffortLevel, RecurrenceUnit } from '../types';
import { EFFORT_LABELS } from '../constants';

interface AddTaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
  initialValues?: Partial<Task>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [newTitle, setNewTitle] = useState(initialValues?.title || '');
  const [newLevel, setNewLevel] = useState<EffortLevel>(initialValues?.level || EffortLevel.LOW);
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(initialValues?.recurrenceInterval || 1);
  const [recurrenceUnit, setRecurrenceUnit] = useState<RecurrenceUnit>(initialValues?.recurrenceUnit || 'none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSubmit({
      title: newTitle,
      level: newLevel,
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
      className="bg-surface p-6 rounded-2xl space-y-6 fade-in border border-soft/20 shadow-sm"
      aria-label={initialValues ? 'Edit task' : 'Add new task'}
    >
      <div>
        <label htmlFor="task-title" className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Title</label>
        <input
          id="task-title"
          autoFocus
          className="w-full bg-warm border-none rounded-lg p-3 text-text focus:ring-2 focus:ring-accent outline-none text-lg"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What needs doing?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-effort" className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Effort Level</label>
          <select
            id="task-effort"
            className="w-full bg-warm border-none rounded-lg p-3 text-text focus:ring-2 focus:ring-accent outline-none appearance-none"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value as EffortLevel)}
          >
            {Object.values(EffortLevel).map((l) => (
              <option key={l} value={l}>
                {EFFORT_LABELS[l]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="task-recurrence-unit" className="block text-xs uppercase tracking-widest text-soft mb-2 font-bold">Recurrence</label>
          <div className="flex gap-2">
            {recurrenceUnit !== 'none' && (
              <input
                id="task-recurrence-interval"
                type="number"
                min={1}
                className="w-20 bg-warm border-none rounded-lg p-3 text-text focus:ring-2 focus:ring-accent outline-none"
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(parseInt(e.target.value, 10) || 1)}
                aria-label="Recurrence interval"
              />
            )}
            <select
              id="task-recurrence-unit"
              className="flex-1 bg-warm border-none rounded-lg p-3 text-text focus:ring-2 focus:ring-accent outline-none appearance-none"
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
          className="flex-2 bg-success text-warm py-4 rounded-xl hover:bg-success-dark transition-all font-bold text-lg shadow-md active:scale-95"
        >
          {initialValues ? 'Update Task' : 'Save Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-soft/10 text-soft py-4 rounded-xl hover:bg-soft/20 transition-all font-medium active:scale-95"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
