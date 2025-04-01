export type ThemeColor = {
  primary: string;
  secondary: string;
  text: string;
  background: string;
  card: string;
  border: string;
  hover: string;
  // Add more color definitions as needed
};

export type ThemeColors = {
  light: ThemeColor;
  dark: ThemeColor;
};

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  color: ThemeColor;
  mode: ThemeMode;
  toggleTheme: () => void;
}
