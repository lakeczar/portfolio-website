import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { vi } from 'vitest';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    className,
    children,
  }: {
    to: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

// Custom render function; add app-wide providers here when they exist.
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

// Custom render with user events
function renderWithUser(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const user = userEvent.setup();
  return {
    user,
    ...renderWithProviders(ui, options),
  };
}

export { renderWithProviders, renderWithUser };
