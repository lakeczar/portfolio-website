import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';

describe('Hero Component', () => {
  it('renders with correct text', () => {
    render(<Hero />);
    const header1 = screen.getByRole('heading', { level: 1 });
    const p = screen.getByRole('paragraph');

    // Check for the first header
    expect(header1).toBeInTheDocument();
    expect(header1).toHaveTextContent('Alek Racz');

    // Check for the sub text
    expect(p).toBeInTheDocument();
    expect(p).toHaveTextContent('Full-Stack Software Engineer');
  });
});
