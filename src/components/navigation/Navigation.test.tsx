import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { describe, it, expect} from 'vitest';
import Navigation from './Navigation';

describe('Navigation Component', () => {
    it('renders with correct links', () => {
        renderWithProviders(<Navigation />);
        const homeLink = screen.getByText('Home');
        const aboutLink = screen.getByText('About');
        const timelineLink = screen.getByText('Timeline');

        expect(homeLink).toBeInTheDocument();
        expect(aboutLink).toBeInTheDocument();
        expect(timelineLink).toBeInTheDocument();
    })
})