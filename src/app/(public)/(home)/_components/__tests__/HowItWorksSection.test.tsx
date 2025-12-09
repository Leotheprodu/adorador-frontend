// Mock NextUI Button para simular <a> y <button> según corresponda
jest.mock('@heroui/react', () => {
  const original = jest.requireActual('@heroui/react');
  return {
    ...original,
    Button: ({
      href,
      children,
      endContent,
      startContent,
      onPress,
      ...props
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) => {
      const onClick = onPress;
      return href ? (
        <a href={href} {...props}>
          {startContent}
          {children}
          {endContent}
        </a>
      ) : (
        <button type="button" onClick={onClick} {...props}>
          {startContent}
          {children}
          {endContent}
        </button>
      );
    },
  };
});
import { render, screen } from '@testing-library/react';
import { HowItWorksSection } from '../HowItWorksSection';

describe('HowItWorksSection Component', () => {
  describe('Component Rendering', () => {
    it('should render the section with dark mode classes', () => {
      const { container } = render(<HowItWorksSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-gradient-gray');
      expect(section?.className).toMatch(/dark:bg-gradient-dark-gray/);
    });

    it('should render the section header', () => {
      render(<HowItWorksSection />);
      expect(screen.getByText('Tan fácil como')).toBeInTheDocument();
      expect(screen.getByText('1, 2, 3')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(<HowItWorksSection />);
      expect(
        screen.getByText(
          /Comienza a usar Zamr en minutos, sin complicaciones técnicas/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Step Cards', () => {
    it('should render cards with dark mode classes', () => {
      const { container } = render(<HowItWorksSection />);
      const cards = container.querySelectorAll('.rounded-2xl.bg-white');
      expect(cards.length).toBe(3);
      cards.forEach((card) => {
        expect(card.className).toMatch(/dark:bg-brand-purple-900/);
      });
    });
    it('should render all three steps', () => {
      render(<HowItWorksSection />);
      expect(screen.getByText('Crea tu grupo')).toBeInTheDocument();
      expect(screen.getByText('Organiza tu repertorio')).toBeInTheDocument();
      expect(screen.getByText('Dirige en tiempo real')).toBeInTheDocument();
    });

    it('should render step numbers', () => {
      render(<HowItWorksSection />);
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
    });

    it('should render step descriptions', () => {
      render(<HowItWorksSection />);
      expect(
        screen.getByText(/Registra tu grupo de alabanza e invita/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Agrega canciones con acordes y letras/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Proyecta letras para la congregación/i),
      ).toBeInTheDocument();
    });
  });

  describe('Step Styling', () => {
    it('should apply gradient backgrounds to step badges', () => {
      const { container } = render(<HowItWorksSection />);
      const badges = container.querySelectorAll('.bg-gradient-to-br');
      expect(badges.length).toBeGreaterThanOrEqual(3);
    });

    it('should have correct gradient colors for each step', () => {
      const { container } = render(<HowItWorksSection />);
      const badges = container.querySelectorAll('.bg-gradient-to-br');

      expect(badges[0]).toHaveClass(
        'from-brand-purple-500',
        'to-brand-purple-600',
      );
      expect(badges[1]).toHaveClass('from-brand-pink-500', 'to-brand-pink-600');
      expect(badges[2]).toHaveClass('from-brand-blue-500', 'to-brand-blue-600');
    });
  });

  describe('Connector Lines', () => {
    it('should render connector lines between steps', () => {
      const { container } = render(<HowItWorksSection />);
      const connectors = container.querySelectorAll('.bg-gradient-connector');
      // Should have 2 connectors (between 3 steps)
      expect(connectors.length).toBeGreaterThanOrEqual(2);
    });

    it('should hide connectors on mobile', () => {
      const { container } = render(<HowItWorksSection />);
      const connectors = container.querySelectorAll('.bg-gradient-connector');
      connectors.forEach((connector) => {
        expect(connector).toHaveClass('hidden', 'md:block');
      });
    });
  });

  describe('CTA Button', () => {
    it('should render CTA button', () => {
      render(<HowItWorksSection />);
      const button = screen.getByText('Empezar ahora');
      expect(button).toBeInTheDocument();
    });

    it('should have correct link', () => {
      render(<HowItWorksSection />);
      const button = screen.getByText('Empezar ahora');
      expect(button.closest('a')).toHaveAttribute('href', '/auth/login');
    });

    it('should have primary button styling', () => {
      render(<HowItWorksSection />);
      const button = screen.getByText('Empezar ahora');
      expect(button).toHaveClass('bg-brand-purple-600');
      expect(button).toHaveClass('border-brand-purple-300');
    });

    it('should render arrow icon', () => {
      render(<HowItWorksSection />);
      expect(screen.getByText('→')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid', () => {
      const { container } = render(<HowItWorksSection />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('md:grid-cols-3');
    });

    it('should have responsive padding', () => {
      const { container } = render(<HowItWorksSection />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('px-4', 'py-16', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const { container } = render(<HowItWorksSection />);
      const h2 = container.querySelector('h2');
      const h3s = container.querySelectorAll('h3');

      expect(h2).toBeInTheDocument();
      expect(h3s.length).toBe(3);
    });
  });
});
