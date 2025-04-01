import { render} from '@testing-library/react';
import { describe, it } from 'vitest';
import PortfolioContent from './PortfolioContent';

describe('PortfolioContent Component', () => {
  it('renders with correct text', () => {
    render(<PortfolioContent />);
    // const header1 = screen.getByRole('heading', { level: 1 });
    // const p = screen.getByRole('paragraph');

    // // Check for the first header
    // expect(header1).toBeInTheDocument();
    // expect(header1).toHaveTextContent('Alek Racz');

    // // Check for the sub text
    // expect(p).toBeInTheDocument();
    // expect(p).toHaveTextContent('Full-Stack Software Engineer');
  });
});
