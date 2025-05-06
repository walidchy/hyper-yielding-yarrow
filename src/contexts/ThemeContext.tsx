
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user has a preferred theme in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // If there's a saved preference, use it
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Otherwise check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors duration-300 hover:shadow-md relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative z-10 transition-all duration-300">
        {theme === 'light' ? 
          <Moon size={18} className="animate-scale-in" /> : 
          <Sun size={18} className="animate-scale-in text-yellow-300" />
        }
      </div>
      <div className={`absolute inset-0 bg-gradient-to-tr transition-opacity duration-300
        ${theme === 'light' 
          ? 'from-blue-50 to-blue-100 opacity-0' 
          : 'from-blue-900 to-purple-900 opacity-100'}`}
      />
    </button>
  );
};
