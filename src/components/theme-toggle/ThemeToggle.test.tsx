import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../hooks/ThemeHook';

// Mock the icons
vi.mock('react-icons/fi', () => ({
  FiSun: () => <div data-testid="sun-icon">Sun Icon</div>,
  FiMoon: () => <div data-testid="moon-icon">Moon Icon</div>,
}));

// Mock the theme hook
vi.mock('../../hooks/ThemeHook', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle Component', () => {
  const toggleThemeMock = vi.fn();

  beforeEach(() => {
    toggleThemeMock.mockReset();
  });

  it('renders light mode correctly', () => {
    // Set up the mock to return light mode
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      mode: 'light',
      toggleTheme: toggleThemeMock,
    });

    render(<ThemeToggle />);

    // Check if the moon icon is displayed in light mode
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();

    // Check the button's aria-label
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('renders dark mode correctly', () => {
    // Set up the mock to return dark mode
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      mode: 'dark',
      toggleTheme: toggleThemeMock,
    });

    render(<ThemeToggle />);

    // Check if the sun icon is displayed in dark mode
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();

    // Check the button's aria-label
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('calls toggleTheme when clicked', async () => {
    // Set up the mock
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      mode: 'light',
      toggleTheme: toggleThemeMock,
    });

    render(<ThemeToggle />);

    // Click the button
    const button = screen.getByRole('button');
    await userEvent.click(button);

    // Check if toggleTheme was called
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
});
