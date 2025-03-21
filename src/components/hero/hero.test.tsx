import { render, screen } from '@testing-library/react';
import { describe, it, expect} from 'vitest';
import Hero from './hero';

describe('Hero Component', () => {
  it('renders with correct text', () => {
    render(<Hero />);
    const header1 = screen.getByRole("heading", {level: 1});
    const header2 = screen.getByRole("heading", {level: 2});

    // Check for the first header
    expect(header1).toBeInTheDocument()
    expect(header1).toHaveTextContent('Alek Racz Portfolio');

    // Check for the second header
    expect(header2).toBeInTheDocument()
    expect(header2).toHaveTextContent('Senior Full-Stack Software Engineer');
  });
});