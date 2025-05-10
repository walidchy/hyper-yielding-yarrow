
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
          {/* Simplified badge with just "O" */}
          <div className="relative h-6 w-6">
            <div className="flex items-center justify-center">
              <div className={`border-2 rounded-full aspect-square flex items-center justify-center w-6 h-6 text-xs ${logoColor} border-current`}>
                O
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
