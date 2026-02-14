import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-warm p-4 select-none overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-surface rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-surface rounded-full blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-4xl flex items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default AppLayout;
