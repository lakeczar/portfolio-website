import { useTheme } from '../../hooks/ThemeHook';
import { FiSun, FiMoon } from 'react-icons/fi';

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md border border-gray-200 p-2 dark:border-gray-700"
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? (
        <FiMoon className="h-5 w-5" />
      ) : (
        <FiSun className="h-5 w-5" />
      )}
    </button>
  );
}

export default ThemeToggle;