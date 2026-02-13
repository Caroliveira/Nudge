import React, { useMemo, useState } from 'react';
import { isToday } from 'date-fns';
import { Task, EffortLevel, RecurrenceUnit } from '../types';

interface CatalogReportProps {
  tasks: Task[];
}

const EFFORT_COLORS = {
  [EffortLevel.LOW]: 'text-green-600 bg-green-100',
  [EffortLevel.MEDIUM]: 'text-amber-600 bg-amber-100',
  [EffortLevel.HIGH]: 'text-red-600 bg-red-100',
};

const EFFORT_BAR_COLORS = {
  [EffortLevel.LOW]: 'bg-green-500',
  [EffortLevel.MEDIUM]: 'bg-amber-500',
  [EffortLevel.HIGH]: 'bg-red-500',
};

const RECURRENCE_LABELS: Record<RecurrenceUnit, string> = {
  'days': 'Daily',
  'weeks': 'Weekly',
  'months': 'Monthly',
  'years': 'Yearly',
  'none': 'One-off'
};

const CatalogReport: React.FC<CatalogReportProps> = ({ tasks }) => {
  const [viewMode, setViewMode] = useState<'effort' | 'recurrence'>('effort');

  const stats = useMemo(() => {
    const effortDist = {
      [EffortLevel.LOW]: 0,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 0,
    };

    const recurrenceDist: Record<RecurrenceUnit, number> = {
      'days': 0,
      'weeks': 0,
      'months': 0,
      'years': 0,
      'none': 0
    };

    const totalDone = {
      [EffortLevel.LOW]: 0,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 0,
    };
    const totalLeft = {
      [EffortLevel.LOW]: 0,
      [EffortLevel.MEDIUM]: 0,
      [EffortLevel.HIGH]: 0,
    };

    let hasActivityToday = false;
    const registeredUnits = new Set<RecurrenceUnit>();

    tasks.forEach(task => {
      const unit = task.recurrenceUnit || 'none';
      registeredUnits.add(unit);

      // Activity Today Logic
      if (task.isCompleted && task.lastCompletedAt && isToday(task.lastCompletedAt)) {
        effortDist[task.level]++;
        recurrenceDist[unit] = (recurrenceDist[unit] || 0) + 1;
        hasActivityToday = true;
      }

      // Catalog Status Logic
      if (task.isCompleted) {
        totalDone[task.level]++;
      } else {
        totalLeft[task.level]++;
      }
    });

    return { effortDist, recurrenceDist, totalDone, totalLeft, hasActivityToday, registeredUnits };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-6 animate-fade-in bg-surface/10 rounded-3xl border border-surface/20 border-dashed">
        <p className="text-soft italic text-lg mb-2">No data to report.</p>
        <p className="text-soft text-sm opacity-60">
          Add some tasks to see your energy breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Today's Activity Section */}
      <div className="bg-surface/20 p-6 rounded-3xl border border-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-soft font-bold">Today's Activity</h3>
            <p className="text-xs text-soft/60 mt-1">Tasks completed in this session</p>
          </div>
          
          {/* Accessible Toggle */}
          <div className="flex bg-surface/50 rounded-lg p-1 self-start sm:self-auto" role="tablist" aria-label="View Mode">
            <button
              role="tab"
              aria-selected={viewMode === 'effort'}
              onClick={() => setViewMode('effort')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'effort' 
                  ? 'bg-white shadow-sm text-text' 
                  : 'text-soft hover:text-text'
              }`}
            >
              Effort
            </button>
            <button
              role="tab"
              aria-selected={viewMode === 'recurrence'}
              onClick={() => setViewMode('recurrence')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'recurrence' 
                  ? 'bg-white shadow-sm text-text' 
                  : 'text-soft hover:text-text'
              }`}
            >
              Recurrence
            </button>
          </div>
        </div>
        
        {!stats.hasActivityToday ? (
          <div className="text-center py-8 border-2 border-dashed border-surface/30 rounded-2xl">
            <p className="text-soft italic">No tasks completed yet today.</p>
            <p className="text-xs text-soft/50 mt-1">Check off some tasks to see your progress!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {viewMode === 'effort' ? (
              (Object.values(EffortLevel)).map(level => {
                const count = stats.effortDist[level];
                if (count === 0) return null; // Hide empty stats to reduce noise
                
                return (
                  <div key={level} className="flex-1 min-w-[100px] flex flex-col items-center justify-center p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm">
                    <span className={`text-3xl font-black ${EFFORT_COLORS[level].split(' ')[0]} mb-1`}>{count}</span>
                    <span className="text-xs uppercase tracking-wider text-soft font-bold">{level}</span>
                  </div>
                );
              })
            ) : (
              (Object.keys(RECURRENCE_LABELS) as RecurrenceUnit[])
                .filter(unit => stats.recurrenceDist[unit] > 0)
                .map(unit => {
                  const count = stats.recurrenceDist[unit];

                  return (
                    <div key={unit} className="flex-1 min-w-[100px] flex flex-col items-center justify-center p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm">
                      <span className="text-3xl font-black text-text mb-1">{count}</span>
                      <span className="text-xs uppercase tracking-wider text-soft font-bold">{RECURRENCE_LABELS[unit]}</span>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

      {/* Catalog Health / Status Section */}
      <div className="bg-surface/20 p-6 rounded-3xl border border-surface">
        <div className="mb-6">
            <h3 className="text-sm uppercase tracking-widest text-soft font-bold">Catalog Health</h3>
            <p className="text-xs text-soft/60 mt-1">Completion status by effort level</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.values(EffortLevel).map(level => {
            const done = stats.totalDone[level];
            const remaining = stats.totalLeft[level];
            const total = done + remaining;
            const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div key={level} className="p-4 bg-white/40 rounded-2xl border border-white/50 shadow-sm flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${EFFORT_COLORS[level]}`}>
                    {level}
                  </span>
                  <span className="text-xs text-soft font-medium">
                    {percentage}%
                  </span>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-soft/80 font-medium">
                        <span>{done} done</span>
                        <span>{remaining} left</span>
                    </div>
                    <div className="w-full bg-surface/50 h-2.5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${EFFORT_BAR_COLORS[level]} transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CatalogReport;
