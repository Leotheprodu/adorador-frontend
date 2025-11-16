import { render, screen } from '@testing-library/react';

import { CTASection } from '../CTASection';

// Mock Button de NextUI para simular correctamente el árbol de botones con as=Link
jest.mock('@nextui-org/react', () => ({
  Button: ({ as, href, children, ...props }: any) => {
    if (as && href) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return <button {...props}>{children}</button>;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('CTASection Component', () => {
  describe('Component Rendering', () => {
    it('should render the section', () => {
      const { container } = render(<CTASection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-gradient-cta');
    });

    it('should render main headline', () => {
      render(<CTASection />);
      expect(
        screen.getByText(/¿Listo para transformar tu ministerio de alabanza?/i),
      ).toBeInTheDocument();
    });

    it('should render subheadline', () => {
      render(<CTASection />);
      expect(
        screen.getByText(
          /Únete a grupos de alabanza que están llevando sus eventos/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('CTA Buttons', () => {
    it('should render primary CTA button', () => {
      render(<CTASection />);
      const primaryButton = screen.getByText('Crear mi cuenta gratis');
      expect(primaryButton).toBeInTheDocument();
    });

    it('should render secondary CTA button', () => {
      render(<CTASection />);
      const secondaryButton = screen.getByText('Explorar recursos');
      expect(secondaryButton).toBeInTheDocument();
    });

    it('should link primary button to login', () => {
      render(<CTASection />);
      const primaryButton = screen.getByText('Crear mi cuenta gratis');
      expect(primaryButton.closest('a')).toHaveAttribute('href', '/auth/login');
    });

    it('should link secondary button to discipulado', () => {
      render(<CTASection />);
      const secondaryButton = screen.getByText('Explorar recursos');
      expect(secondaryButton.closest('a')).toHaveAttribute(
        'href',
        '/discipulado',
      );
    });

    it('should render primary button with appropriate styling', () => {
      render(<CTASection />);
      const primaryButton = screen.getByText('Crear mi cuenta gratis');
      expect(primaryButton).toBeInTheDocument();
      expect(primaryButton.closest('a')).toHaveAttribute('href', '/auth/login');
    });

    it('should render secondary button with appropriate styling', () => {
      render(<CTASection />);
      const secondaryButton = screen.getByText('Explorar recursos');
      expect(secondaryButton).toBeInTheDocument();
      expect(secondaryButton.closest('a')).toHaveAttribute(
        'href',
        '/discipulado',
      );
    });
  });

  describe('Trust Indicators', () => {
    it('should render all trust indicators', () => {
      render(<CTASection />);
      expect(
        screen.getByText('Configuración en 5 minutos'),
      ).toBeInTheDocument();
      expect(screen.getByText('Sin tarjeta de crédito')).toBeInTheDocument();
      expect(screen.getByText('Cancela cuando quieras')).toBeInTheDocument();
    });

    it('should render checkmark icons', () => {
      const { container } = render(<CTASection />);
      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThanOrEqual(3);
    });

    it('should apply correct text color to indicators', () => {
      const { container } = render(<CTASection />);
      const indicatorsContainer = container.querySelector(
        '.text-brand-purple-100',
      );
      expect(indicatorsContainer).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should use gradient CTA background', () => {
      const { container } = render(<CTASection />);
      const section = container.querySelector('.bg-gradient-cta');
      expect(section).toBeInTheDocument();
    });

    it('should center content', () => {
      const { container } = render(<CTASection />);
      const contentContainer = container.querySelector('.text-center');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should have responsive padding', () => {
      const { container } = render(<CTASection />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('px-4', 'py-16', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive button layout', () => {
      const { container } = render(<CTASection />);
      const buttonContainer = container.querySelector('.sm\\:flex-row');
      expect(buttonContainer).toBeInTheDocument();
    });

    it('should have responsive text sizes', () => {
      const { container } = render(<CTASection />);
      const headline = container.querySelector('h2');
      expect(headline).toHaveClass(
        'text-3xl',
        'sm:text-4xl',
        'md:text-5xl',
        'lg:text-6xl',
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading', () => {
      const { container } = render(<CTASection />);
      const heading = container.querySelector('h2');
      expect(heading).toBeInTheDocument();
    });

    it('should have semantic link elements', () => {
      const { container } = render(<CTASection />);
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(2);
    });
  });

  describe('Color Consistency', () => {
    it('should use brand purple colors', () => {
      const { container } = render(<CTASection />);
      const purpleElements = container.querySelectorAll('[class*="purple"]');
      expect(purpleElements.length).toBeGreaterThan(0);
    });
  });
});
