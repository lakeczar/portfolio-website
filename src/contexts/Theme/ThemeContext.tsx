import { useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../../types/Theme';
import { ThemeContext } from './ThemeContextDef';
import { themeColors } from '../../utils/themeColorDef';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get initial theme from localStorage or system preference
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage first
    if (localStorage.theme === 'light' || localStorage.theme === 'dark') {
      return localStorage.theme as ThemeMode;
    }

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Toggle between light and dark
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Update document class and localStorage when mode changes
  useEffect(() => {
    // Update localStorage
    localStorage.theme = mode;

    // Update document class
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const color = themeColors[mode];

  return (
    <ThemeContext.Provider value={{ color, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
