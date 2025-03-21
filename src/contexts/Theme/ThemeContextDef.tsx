import { createContext } from 'react';
import { ThemeContextType } from '../../types/Theme';

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
