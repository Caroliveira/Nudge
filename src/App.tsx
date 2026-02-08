import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';
import CatalogPage from './pages/CatalogPage';
import { APP_ROUTES } from './constants';

const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<HomePage />} />
        <Route path={APP_ROUTES.TASK} element={<TaskPage />} />
        <Route path={APP_ROUTES.CATALOG} element={<CatalogPage />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
