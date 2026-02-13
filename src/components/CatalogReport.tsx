import React, { useMemo, useState } from 'react';
import { isToday } from 'date-fns';
import { Task, EffortLevel, RecurrenceUnit } from '../types';

interface CatalogReportProps {
  tasks: Task[];
}

const EFFORT_COLORS = {
  [EffortLevel.LOW]: 'text-green',
  [EffortLevel.MEDIUM]: 'text-accent',
  [EffortLevel.HIGH]: 'text-red',
};

const EFFORT_BG_COLORS = {
  [EffortLevel.LOW]: 'bg-green',
  [EffortLevel.MEDIUM]: 'bg-accent',
  [EffortLevel.HIGH]: 'bg-red',
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

      if (task.isCompleted && task.lastCompletedAt && isToday(task.lastCompletedAt)) {
        effortDist[task.level]++;
        
        recurrenceDist[unit] = (recurrenceDist[unit] || 0) + 1;
        
        hasActivityToday = true;
      }

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
      <div className="text-center py-12 px-6 animate-fade-in">
        <p className="text-soft italic text-lg mb-2">No data to report.</p>
        <p className="text-soft text-sm opacity-60">
          Add some tasks to see your energy breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-surface/20 p-5 rounded-3xl border border-surface">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-widest text-soft font-bold">Daily Energy Expenditure</h3>
          <div className="flex bg-surface/50 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('effort')}
              className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all ${
                viewMode === 'effort' 
                  ? 'bg-white shadow-sm text-text' 
                  : 'text-soft hover:text-text'
              }`}
            >
              Effort
            </button>
            <button
              onClick={() => setViewMode('recurrence')}
              className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all ${
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
          <div className="text-center py-2">
            <p className="text-soft italic">No energy spent yet today.</p>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'effort' ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-5'} gap-3`}>
            {viewMode === 'effort' ? (
              (Object.values(EffortLevel)).map(level => {
                const count = stats.effortDist[level];
                
                return (
                  <div key={level} className="flex flex-col items-center justify-center p-3 bg-white/40 rounded-2xl border border-white/50 shadow-sm">
                    <span className={`text-2xl font-bold ${EFFORT_COLORS[level]} mb-0.5`}>{count}</span>
                    <span className="text-[10px] uppercase tracking-wider text-soft font-medium">{level}</span>
                  </div>
                );
              })
            ) : (
              (Object.keys(RECURRENCE_LABELS) as RecurrenceUnit[])
                .filter(unit => stats.registeredUnits.has(unit))
                .map(unit => {
                  const count = stats.recurrenceDist[unit];

                  return (
                    <div key={unit} className="flex flex-col items-center justify-center p-3 bg-white/40 rounded-2xl border border-white/50 shadow-sm">
                      <span className="text-2xl font-bold text-text mb-0.5">{count}</span>
                      <span className="text-[10px] uppercase tracking-wider text-soft font-medium">{RECURRENCE_LABELS[unit]}</span>
                    </div>
                  );
                })
            )}
            {viewMode === 'recurrence' && Object.values(stats.recurrenceDist).every(c => c === 0) && (
               <div className="col-span-full text-center py-2 text-soft italic text-xs">No recurrence data for today</div>
            )}
          </div>
        )}
      </div>

      <div className="bg-surface/20 p-5 rounded-3xl border border-surface">
        <h3 className="text-xs uppercase tracking-widest text-soft font-bold mb-3">Catalog Status</h3>
        <div className="space-y-3">
          {Object.values(EffortLevel).map(level => {
            const done = stats.totalDone[level];
            const remaining = stats.totalLeft[level];
            const total = done + remaining;
            const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div key={level} className="p-3 bg-white/40 rounded-2xl border border-white/50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold ${EFFORT_COLORS[level]} text-sm`}>{level}</span>
                  <span className="text-xs text-soft font-medium">
                    {done} / {total} Done
                  </span>
                </div>
                
                <div className="w-full bg-surface/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${EFFORT_BG_COLORS[level]} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between mt-1.5 text-[10px] uppercase tracking-wider text-soft/80">
                  <span>{percentage}% Complete</span>
                  <span>{remaining} Remaining</span>
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
