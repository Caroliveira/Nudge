import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';
import { Task, EffortLevel } from '../types';
import { CatalogView } from '../hooks/useCatalogFilter';
import TaskCatalogItem from './TaskCatalogItem';
import CatalogEmptyState from './CatalogEmptyState';

interface CatalogListProps {
  tasks: Task[];
  view: CatalogView;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const CatalogList: React.FC<CatalogListProps> = ({
  tasks,
  view,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<EffortLevel | 'ALL' | 'TODAY'>('ALL');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesLevel = true;
      if (levelFilter === 'TODAY') {
        matchesLevel = !!(task.isCompleted && task.lastCompletedAt && isToday(task.lastCompletedAt));
      } else if (levelFilter !== 'ALL') {
        matchesLevel = task.level === levelFilter;
      }

      return matchesSearch && matchesLevel;
    });
  }, [tasks, searchQuery, levelFilter]);

  useEffect(() => {
    if (filteredTasks.length === 0 && levelFilter !== 'ALL') setLevelFilter('ALL');
  }, [filteredTasks.length, levelFilter]);

  if (tasks.length === 0) {
    return <CatalogEmptyState view={view} />;
  }

  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-soft opacity-50" />
          </div>
          <input
            type="text"
            placeholder={t('catalog.search', 'Search tasks...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface text-text placeholder:text-soft rounded-lg border border-soft/30 focus:outline-none focus:border-accent transition-colors shadow-sm"
          />
        </div>
        <div className="relative shrink-0 w-full sm:w-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Filter className="w-4 h-4 text-soft opacity-50" />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as EffortLevel | 'ALL' | 'TODAY')}
            className="w-full sm:w-[140px] pl-9 pr-8 py-2 bg-surface text-text rounded-lg border border-soft/30 focus:outline-none focus:border-accent appearance-none cursor-pointer transition-colors shadow-sm text-sm"
          >
            <option value="ALL">{t('catalog.filterAll', 'All')}</option>
            {tasks.some(task => !!(task.isCompleted && task.lastCompletedAt && isToday(task.lastCompletedAt))) && (
              <option value="TODAY">{t('catalog.filterToday', 'Made Today')}</option>
            )}
            {Object.values(EffortLevel).map((level) => (
              <option key={level} value={level}>
                {t(`effort.short.${level.toLowerCase()}`, level)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="space-y-3 pb-8 relative mt-2">
        <AnimatePresence initial={false} mode='popLayout'>
          {filteredTasks.length === 0 ? (
            <motion.li
              key="empty-search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="text-center py-8 text-soft italic list-none"
            >
              {t('catalog.emptySearch', 'No tasks found matching your filters.')}
            </motion.li>
          ) : (
            filteredTasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, height: 0, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <TaskCatalogItem
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={() => onEdit(task)}
                />
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default CatalogList;
