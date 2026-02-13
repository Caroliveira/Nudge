import React from 'react';
import { CatalogView } from '../hooks/useCatalogFilter';

interface CatalogEmptyStateProps {
  view: CatalogView;
}

const CatalogEmptyState: React.FC<CatalogEmptyStateProps> = ({ view }) => {
  return (
    <div className="text-center py-12 px-6">
      <p className="text-soft italic text-lg mb-2">
        {view === 'tasks'
          ? "Your catalog is quiet."
          : "No archived tasks."}
      </p>
      {view === 'tasks' && (
        <p className="text-soft text-sm opacity-60">
          Add tasks you want to tackle later when you have the energy.
        </p>
      )}
    </div>
  );
};

export default CatalogEmptyState;
