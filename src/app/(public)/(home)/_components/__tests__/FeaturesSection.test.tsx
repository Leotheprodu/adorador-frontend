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
    it('should render the features section', () => {
      const { container } = render(<FeaturesSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-white');
    });

    it('should render the section header', () => {
      render(<FeaturesSection />);
      expect(
        screen.getByText('Todo lo que necesitas para'),
      ).toBeInTheDocument();
      expect(screen.getByText('adorar con excelencia')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(<FeaturesSection />);
      expect(
        screen.getByText(
          /Herramientas profesionales diseñadas específicamente/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Feature Cards', () => {
    it('should render all three feature cards', () => {
      render(<FeaturesSection />);
      expect(screen.getByText('Gestión de Repertorio')).toBeInTheDocument();
      expect(screen.getByText('Proyección en Tiempo Real')).toBeInTheDocument();
      expect(screen.getByText('Coordinación de Equipo')).toBeInTheDocument();
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
    it('should render benefits list for first feature', () => {
      render(<FeaturesSection />);
      expect(
        screen.getByText('Base de datos centralizada'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Acordes y letras siempre disponibles'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Historial de canciones por evento'),
      ).toBeInTheDocument();
    });

    it('should render checkmarks for benefits', () => {
      render(<FeaturesSection />);
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBe(9); // 3 benefits per feature × 3 features
    });
  });

  describe('Styling and Layout', () => {
    it('should use gradient classes correctly', () => {
      render(<FeaturesSection />);
      const gradientText = screen.getByText('adorar con excelencia');
      expect(gradientText).toHaveClass('text-gradient-simple');
    });

    it('should apply hover effects to cards', () => {
      const { container } = render(<FeaturesSection />);
      const cards = container.querySelectorAll('.group');
      expect(cards.length).toBe(3);
      cards.forEach((card) => {
        expect(card).toHaveClass('hover:border-brand-purple-300');
      });
    });

    it('should use gradient icon backgrounds', () => {
      const { container } = render(<FeaturesSection />);
      const iconContainers = container.querySelectorAll('.bg-gradient-icon');
      expect(iconContainers.length).toBe(3);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      const { container } = render(<FeaturesSection />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('md:grid-cols-3');
    });
  });
});
