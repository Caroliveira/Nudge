
import React, { useState, useEffect } from 'react';

const Loading: React.FC = () => {
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 fade-in">
      <div className="w-12 h-12 border-4 border-[#eee8d5] border-t-accent rounded-full animate-spin"></div>
      <p className="text-soft italic text-lg">Finding the right nudge{dots}</p>
    </div>
  );
};

export default Loading;
