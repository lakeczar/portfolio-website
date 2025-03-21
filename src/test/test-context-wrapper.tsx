import { ReactNode } from "react";
import { ThemeContext } from "../contexts/Theme/ThemeContextDef";
import { vi } from 'vitest';
import  {ThemeColor, ThemeMode} from '../types/Theme';

// Test wrapper component with all necessary providers
interface TestProvidersProps {
  children: ReactNode;
}

export const TestProviders = ({ children }: TestProvidersProps) => {
  // Create mock theme context
  const mockThemeContext = {
    theme: 'light',
    color: { 
        background: 'bg-slate-100',
        text: 'text-slate-900',
    } as ThemeColor, // Add a default color
    mode: 'light' as ThemeMode, // Add a default mode
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  };

  return (
    <ThemeContext.Provider value={mockThemeContext}>
      {children}
    </ThemeContext.Provider>
  );
};