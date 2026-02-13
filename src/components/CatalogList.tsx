import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task } from '../types';
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
  if (tasks.length === 0) {
    return <CatalogEmptyState view={view} />;
  }

  return (
    <ul className="space-y-3 pb-8 relative mt-6">
      <AnimatePresence initial={false} mode='popLayout'>
        {tasks.map((task) => (
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
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default CatalogList;
