// Mock NextUI Button para simular <a> y <button> según corresponda
jest.mock('@nextui-org/react', () => {
  const original = jest.requireActual('@nextui-org/react');
  return {
    ...original,
    Button: ({ href, children, ...props }: any) =>
      href ? (
        <a href={href} {...props}>
          {children}
        </a>
      ) : (
        <button type="button" {...props}>
          {children}
        </button>
      ),
  };
});
import { render, screen } from '@testing-library/react';
import { HeroSection } from '../HeroSection';

// Mock Next.js Link component
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('HeroSection Component', () => {
  describe('Component Rendering', () => {
    it('should render the hero section', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-gradient-hero');
    });

    it('should render the badge with correct text', () => {
      render(<HeroSection />);
      expect(
        screen.getByText('Gestión profesional para grupos de alabanza'),
      ).toBeInTheDocument();
    });

    it('should render the main headline', () => {
      render(<HeroSection />);
      expect(
        screen.getByText('Lleva tus eventos de alabanza'),
      ).toBeInTheDocument();
      expect(screen.getByText('al siguiente nivel')).toBeInTheDocument();
    });

    it('should render the subheadline', () => {
      render(<HeroSection />);
      expect(
        screen.getByText(
          /Gestiona canciones, coordina músicos y proyecta letras en tiempo real/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('CTA Buttons', () => {
    it('should render primary CTA button with correct link', () => {
      render(<HeroSection />);
      const primaryButton = screen.getByText('Empieza gratis ahora');
      expect(primaryButton).toBeInTheDocument();
      expect(primaryButton.closest('a')).toHaveAttribute('href', '/auth/login');
    });

    it('should render secondary CTA button with correct link', () => {
      render(<HeroSection />);
      const secondaryButton = screen.getByText('Ver cómo funciona');
      expect(secondaryButton).toBeInTheDocument();
      expect(secondaryButton.closest('a')).toHaveAttribute('href', '#demo');
    });

    it('should render primary button with styling', () => {
      render(<HeroSection />);
      const primaryButton = screen.getByText('Empieza gratis ahora');
      expect(primaryButton).toBeInTheDocument();
      expect(primaryButton.closest('a')).toHaveAttribute('href', '/auth/login');
    });
  });

  describe('Social Proof Elements', () => {
    it('should render social proof items', () => {
      render(<HeroSection />);
      expect(screen.getByText('Gratis para empezar')).toBeInTheDocument();
      expect(screen.getByText('Sin tarjeta de crédito')).toBeInTheDocument();
    });

    it('should render checkmarks for social proof', () => {
      render(<HeroSection />);
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Decorative Elements', () => {
    it('should render decorative blur elements', () => {
      const { container } = render(<HeroSection />);
      const decorativeElements = container.querySelectorAll('.animate-pulse');
      expect(decorativeElements.length).toBe(2);
    });
  });

  describe('Styling and Layout', () => {
    it('should have gradient text on headline', () => {
      render(<HeroSection />);
      const gradientText = screen.getByText('al siguiente nivel');
      expect(gradientText).toHaveClass('text-gradient-primary');
    });

    it('should be responsive with correct classes', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('px-4', 'py-20', 'sm:px-6', 'lg:px-8');
    });
  });
});
