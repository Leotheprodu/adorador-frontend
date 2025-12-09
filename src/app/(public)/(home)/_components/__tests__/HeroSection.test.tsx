// Mock NextUI Button para simular <a> y <button> según corresponda
jest.mock('@heroui/react', () => {
  const original = jest.requireActual('@heroui/react');
  return {
    ...original,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    it('should render the section with gradient classes', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-gradient-hero');
      expect(section).toHaveClass('dark:bg-gradient-dark-hero');
    });
    it('should render the hero section with dark mode classes', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      // Ahora debe tener bg-gradient-hero y dark:bg-gradient-dark-hero
      expect(section).toHaveClass('bg-gradient-hero');
      expect(section).toHaveClass('dark:bg-gradient-dark-hero');
    });
    it('should render the main headline with dark mode classes', () => {
      render(<HeroSection />);
      const headline = screen.getByText('Lleva tus eventos de alabanza');
      expect(headline).toBeInTheDocument();
      expect(headline).toHaveClass('dark:text-gray-100');
      expect(screen.getByText('al siguiente nivel')).toBeInTheDocument();
    });

    it('should render the subheadline with dark mode classes', () => {
      render(<HeroSection />);
      const subheadline = screen.getByText(
        /Gestiona canciones, coordina músicos y proyecta letras en tiempo real/i,
      );
      expect(subheadline).toBeInTheDocument();
      expect(subheadline.className).toMatch(/dark:text-brand-purple-200/);
    });
  });
  it('should render the badge with correct text and dark mode classes', () => {
    render(<HeroSection />);
    const badge = screen.getByText(
      'Gestión profesional para grupos de alabanza',
    );
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('dark:bg-brand-purple-900');
    expect(badge).toHaveClass('dark:text-brand-purple-200');
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
  describe('CTA Buttons', () => {
    it('should render primary CTA button with correct link', () => {
      render(<HeroSection />);
      const primaryButton = screen.getByText('Empieza gratis ahora');
      expect(primaryButton).toBeInTheDocument();
      expect(primaryButton.closest('a')).toHaveAttribute('href', '/auth/login');
    });

    it('should render secondary CTA button with correct link', () => {
      render(<HeroSection />);
      const secondaryButton = screen.getByText('Ver planes y precios');
      expect(secondaryButton).toBeInTheDocument();
      expect(secondaryButton.closest('a')).toHaveAttribute('href', '/precios');
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
    it('should render gradient text with correct class', () => {
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
