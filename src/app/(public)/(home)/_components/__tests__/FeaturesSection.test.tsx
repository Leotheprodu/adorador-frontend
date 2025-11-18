import { render, screen } from '@testing-library/react';
import { FeaturesSection } from '../FeaturesSection';

// Mock icons
jest.mock('@global/icons/GuitarIcon', () => ({
  GuitarIcon: () => <div data-testid="guitar-icon">Guitar Icon</div>,
}));

jest.mock('@global/icons/FullScreenIcon', () => ({
  FullscreenIcon: () => (
    <div data-testid="fullscreen-icon">Fullscreen Icon</div>
  ),
}));

jest.mock('@global/icons/ChurchIcon', () => ({
  ChurchIcon: () => <div data-testid="church-icon">Church Icon</div>,
}));

describe('FeaturesSection Component', () => {
  describe('Component Rendering', () => {
    const { container } = render(<FeaturesSection />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('bg-white');
    expect(section?.className).toMatch(/dark:bg-brand-purple-950/);
  });

  it('should render the features section with dark mode classes', () => {
    const { container } = render(<FeaturesSection />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('bg-white');
    expect(section?.className).toMatch(/dark:bg-brand-purple-950/);
  });

  it('should render the section header', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Todo lo que necesitas para')).toBeInTheDocument();
    expect(screen.getByText('adorar con excelencia')).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    render(<FeaturesSection />);
    expect(
      screen.getByText(/Herramientas profesionales diseñadas específicamente/i),
    ).toBeInTheDocument();
  });
});

describe('Feature Cards', () => {
  it('debe renderizar las tres feature cards', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Gestión de Repertorio')).toBeInTheDocument();
    expect(screen.getByText('Proyección en Tiempo Real')).toBeInTheDocument();
    expect(screen.getByText('Coordinación de Equipo')).toBeInTheDocument();
  });

  it('should render all three feature cards', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Gestión de Repertorio')).toBeInTheDocument();
    expect(screen.getByText('Proyección en Tiempo Real')).toBeInTheDocument();
    expect(screen.getByText('Coordinación de Equipo')).toBeInTheDocument();
  });

  it('should apply correct backgrounds and dark mode to cards', () => {
    const { container } = render(<FeaturesSection />);
    const cards = container.querySelectorAll('.group.rounded-2xl');
    expect(cards.length).toBe(3);
    cards.forEach((card) => {
      expect(card.className).toMatch(/bg-white/);
      expect(card.className).toMatch(/dark:bg-brand-purple-900/);
      expect(card.className).toMatch(/dark:border-brand-purple-800/);
      // Ya no debe haber gradientes
      expect(card.className).not.toMatch(/gradient/);
    });
  });

  it('should render icons for each feature', () => {
    render(<FeaturesSection />);
    expect(screen.getByTestId('guitar-icon')).toBeInTheDocument();
    expect(screen.getByTestId('fullscreen-icon')).toBeInTheDocument();
    expect(screen.getByTestId('church-icon')).toBeInTheDocument();
  });

  it('should render feature descriptions', () => {
    render(<FeaturesSection />);
    expect(
      screen.getByText(/Organiza tu biblioteca de canciones/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Transmite letras al proyector/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mantén a todo tu grupo de alabanza conectado/i),
    ).toBeInTheDocument();
  });
});

describe('Feature Benefits', () => {
  it('debe renderizar los beneficios del primer feature', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Base de datos centralizada')).toBeInTheDocument();
    expect(
      screen.getByText('Acordes y letras siempre disponibles'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Historial de canciones por evento'),
    ).toBeInTheDocument();
  });

  it('debe renderizar los checkmarks para los beneficios', () => {
    render(<FeaturesSection />);
    const checkmarks = screen.getAllByText('✓');
    expect(checkmarks.length).toBe(9); // 3 beneficios por feature × 3 features
  });
});

describe('Styling and Layout', () => {
  it('debe usar clase de gradiente solo en el texto destacado del header', () => {
    render(<FeaturesSection />);
    const gradientText = screen.getByText('adorar con excelencia');
    expect(gradientText).toHaveClass('text-gradient-simple');
    const header = screen.getByText('Todo lo que necesitas para');
    expect(header.className).toMatch(/dark:text-gray-200/);
  });
  describe('Responsive Design', () => {});
});

describe('Responsive Design', () => {
  it('debe tener layout responsivo en el grid', () => {
    const { container } = render(<FeaturesSection />);
    const grid = container.querySelector('.grid');
    expect(grid.className).toMatch(/md:grid-cols-3/);
  });
});
