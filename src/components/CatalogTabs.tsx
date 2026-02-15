import React from 'react';
import { motion } from 'framer-motion';
import { CatalogView } from '../hooks/useCatalogFilter';

interface CatalogTabsProps {
  view: CatalogView;
  onViewChange: (view: CatalogView) => void;
  hasArchivedTasks: boolean;
}

const CatalogTabs: React.FC<CatalogTabsProps> = ({ view, onViewChange, hasArchivedTasks }) => {
  return (
    <div className="bg-surface/30 p-1.5 rounded-2xl flex items-center mb-8 relative" role="tablist" aria-label="Catalog views">
      <button
        onClick={() => onViewChange('tasks')}
        role="tab"
        aria-selected={view === 'tasks'}
        aria-controls="catalog-panel"
        id="tab-tasks"
        className={`flex-1 relative py-3 text-sm font-bold rounded-xl transition-colors z-10 ${
          view === 'tasks' ? 'text-text' : 'text-soft hover:text-text/80'
        }`}
      >
        {view === 'tasks' && (
          <motion.div
            layoutId="activeCatalogTab"
            className="absolute inset-0 bg-white/70 shadow-sm rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            style={{ zIndex: -1 }}
          />
        )}
        Tasks
      </button>

      {hasArchivedTasks && (
        <button
          onClick={() => onViewChange('archive')}
          role="tab"
          aria-selected={view === 'archive'}
          aria-controls="catalog-panel"
          id="tab-archive"
          className={`flex-1 relative py-3 text-sm font-bold rounded-xl transition-colors z-10 ${
            view === 'archive' ? 'text-text' : 'text-soft hover:text-text/80'
          }`}
        >
          {view === 'archive' && (
            <motion.div
              layoutId="activeCatalogTab"
              className="absolute inset-0 bg-white/70 shadow-sm rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: -1 }}
            />
          )}
          Archive
        </button>
      )}

      <button
        onClick={() => onViewChange('report')}
        role="tab"
        aria-selected={view === 'report'}
        aria-controls="catalog-panel"
        id="tab-report"
        className={`flex-1 relative py-3 text-sm font-bold rounded-xl transition-colors z-10 ${
          view === 'report' ? 'text-text' : 'text-soft hover:text-text/80'
        }`}
      >
        {view === 'report' && (
          <motion.div
            layoutId="activeCatalogTab"
            className="absolute inset-0 bg-white/70 shadow-sm rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            style={{ zIndex: -1 }}
          />
        )}
        Report
      </button>
    </div>
  );
};

export default CatalogTabs;
