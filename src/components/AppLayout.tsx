import React from 'react';
import { AppState } from '../types';

const FOOTER_MESSAGE: Record<AppState, string | null> = {
  selection: 'Be intentional with your energy.',
  task: 'Be intentional with your energy.',
  catalog: null,
  celebration: null,
  'total-victory': "You've found complete stillness for now. You earned it.",
};

interface AppLayoutProps {
  state: AppState;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ state, children }) => {
  const showFooter = state !== 'catalog' && state !== 'celebration';
  const footerMessage = showFooter ? FOOTER_MESSAGE[state] : null;

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-warm p-4 select-none">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-surface rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-surface rounded-full blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-4xl flex items-center justify-center">
        {children}
      </div>

      {footerMessage && (
        <footer className="fixed bottom-8 text-center w-full z-10">
          <p className="text-xs text-soft opacity-50 uppercase tracking-widest font-medium">
            {footerMessage}
          </p>
        </footer>
      )}
    </main>
  );
};

export default AppLayout;
