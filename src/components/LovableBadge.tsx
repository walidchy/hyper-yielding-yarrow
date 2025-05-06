
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const LovableBadge = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <img 
          src="/lovable-uploads/4aad8150-dcf8-4a8f-9717-264ce1f2a687.png" 
          alt="OGEC Logo" 
          className={`h-8 w-8 ${isDarkMode ? 'brightness-[1.15] contrast-[1.1] drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]' : ''}`}
        />
      </div>
    </div>
  );
};
