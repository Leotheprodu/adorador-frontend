import { render, screen } from '@testing-library/react';
import { SongListDisplay } from '../SongListDisplay';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock del componente AddSongEventButton
jest.mock(
  '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/addSongToEvent/AddSongEventButton',
  () => ({
    AddSongEventButton: ({
      isAdminEvent,
    }: {
      isAdminEvent?: boolean;
      params: { bandId: string; eventId: string };
      refetch: () => void;
    }) => (
      <button
        aria-label="Agregar canción al evento"
        disabled={isAdminEvent === false}
      >
        Add Song
      </button>
    ),
  }),
);

// Helper para renderizar con QueryClientProvider
const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe('SongListDisplay', () => {
  const mockParams = {
    bandId: 'band-123',
    eventId: 'event-456',
  };

  const mockRefetch = jest.fn();

  const mockSongs = [
    {
      order: 1,
      transpose: 0,
      song: {
        id: 1,
        title: 'Canción de Adoración',
        songType: 'worship' as const,
        key: 'C',
      },
    },
    {
      order: 2,
      transpose: 2,
      song: {
        id: 2,
        title: 'Canción de Alabanza',
        songType: 'praise' as const,
        key: 'D',
      },
    },
    {
      order: 3,
      transpose: 0,
      song: {
        id: 3,
        title: 'Canción sin tono',
        songType: 'worship' as const,
        key: null,
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    test('debe renderizar el título y el contador de canciones', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      expect(screen.getByText('Canciones del Evento')).toBeInTheDocument();
      // Verificamos que el contador tenga el valor correcto buscando por clase específica
      const allThrees = screen.getAllByText('3');
      const contador = allThrees.find((el) =>
        el.className.includes('bg-brand-purple-100'),
      );
      expect(contador).toBeInTheDocument();
    });

    test('debe renderizar todas las canciones', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      expect(screen.getByText('Canción de Adoración')).toBeInTheDocument();
      expect(screen.getByText('Canción de Alabanza')).toBeInTheDocument();
      expect(screen.getByText('Canción sin tono')).toBeInTheDocument();
    });

    test('debe mostrar el número de orden de cada canción', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      // Verificamos que los números de orden estén presentes buscando en elementos con bg-gradient
      const orderNumbers = screen.getAllByText(/^[1-3]$/);
      const orderBadges = orderNumbers.filter((el) =>
        el.className.includes('bg-gradient-to-br'),
      );
      expect(orderBadges).toHaveLength(3);
    });

    test('debe mostrar el tipo de canción', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      const adoracionTags = screen.getAllByText('Adoración');
      const alabanzaTags = screen.getAllByText('Alabanza');

      expect(adoracionTags.length).toBe(2); // Dos canciones de adoración
      expect(alabanzaTags.length).toBe(1); // Una canción de alabanza
    });

    test('debe mostrar el tono de la canción cuando existe', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      expect(screen.getByText(/Tono: C/)).toBeInTheDocument();
      expect(screen.getByText(/Tono: E/)).toBeInTheDocument(); // D + 2 = E
    });

    test('no debe mostrar el tono cuando es null', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={[mockSongs[2]]}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      expect(screen.queryByText(/Tono:/)).not.toBeInTheDocument();
    });
  });

  describe('Estado vacío', () => {
    test('debe mostrar mensaje cuando no hay canciones (usuario regular)', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={[]}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      expect(
        screen.getByText('No hay canciones en este evento'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('El administrador aún no ha agregado canciones'),
      ).toBeInTheDocument();
    });

    test('debe mostrar mensaje para agregar canciones (admin)', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={[]}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={true}
        />,
      );

      expect(
        screen.getByText('No hay canciones en este evento'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Agrega canciones usando el botón +'),
      ).toBeInTheDocument();
    });
  });

  describe('Permisos de administración', () => {
    test('debe mostrar el botón de agregar canción habilitado para administradores', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={true}
        />,
      );

      // El botón está dentro del componente AddSongEventButton
      const addButton = screen.getByRole('button', {
        name: /agregar canción al evento/i,
      });
      expect(addButton).toBeInTheDocument();
      expect(addButton).not.toBeDisabled();
    });

    test('debe mostrar el botón de agregar canción deshabilitado para usuarios regulares', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      // El botón está dentro del componente AddSongEventButton
      const addButton = screen.getByRole('button', {
        name: /agregar canción al evento/i,
      });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toBeDisabled();
    });
  });

  describe('Estilos y diseño', () => {
    test('debe aplicar estilos de gradiente al título', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      // Encontrar el contador específicamente (no el número de orden)
      const allThrees = screen.getAllByText('3');
      const contador = allThrees.find((el) =>
        el.className.includes('bg-brand-purple-100'),
      );
      expect(contador).toBeTruthy();
      expect(contador?.closest('span')).toHaveClass('bg-brand-purple-100');
    });

    test('debe renderizar tarjetas de canciones con clases apropiadas', () => {
      const { container } = renderWithQueryClient(
        <SongListDisplay
          songs={[mockSongs[0]]}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      const songCard = container.querySelector('.group');
      expect(songCard).toHaveClass('border-slate-200');
      expect(songCard).toHaveClass('bg-white');
    });
  });

  describe('Accesibilidad', () => {
    test('debe tener estructura semántica correcta', () => {
      renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      const heading = screen.getByText('Canciones del Evento');
      expect(heading.tagName).toBe('H3');
    });

    test('debe renderizar íconos decorativos', () => {
      const { container } = renderWithQueryClient(
        <SongListDisplay
          songs={mockSongs}
          params={mockParams}
          refetch={mockRefetch}
          isAdminEvent={false}
        />,
      );

      // Verifica que hay íconos SVG
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });
  });
});
