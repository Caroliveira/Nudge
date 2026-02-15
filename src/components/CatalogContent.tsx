import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TaskForm from './TaskForm';
import CsvImport from './CsvImport';
import CatalogReport from './CatalogReport';
import CatalogList from './CatalogList';
import { Task } from '../types';
import { CatalogView } from '../hooks/useCatalogFilter';

interface CatalogContentProps {
  view: CatalogView;
  isAdding: boolean;
  editingTask: Task | null;
  tasks: Task[];
  filteredTasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onCancelEdit: () => void;
  onStartAdd: () => void;
  onStartEdit: (task: Task) => void;
}

const CatalogContent: React.FC<CatalogContentProps> = ({
  view,
  isAdding,
  editingTask,
  tasks,
  filteredTasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  onCancelEdit,
  onStartAdd,
  onStartEdit,
}) => {
  const { t } = useTranslation();

  if (isAdding) {
    return (
      <TaskForm
        onSubmit={onAddTask}
        onCancel={onCancelEdit}
      />
    );
  }

  if (editingTask) {
    return (
      <TaskForm
        initialValues={editingTask}
        onSubmit={(updates) => {
          onUpdateTask(editingTask.id, updates);
        }}
        onCancel={onCancelEdit}
      />
    );
  }

  if (view === 'report') {
    return <CatalogReport tasks={tasks} />;
  }

  return (
    <>
      <div className="space-y-4">
        {view === 'tasks' && (
          <>
            <button
              type="button"
              onClick={onStartAdd}
              className="w-full py-4 border-2 border-dashed border-surface rounded-2xl text-soft hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {t('catalog.addPersonalTask')}
            </button>
            <CsvImport />
          </>
        )}
      </div>

      <CatalogList
        tasks={filteredTasks}
        view={view}
        onToggle={onToggleTask}
        onDelete={onDeleteTask}
        onEdit={onStartEdit}
      />
    </>
  );
};

export default CatalogContent;
