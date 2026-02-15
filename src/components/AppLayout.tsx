import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_ROUTES } from '../constants';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isSettingsPage = location.pathname === APP_ROUTES.SETTINGS;

  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-warm p-4 select-none overflow-x-hidden relative">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-surface rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-surface rounded-full blur-3xl" />
      </div>

      {!isSettingsPage && (
        <Link
          to={APP_ROUTES.SETTINGS}
          className="absolute top-6 right-6 p-2 text-soft hover:text-accent transition-colors z-50 rounded-full hover:bg-surface/50"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </Link>
      )}

      <div className="z-10 w-full max-w-4xl flex items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default AppLayout;
