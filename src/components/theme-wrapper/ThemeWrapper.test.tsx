// src/components/ThemeWrapper/ThemeWrapper.test.tsx
import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ThemeWrapper from './ThemeWrapper'; // Adjust import path if needed
import { renderWithProviders } from '../../test/test-utils';

describe('ThemeWrapper Component', () => {
  it('renders children with the correct background color class', () => {
    // Render ThemeWrapper with the mock context
    renderWithProviders(
      <ThemeWrapper>
        <div data-testid="child-element">Test Child</div>
      </ThemeWrapper>
    );

    // Test that children are rendered
    const childElement = screen.getByTestId('child-element');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Test Child');

    // Test that the background class is applied
    const wrapperElement = childElement.parentElement;
    expect(wrapperElement).toHaveClass('bg-slate-100');
  });
});
