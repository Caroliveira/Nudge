import React from 'react';
import { EffortLevel } from '../types';
import { EFFORT_COLORS, EFFORT_BAR_COLORS } from '../constants';

interface CatalogHealthProps {
  stats: {
    totalDone: Record<EffortLevel, number>;
    totalLeft: Record<EffortLevel, number>;
  };
}

const CatalogHealth: React.FC<CatalogHealthProps> = ({ stats }) => {
  return (
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
  );
};

export default CatalogHealth;
