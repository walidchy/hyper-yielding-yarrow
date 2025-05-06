
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const LovableBadge = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Logo colors
  const logoColor = isDarkMode ? 'text-sky-400' : 'text-[#1a6c8f]';
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className={`h-8 w-8 ${logoColor} flex items-center justify-center`}>
          {/* Simplified OGEC Logo for badge */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full border-2 border-current" />
            <div className="absolute w-4 h-3 top-1 left-2 border-2 rounded-full border-current" />
            <div className="absolute w-1.5 h-1.5 top-0.5 left-3.25 rounded-full bg-current" />
            <div className="absolute w-0.5 h-3 top-2 left-3.75 bg-current" />
            <div className="absolute w-2 h-0.5 top-3 left-3 bg-current" />
            <div className="absolute w-2 h-0.5 top-3.5 left-3 bg-current" />
          </div>
        </div>
      </div>
    </div>
  );
};
