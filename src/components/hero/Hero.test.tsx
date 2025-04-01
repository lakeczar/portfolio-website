import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Hero from './Hero';
import { BlurLightsProps } from '../../types/BlurLights';

// Mock the BlurLights component
vi.mock('../blur-lights/BlurLights', () => ({
  default: ({ size, color, initialPosition, animationDuration, animationDelay }: BlurLightsProps) => (
    <div 
      data-testid="blur-lights"
      data-size={size}
      data-color={color}
      data-position={JSON.stringify(initialPosition)}
      data-duration={animationDuration}
      data-delay={animationDelay}
    />
  )
}));

// Mock the constants
vi.mock('../../utils/blurLightsConstants', () => ({
  blurLights: [
    {
      size: 300,
      color: 'blue',
      initialPosition: { x: 100, y: 100 },
      animationDuration: 20,
      animationDelay: 0
    },
    {
      size: 200,
      color: 'purple',
      initialPosition: { x: 200, y: 200 },
      animationDuration: 15,
      animationDelay: 5
    }
  ]
}));

// Mock the image
vi.mock('../../assets/images/alekRaczProfile.jpg', () => ({
  default: 'mocked-image-path'
}));

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders unmounted version when testMounted is false', () => {
    render(<Hero testMounted={false} />);
    
    // Should show unmounted version
    const unmountedElement = screen.getByTestId('hero-section-unmounted');
    expect(unmountedElement).toBeInTheDocument();
    
    // Should not show mounted version
    const mountedElement = screen.queryByTestId('hero-section-mounted');
    expect(mountedElement).not.toBeInTheDocument();
  });

  it('renders mounted version when testMounted is true', () => {
    render(<Hero testMounted={true} />);
    
    // Should show mounted version
    const mountedElement = screen.getByTestId('hero-section-mounted');
    expect(mountedElement).toBeInTheDocument();
    
    // Should not show unmounted version
    const unmountedElement = screen.queryByTestId('hero-section-unmounted');
    expect(unmountedElement).not.toBeInTheDocument();
  });

  it('renders with correct text in unmounted state', () => {
    render(<Hero testMounted={false} />);
    
    const header1 = screen.getByRole('heading', { level: 1 });
    expect(header1).toBeInTheDocument();
    expect(header1).toHaveTextContent('Alek Racz');
    
    const jobText = screen.getByText(/Full-Stack Software Engineer/i);
    expect(jobText).toBeInTheDocument();
  });

  it('renders the profile image with correct attributes', () => {
    render(<Hero testMounted={false} />);
    
    const image = screen.getByAltText('Alek Racz');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mocked-image-path');
    expect(image).toHaveClass('object-cover');
  });

  it('renders BlurLights components in mounted state', () => {
    render(<Hero testMounted={true} />);
    
    const blurLights = screen.getAllByTestId('blur-lights');
    expect(blurLights).toHaveLength(2);
  });
});