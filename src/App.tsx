import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';
import CatalogPage from './pages/CatalogPage';

const App: React.FC = () => {
  const location = useLocation();

  // Determine current "state" for layout based on path
  const getAppState = () => {
    const path = location.pathname;
    if (path === '/task') return 'task';
    if (path === '/catalog') return 'catalog';
    return 'selection';
  };

  return (
    <AppLayout state={getAppState()}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/task" element={<TaskPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
