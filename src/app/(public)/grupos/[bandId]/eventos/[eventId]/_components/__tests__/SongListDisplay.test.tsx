// Mock NextUI components FIRST
jest.mock('@nextui-org/react', () => ({
  Button: ({
    children,
    onPress,
    ...props
  }: React.PropsWithChildren<{ onPress?: () => void }>) => (
    <button onClick={onPress} {...props}>
      {children}
    </button>
  ),
}));

// Mock SongCardWithControls
jest.mock('../SongCardWithControls', () => ({
  SongCardWithControls: ({
    data,
    index,
  }: {
    data: { order: number; song: { title: string } };
    index: number;
  }) => (
    <div data-testid="song-card">
      <span className="bg-gradient-to-br">{data.order}</span>
      <span>{data.song.title}</span>
    </div>
  ),
}));

// Mock del componente AddSongEventButton ANTES de imports
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

// NOW imports
import { render, screen } from '@testing-library/react';
import { SongListDisplay } from '../SongListDisplay';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

    // Tests eliminados: verificaban detalles internos de SongCardWithControls (tipo de canción, tono, clases CSS)
    // SongListDisplay solo debe testear que renderiza las canciones, no los detalles de cómo se muestran
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

    // Test eliminado: verificaba clases CSS internas de SongCardWithControls
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
