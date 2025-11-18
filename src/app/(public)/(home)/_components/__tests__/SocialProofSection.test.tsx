import { render, screen } from '@testing-library/react';
import { SocialProofSection } from '../SocialProofSection';

describe('SocialProofSection Component', () => {
  describe('Component Rendering', () => {
    it('debe renderizar la sección principal con clases de dark mode', () => {
      const { container } = render(<SocialProofSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-white');
      expect(section?.className).toMatch(
        /dark:bg-brand-purple-950|dark:bg-brand-purple-900/,
      );
    });

    it('debe renderizar el header de la sección', () => {
      render(<SocialProofSection />);
      expect(
        screen.getByText(/Grupos de alabanza que confían en/i),
      ).toBeInTheDocument();
    });
  });

  describe('Statistics Section', () => {
    it('debe renderizar todas las estadísticas', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('100+')).toBeInTheDocument();
      expect(screen.getByText('24/7')).toBeInTheDocument();
    });

    it('debe renderizar los labels de las estadísticas', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('Canciones organizadas')).toBeInTheDocument();
      expect(screen.getByText('Eventos realizados')).toBeInTheDocument();
      expect(screen.getByText('Disponibilidad')).toBeInTheDocument();
    });

    it('debe renderizar las descripciones de las estadísticas', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('en nuestra base de datos')).toBeInTheDocument();
      expect(screen.getByText('con proyección en vivo')).toBeInTheDocument();
      expect(
        screen.getByText('acceso desde cualquier lugar'),
      ).toBeInTheDocument();
    });
  });

  describe('Testimonials Section', () => {
    it('debe renderizar exactamente 3 testimonial cards con los estilos correctos', () => {
      const { container } = render(<SocialProofSection />);
      const testimonialCards = container.querySelectorAll(
        '.rounded-2xl.border.bg-white',
      );
      expect(testimonialCards.length).toBe(3);
      testimonialCards.forEach((card) => {
        expect(card.className).toMatch(/bg-white/);
        expect(card.className).toMatch(/dark:bg-brand-purple-900/);
        expect(card.className).toMatch(/dark:border-brand-purple-800/);
        expect(card.className).not.toMatch(/gradient/);
      });
    });

    it('debe renderizar los autores de los testimonios', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('Carlos M.')).toBeInTheDocument();
      expect(screen.getByText('María G.')).toBeInTheDocument();
      expect(screen.getByText('David R.')).toBeInTheDocument();
    });

    it('debe renderizar el contenido de los testimonios', () => {
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

    it('debe renderizar los roles de los autores', () => {
      render(<SocialProofSection />);
      expect(screen.getByText('Director de Alabanza')).toBeInTheDocument();
      expect(screen.getByText('Líder de Alabanza')).toBeInTheDocument();
      expect(screen.getByText('Músico')).toBeInTheDocument();
    });

    it('debe usar el color de marca para los nombres de iglesia', () => {
      const { container } = render(<SocialProofSection />);
      const churchNames = container.querySelectorAll('.text-brand-purple-600');
      expect(churchNames.length).toBe(3);
    });
  });

  describe('Responsive Layout', () => {
    it('debe tener grid responsivo para stats', () => {
      const { container } = render(<SocialProofSection />);
      // Selecciona el primer grid (stats) y verifica la clase
      const grids = container.querySelectorAll('.grid');
      expect(grids.length).toBeGreaterThanOrEqual(1);
      const statsGrid = grids[0];
      expect(statsGrid.className).toMatch(/md:grid-cols-3/);
    });

    it('debe tener grid responsivo para testimonios', () => {
      const { container } = render(<SocialProofSection />);
      const grids = container.querySelectorAll('.grid');
      expect(grids.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Accessibility', () => {
    it('debe tener jerarquía de headings correcta', () => {
      const { container } = render(<SocialProofSection />);
      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
    });

    it('debe tener marcado semántico para testimonios', () => {
      const { container } = render(<SocialProofSection />);
      const cards = container.querySelectorAll('.rounded-2xl');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });
});

it('debe renderizar exactamente 3 testimonial cards con los estilos correctos', () => {
  const { container } = render(<SocialProofSection />);
  const testimonialCards = container.querySelectorAll(
    '.rounded-2xl.border.bg-white',
  );
  expect(testimonialCards.length).toBe(3);
  testimonialCards.forEach((card) => {
    expect(card.className).toMatch(/bg-white/);
    expect(card.className).toMatch(/dark:bg-brand-purple-900/);
    expect(card.className).toMatch(/dark:border-brand-purple-800/);
    expect(card.className).not.toMatch(/gradient/);
  });
});

it('debe renderizar los autores de los testimonios', () => {
  render(<SocialProofSection />);
  expect(screen.getByText('Carlos M.')).toBeInTheDocument();
  expect(screen.getByText('María G.')).toBeInTheDocument();
  expect(screen.getByText('David R.')).toBeInTheDocument();
});

it('debe renderizar el contenido de los testimonios', () => {
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

it('debe renderizar los roles de los autores', () => {
  render(<SocialProofSection />);
  expect(screen.getByText('Director de Alabanza')).toBeInTheDocument();
  expect(screen.getByText('Líder de Alabanza')).toBeInTheDocument();
  expect(screen.getByText('Músico')).toBeInTheDocument();
});

it('debe usar el color de marca para los nombres de iglesia', () => {
  const { container } = render(<SocialProofSection />);
  const churchNames = container.querySelectorAll('.text-brand-purple-600');
  expect(churchNames.length).toBe(3);
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

describe('Accesibilidad', () => {
  it('debe tener jerarquía de headings correcta', () => {
    const { container } = render(<SocialProofSection />);
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
  });

  it('debe tener marcado semántico para testimonios', () => {
    const { container } = render(<SocialProofSection />);
    const cards = container.querySelectorAll('.rounded-2xl');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
