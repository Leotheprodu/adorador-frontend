import { render, screen } from '@testing-library/react';
import { ChordDisplay } from '../ChordDisplay';
import { ChordProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

// Mock de getNoteByType
jest.mock('@bands/[bandId]/eventos/[eventId]/_utils/getNoteByType', () => ({
  getNoteByType: jest.fn((note: string, transpose: number) => {
    // Simulación simple de transposición para tests
    if (transpose === 0) return note;
    return `${note}+${transpose}`;
  }),
}));

describe('ChordDisplay', () => {
  const mockChordPreferences = {
    noteType: 'latin' as const,
    accidentalType: 'sostenido' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('debe renderizar acordes sin slash correctamente', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'C',
          chordQuality: 'm',
          position: 1,
        },
        {
          id: 2,
          rootNote: 'G',
          chordQuality: '7',
          position: 2,
        },
      ];

      render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      expect(screen.getByText(/Cm/)).toBeInTheDocument();
      expect(screen.getByText(/G7/)).toBeInTheDocument();
    });

    it('debe renderizar acordes con slash correctamente', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'Bm',
          chordQuality: '',
          position: 1,
          slashChord: 'G',
        },
      ];

      render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      // Verificar que la nota raíz y el slash están presentes
      const chordElement = screen.getByText(/Bm/);
      expect(chordElement).toBeInTheDocument();

      const slashElement = screen.getByText(/\/G/);
      expect(slashElement).toBeInTheDocument();
    });

    it('debe mostrar el carácter "/" en acordes slash', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'D',
          chordQuality: 'm',
          position: 1,
          slashChord: 'F',
        },
      ];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      // Verificar que el slash está en el DOM
      expect(container.textContent).toContain('/');
      expect(container.textContent).toContain('Dm');
      expect(container.textContent).toContain('/F');
    });

    it('debe renderizar acordes vacíos sin errores', () => {
      const chords: ChordProps[] = [];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      expect(container.querySelector('.grid')).toBeInTheDocument();
    });
  });

  describe('Ordenamiento y posicionamiento', () => {
    it('debe ordenar acordes por posición', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'G',
          chordQuality: '',
          position: 3,
        },
        {
          id: 2,
          rootNote: 'C',
          chordQuality: '',
          position: 1,
        },
        {
          id: 3,
          rootNote: 'D',
          chordQuality: '',
          position: 2,
        },
      ];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      const chordDivs = container.querySelectorAll('.col-span-1');
      expect(chordDivs).toHaveLength(3);

      // Verificar que están en el orden correcto según gridColumnStart
      const firstChord = chordDivs[0] as HTMLElement;
      expect(firstChord.style.gridColumnStart).toBe('1');

      const secondChord = chordDivs[1] as HTMLElement;
      expect(secondChord.style.gridColumnStart).toBe('2');

      const thirdChord = chordDivs[2] as HTMLElement;
      expect(thirdChord.style.gridColumnStart).toBe('3');
    });
  });

  describe('Transposición', () => {
    it('debe aplicar transposición a la nota raíz', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'C',
          chordQuality: 'm',
          position: 1,
        },
      ];

      render(
        <ChordDisplay
          chords={chords}
          transpose={2}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      // Con nuestro mock, transpose=2 debería dar "C+2"
      expect(screen.getByText(/C\+2/)).toBeInTheDocument();
    });

    it('debe aplicar transposición al acorde slash', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'D',
          chordQuality: 'm',
          position: 1,
          slashChord: 'F',
        },
      ];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={1}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      // Verificar que tanto la nota raíz como el slash tienen transposición
      expect(container.textContent).toContain('D+1');
      expect(container.textContent).toContain('/F+1');
    });
  });

  describe('Escala de letra', () => {
    it('debe aplicar escala de 0.9 veces la escala base al tamaño de fuente', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'C',
          chordQuality: '',
          position: 1,
        },
      ];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1.5}
        />,
      );

      const gridElement = container.querySelector('.grid');
      expect(gridElement).toHaveStyle({ fontSize: '1.35rem' }); // 1.5 * 0.9 = 1.35
    });

    it('debe usar escala por defecto cuando lyricsScale es 1', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'C',
          chordQuality: '',
          position: 1,
        },
      ];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      const gridElement = container.querySelector('.grid');
      expect(gridElement).toHaveStyle({ fontSize: '0.9rem' }); // 1 * 0.9 = 0.9
    });
  });

  describe('Estilos uniformes', () => {
    it('debe tener estilos uniformes en acordes sin slash', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'Am',
          chordQuality: '7',
          position: 1,
        },
      ];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      const chordSpan = container.querySelector('span');
      expect(chordSpan).toHaveClass('font-semibold', 'text-primary-600');
    });

    it('debe tener estilos uniformes en acordes con slash (sin background ni tamaño diferente)', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'C',
          chordQuality: '',
          position: 1,
          slashChord: 'G',
        },
      ];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      const spans = container.querySelectorAll('span');

      // Ambos spans deben tener las mismas clases
      spans.forEach((span) => {
        expect(span).toHaveClass('font-semibold', 'text-primary-600');
        // No debe tener text-xs (tamaño diferente)
        expect(span).not.toHaveClass('text-xs');
      });

      // El div del slash no debe tener background
      const slashContainer =
        container.querySelector('span:last-child')?.parentElement;
      expect(slashContainer).not.toHaveClass('bg-primary-100');
      expect(slashContainer).not.toHaveClass('rounded-sm');
    });
  });

  describe('Casos con múltiples acordes', () => {
    it('debe manejar múltiples acordes, algunos con slash y otros sin slash', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'C',
          chordQuality: '',
          position: 1,
        },
        {
          id: 2,
          rootNote: 'Am',
          chordQuality: '7',
          position: 2,
        },
        {
          id: 3,
          rootNote: 'D',
          chordQuality: 'm',
          position: 3,
          slashChord: 'F',
        },
        {
          id: 4,
          rootNote: 'G',
          chordQuality: '',
          position: 4,
        },
      ];

      const { container } = render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      // Verificar que todos los acordes están presentes
      expect(container.textContent).toContain('C');
      expect(container.textContent).toContain('Am7');
      expect(container.textContent).toContain('Dm');
      expect(container.textContent).toContain('/F');
      expect(container.textContent).toContain('G');

      // Verificar que solo hay un slash
      const slashCount = (container.textContent?.match(/\//g) || []).length;
      expect(slashCount).toBe(1);
    });
  });

  describe('Calidad de acordes', () => {
    it('debe renderizar diferentes calidades de acordes correctamente', () => {
      const chords: ChordProps[] = [
        {
          id: 1,
          rootNote: 'C',
          chordQuality: '',
          position: 1,
        },
        {
          id: 2,
          rootNote: 'D',
          chordQuality: 'm',
          position: 2,
        },
        {
          id: 3,
          rootNote: 'E',
          chordQuality: '7',
          position: 3,
        },
        {
          id: 4,
          rootNote: 'F',
          chordQuality: 'maj7',
          position: 4,
        },
      ];

      render(
        <ChordDisplay
          chords={chords}
          transpose={0}
          chordPreferences={mockChordPreferences}
          lyricsScale={1}
        />,
      );

      expect(screen.getByText(/^C$/)).toBeInTheDocument(); // Solo C
      expect(screen.getByText(/Dm/)).toBeInTheDocument();
      expect(screen.getByText(/E7/)).toBeInTheDocument();
      expect(screen.getByText(/Fmaj7/)).toBeInTheDocument();
    });
  });
});
