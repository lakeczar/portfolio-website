import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PortfolioJourney from './PortfolioJourney';
import { mountPortfolio } from './runtime/mount.js';

vi.mock('./runtime/mount.js', () => ({ mountPortfolio: vi.fn(() => vi.fn()) }));
describe('Approved portfolio', () => {
  it('keeps the selected copy, portrait, footer and useful skip link', () => {
    render(<PortfolioJourney />);
    expect(
      screen.getByText('There’s more beneath the surface.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'From the first idea to the finer details.',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Alek Racz' })).toHaveAttribute(
      'loading',
      'lazy'
    );
    expect(
      screen.getByRole('link', { name: 'Skip to portfolio' })
    ).toHaveAttribute('href', '#portfolio-content');
    expect(
      screen.getByRole('link', { name: /Alek Racz on LinkedIn/ })
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/alek-racz/');
    expect(
      screen.queryByRole('link', { name: 'About' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Timeline' })
    ).not.toBeInTheDocument();
  });
  it('disposes and rebuilds the island during StrictMode and final unmount', () => {
    vi.mocked(mountPortfolio).mockClear();
    const view = render(
      <StrictMode>
        <PortfolioJourney />
      </StrictMode>
    );
    expect(mountPortfolio).toHaveBeenCalledTimes(2);
    const cleanups = vi.mocked(mountPortfolio).mock.results;
    expect(cleanups[0].value).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('#study')).toHaveLength(1);
    view.unmount();
    expect(cleanups[1].value).toHaveBeenCalledTimes(1);
  });
});
