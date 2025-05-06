
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const LovableBadge = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <img 
          src="/lovable-uploads/4a4a34bc-5ade-4a65-82ee-4db72b6cf819.png" 
          alt="OGEC Logo" 
          className={`h-8 w-8 ${isDarkMode ? 'brightness-[1.2] contrast-[1.15] drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]' : ''}`}
        />
      </div>
    </div>
  );
};
