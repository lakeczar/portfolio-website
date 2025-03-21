import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { vi } from 'vitest';
import { TestProviders } from './test-context-wrapper';

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

// Custom render function with all providers
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: TestProviders,
    ...options,
  });
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
