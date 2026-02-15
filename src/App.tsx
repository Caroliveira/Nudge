import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';
import CatalogPage from './pages/CatalogPage';
import SettingsPage from './pages/SettingsPage';
import { APP_ROUTES } from './constants';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { refreshRecurringTasks } = useStore();

  useEffect(() => {
    refreshRecurringTasks();
  }, [refreshRecurringTasks]);

  return (
    <AppLayout>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<HomePage />} />
        <Route path={APP_ROUTES.TASK} element={<TaskPage />} />
        <Route path={APP_ROUTES.CATALOG} element={<CatalogPage />} />
        <Route path={APP_ROUTES.SETTINGS} element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
