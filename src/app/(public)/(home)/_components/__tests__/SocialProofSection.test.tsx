import { render, screen } from '@testing-library/react';
import { SocialProofSection } from '../SocialProofSection';

describe('SocialProofSection Component', () => {
  describe('Component Rendering', () => {
    it('should render the section', () => {
      const { container } = render(<SocialProofSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-white');
    });

    it('should render the section header', () => {
      render(<SocialProofSection />);
      expect(
        screen.getByText('Grupos de alabanza que confían en'),
      ).toBeInTheDocument();
      expect(screen.getByText('Zamr')).toBeInTheDocument();
    });
  });

  describe('Statistics Section', () => {
    it('should render all statistics', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('100+')).toBeInTheDocument();
      expect(screen.getByText('24/7')).toBeInTheDocument();
    });

    it('should render stat labels', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('Canciones organizadas')).toBeInTheDocument();
      expect(screen.getByText('Eventos realizados')).toBeInTheDocument();
      expect(screen.getByText('Disponibilidad')).toBeInTheDocument();
    });

    it('should render stat descriptions', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('en nuestra base de datos')).toBeInTheDocument();
      expect(screen.getByText('con proyección en vivo')).toBeInTheDocument();
      expect(
        screen.getByText('acceso desde cualquier lugar'),
      ).toBeInTheDocument();
    });

    it('should apply gradient to stat numbers', () => {
      const { container } = render(<SocialProofSection />);
      const statNumbers = container.querySelectorAll('.text-gradient-simple');
      expect(statNumbers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Testimonials Section', () => {
    it('should render all testimonials', () => {
      render(<SocialProofSection />);
      expect(
        screen.getByText(/Zamr ha transformado completamente/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Ya no perdemos tiempo buscando acordes/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/La coordinación con el equipo/i),
      ).toBeInTheDocument();
    });

    it('should render testimonial authors', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('Carlos M.')).toBeInTheDocument();
      expect(screen.getByText('María G.')).toBeInTheDocument();
      expect(screen.getByText('David R.')).toBeInTheDocument();
    });

    it('should render author roles', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('Director de Alabanza')).toBeInTheDocument();
      expect(screen.getByText('Líder de Alabanza')).toBeInTheDocument();
      expect(screen.getByText('Músico')).toBeInTheDocument();
    });

    it('should render church names', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('Iglesia Vida Nueva')).toBeInTheDocument();
      expect(screen.getByText('Centro Cristiano')).toBeInTheDocument();
      expect(screen.getByText('Iglesia El Camino')).toBeInTheDocument();
    });

    it('should render quote marks', () => {
      const { container } = render(<SocialProofSection />);
      const quoteMarks = container.querySelectorAll('.text-4xl');
      expect(quoteMarks.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Styling and Layout', () => {
    it('should use gradient backgrounds for stat cards', () => {
      const { container } = render(<SocialProofSection />);
      const statCards = container.querySelectorAll('.bg-gradient-light');
      expect(statCards.length).toBeGreaterThanOrEqual(3);
    });

    it('should use subtle gradient for testimonial cards', () => {
      const { container } = render(<SocialProofSection />);
      const testimonialCards = container.querySelectorAll(
        '.bg-gradient-subtle',
      );
      expect(testimonialCards.length).toBeGreaterThanOrEqual(3);
    });

    it('should apply hover effects to testimonial cards', () => {
      const { container } = render(<SocialProofSection />);
      const testimonialCards = container.querySelectorAll('.hover\\:shadow-xl');
      expect(testimonialCards.length).toBeGreaterThanOrEqual(3);
    });

    it('should use brand colors for church names', () => {
      const { container } = render(<SocialProofSection />);
      const churchNames = container.querySelectorAll('.text-brand-purple-600');
      expect(churchNames.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid for stats', () => {
      const { container } = render(<SocialProofSection />);
      const statsGrid = container.querySelector('.grid.md\\:grid-cols-3');
      expect(statsGrid).toBeInTheDocument();
    });

    it('should have responsive grid for testimonials', () => {
      const { container } = render(<SocialProofSection />);
      const grids = container.querySelectorAll('.grid');
      expect(grids.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const { container } = render(<SocialProofSection />);
      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
    });

    it('should have semantic markup for testimonials', () => {
      const { container } = render(<SocialProofSection />);
      const cards = container.querySelectorAll('.rounded-2xl');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });
});
