import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
const HomePage = lazy(() => import('./pages/HomePage'));
const TaskPage = lazy(() => import('./pages/TaskPage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
import { APP_ROUTES } from './constants';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { refreshRecurringTasks } = useStore();

  useEffect(() => {
    refreshRecurringTasks();
  }, [refreshRecurringTasks]);

  return (
    <AppLayout>
      <Suspense fallback={<div className="flex h-full items-center justify-center p-4">Loading...</div>}>
        <Routes>
          <Route path={APP_ROUTES.HOME} element={<HomePage />} />
          <Route path={APP_ROUTES.TASK} element={<TaskPage />} />
          <Route path={APP_ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={APP_ROUTES.SETTINGS} element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
};

export default App;
