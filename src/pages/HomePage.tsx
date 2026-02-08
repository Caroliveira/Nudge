import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useTaskAvailability } from '../hooks/useTaskAvailability';
import EffortSelector from '../components/EffortSelector';
import TotalVictory from '../components/TotalVictory';

const HomePage: React.FC = () => {
  const { tasks } = useStore();
  const { totalIncomplete } = useTaskAvailability(tasks);
  
  if (totalIncomplete === 0 && tasks.length > 0) return <TotalVictory />;
  
  return (
    <div className="w-full flex flex-col items-center">
      <EffortSelector />
      <Link
        to="/catalog"
        className="mt-12 text-soft hover:text-accent transition-colors flex items-center gap-2 group"
      >
        <span className="w-8 h-px bg-soft group-hover:bg-accent transition-colors" />
        Task Catalog & Personal Planning
        <span className="w-8 h-px bg-soft group-hover:bg-accent transition-colors" />
      </Link>
    </div>
  );
};

export default HomePage;
