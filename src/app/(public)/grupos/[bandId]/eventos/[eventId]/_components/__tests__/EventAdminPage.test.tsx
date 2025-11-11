import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventAdminPage } from '../EventAdminPage';
import { useEventAdminPage } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventAdminPage';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';
import { useRouter } from 'next/navigation';
import type { EventByIdInterface } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import type { LoggedUser } from '@auth/login/_interfaces/LoginInterface';
import { userRoles } from '@global/config/constants';
import { $user } from '@stores/users';
import { $event } from '@stores/event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock @nanostores/react FIRST
jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: (store: any) => store.get(),
}));

// Mock de los hooks
jest.mock('@bands/[bandId]/eventos/[eventId]/_hooks/useEventAdminPage');
jest.mock('@global/hooks/useEventTimeLeft');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock users store
jest.mock('@stores/users', () => {
  let userValue: LoggedUser = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    status: 'inactive',
    roles: [],
    memberships: [],
    membersofBands: [],
    isLoggedIn: false,
  };

  return {
    $user: {
      get: () => userValue,
      set: (newValue: LoggedUser) => {
        userValue = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// Mock event store
jest.mock('@stores/event', () => {
  let eventValue: EventByIdInterface = {
    id: 0,
    title: '',
    date: '',
    bandId: 0,
    songs: [],
  };

  return {
    $event: {
      get: () => eventValue,
      set: (newValue: EventByIdInterface) => {
        eventValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $eventSelectedSongId: {
      get: () => '',
      set: jest.fn(),
      subscribe: jest.fn(),
    },
    $eventLirycSelected: { get: () => 0, set: jest.fn(), subscribe: jest.fn() },
    $eventLiveMessage: { get: () => '', set: jest.fn(), subscribe: jest.fn() },
    $selectedSongData: {
      get: () => null,
      set: jest.fn(),
      subscribe: jest.fn(),
    },
    $selectedSongLyricLength: {
      get: () => 0,
      set: jest.fn(),
      subscribe: jest.fn(),
    },
    $lyricSelected: { get: () => null, set: jest.fn(), subscribe: jest.fn() },
  };
});

// Mock de los componentes
jest.mock(
  '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EditEventButton',
  () => ({
    EditEventButton: () => <button>Edit Event</button>,
  }),
);
jest.mock(
  '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/DeleteEventButton',
  () => ({
    DeleteEventButton: () => <button>Delete Event</button>,
  }),
);
jest.mock('../SongListDisplay', () => ({
  SongListDisplay: ({ songs }: { songs: unknown[] }) => (
    <div data-testid="song-list-display">
      <div>Canciones: {songs.length}</div>
    </div>
  ),
}));

const mockUseEventAdminPage = useEventAdminPage as jest.MockedFunction<
  typeof useEventAdminPage
>;
const mockUseEventTimeLeft = useEventTimeLeft as jest.MockedFunction<
  typeof useEventTimeLeft
>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

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

describe('EventAdminPage', () => {
  const mockParams = {
    bandId: 'band-123',
    eventId: 'event-456',
  };

  const mockEvent: EventByIdInterface = {
    id: 456,
    title: 'Evento de Prueba',
    date: '2025-12-25T18:00:00.000Z',
    bandId: 123,
    songs: [
      {
        transpose: 0,
        order: 1,
        song: {
          id: 1,
          title: 'Canción 1',
          artist: null,
          songType: 'worship',
          key: null,
          lyrics: [],
        },
      },
      {
        transpose: 0,
        order: 2,
        song: {
          id: 2,
          title: 'Canción 2',
          artist: null,
          songType: 'praise',
          key: null,
          lyrics: [],
        },
      },
    ],
  };

  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockRefetch = jest.fn();

  const mockAdminUser: LoggedUser = {
    id: 1,
    name: 'Admin User',
    email: 'admin@test.com',
    phone: '',
    birthdate: '',
    status: 'active',
    isLoggedIn: true,
    roles: [userRoles.admin.id],
    memberships: [],
    membersofBands: [],
  };

  const mockEventManagerUser: LoggedUser = {
    id: 2,
    name: 'Event Manager',
    email: 'manager@test.com',
    phone: '',
    birthdate: '',
    status: 'active',
    isLoggedIn: true,
    roles: [],
    memberships: [],
    membersofBands: [
      {
        id: 1,
        isActive: true,
        isAdmin: false,
        isEventManager: true,
        role: 'event-manager',
        band: { id: 123, name: 'Test Band' },
      },
    ],
  };

  const mockRegularUser: LoggedUser = {
    id: 3,
    name: 'Regular User',
    email: 'user@test.com',
    phone: '',
    birthdate: '',
    status: 'active',
    isLoggedIn: true,
    roles: [],
    memberships: [],
    membersofBands: [
      {
        id: 2,
        isActive: true,
        isAdmin: false,
        isEventManager: false,
        role: 'member',
        band: { id: 123, name: 'Test Band' },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseRouter.mockReturnValue(mockRouter as any);
    mockUseEventTimeLeft.mockReturnValue({
      eventTimeLeft: '5 días',
      timeLeft: 432000000,
    });

    // Reset stores to default values
    $user.set(mockRegularUser);
    $event.set({ bandId: 123, id: 456, title: '', date: '', songs: [] });

    // Mock default return with refetch
    mockUseEventAdminPage.mockReturnValue({
      event: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  describe('Estados de carga', () => {
    test('debe mostrar el spinner mientras carga', () => {
      mockUseEventAdminPage.mockReturnValue({
        event: undefined,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    test('debe mostrar mensaje de error cuando no encuentra el evento', async () => {
      mockUseEventAdminPage.mockReturnValue({
        event: undefined,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.getByText('Evento no encontrado')).toBeInTheDocument();
      expect(screen.getByText('Volver a eventos')).toBeInTheDocument();
    });

    test('debe navegar a la lista de eventos cuando se hace clic en "Volver a eventos" desde el error', async () => {
      const user = userEvent.setup();
      mockUseEventAdminPage.mockReturnValue({
        event: undefined,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      const backButton = screen.getByText('Volver a eventos');
      await user.click(backButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/grupos/band-123/eventos');
    });
  });

  describe('Renderizado del evento', () => {
    beforeEach(() => {
      mockUseEventAdminPage.mockReturnValue({
        event: mockEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });
    });

    test('debe renderizar la información básica del evento', () => {
      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.getByText('Evento de Prueba')).toBeInTheDocument();
      expect(screen.getByText(/jueves/i)).toBeInTheDocument(); // formato de fecha con día
      // Verifica que la sección de "Información del Evento" esté presente
      expect(screen.getByText('Información del Evento')).toBeInTheDocument();
    });

    test('debe mostrar el estado "Próximo" para eventos futuros', () => {
      const futureEvent: EventByIdInterface = {
        ...mockEvent,
        date: new Date(Date.now() + 86400000).toISOString(), // mañana
      };

      mockUseEventAdminPage.mockReturnValue({
        event: futureEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.getByText('Próximo')).toBeInTheDocument();
      expect(screen.getByText(/Tiempo restante: 5 días/)).toBeInTheDocument();
    });

    test('debe mostrar el estado "Finalizado" para eventos pasados', () => {
      const pastEvent: EventByIdInterface = {
        ...mockEvent,
        date: new Date(Date.now() - 86400000).toISOString(), // ayer
      };

      mockUseEventAdminPage.mockReturnValue({
        event: pastEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.getByText('Finalizado')).toBeInTheDocument();
      expect(screen.queryByText(/Tiempo restante/)).not.toBeInTheDocument();
    });

    test('debe renderizar el link al evento en vivo', () => {
      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      const liveLink = screen.getByRole('link', { name: /Evento en Vivo/i });
      expect(liveLink).toHaveAttribute(
        'href',
        '/grupos/band-123/eventos/event-456/en-vivo',
      );
    });
  });

  describe('Permisos de administración', () => {
    beforeEach(() => {
      mockUseEventAdminPage.mockReturnValue({
        event: mockEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });
    });

    test('debe mostrar botones de edición/eliminación para usuarios admin', () => {
      $user.set(mockAdminUser);
      $event.set({ bandId: 123, id: 456, title: '', date: '', songs: [] });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.getByText('Edit Event')).toBeInTheDocument();
      expect(screen.getByText('Delete Event')).toBeInTheDocument();
    });

    test('debe mostrar botones de edición/eliminación para event managers', () => {
      $user.set(mockEventManagerUser);
      $event.set({ bandId: 123, id: 456, title: '', date: '', songs: [] });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.getByText('Edit Event')).toBeInTheDocument();
      expect(screen.getByText('Delete Event')).toBeInTheDocument();
    });

    test('no debe mostrar botones de edición/eliminación para usuarios regulares', () => {
      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.queryByText('Edit Event')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Event')).not.toBeInTheDocument();
    });
  });

  describe('Navegación', () => {
    beforeEach(() => {
      mockUseEventAdminPage.mockReturnValue({
        event: mockEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });
    });

    test('debe navegar de vuelta a la lista de eventos', async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      const backButton = screen.getByRole('button', {
        name: /Volver a eventos/i,
      });
      await user.click(backButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/grupos/band-123/eventos');
    });
  });

  describe('Estadísticas del evento', () => {
    test('debe mostrar la información del evento incluyendo las canciones', () => {
      mockUseEventAdminPage.mockReturnValue({
        event: mockEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      // Verifica que la sección de "Información del Evento" esté presente
      expect(screen.getByText('Información del Evento')).toBeInTheDocument();
      expect(screen.getByText('Canciones')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
    });

    test('debe mostrar el estado del evento', () => {
      mockUseEventAdminPage.mockReturnValue({
        event: mockEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      // Verifica que muestre el estado activo
      expect(screen.getByText(/🟢 Activo/)).toBeInTheDocument();
    });

    test('debe mostrar el ID del evento', () => {
      mockUseEventAdminPage.mockReturnValue({
        event: mockEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.getByText('#456')).toBeInTheDocument();
    });
  });

  describe('Lista de canciones', () => {
    test('debe renderizar el componente SongListDisplay', () => {
      mockUseEventAdminPage.mockReturnValue({
        event: mockEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      const songList = screen.getByTestId('song-list-display');
      expect(songList).toBeInTheDocument();
    });

    test('debe pasar las canciones correctamente al componente SongListDisplay', () => {
      mockUseEventAdminPage.mockReturnValue({
        event: mockEvent,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      // Verifica que se pase el número correcto de canciones (2 en mockEvent)
      expect(screen.getByText('Canciones: 2')).toBeInTheDocument();
    });

    test('debe pasar un array vacío cuando no hay canciones', () => {
      const eventWithoutSongs: EventByIdInterface = {
        ...mockEvent,
        songs: [],
      };

      mockUseEventAdminPage.mockReturnValue({
        event: eventWithoutSongs,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      });

      renderWithQueryClient(<EventAdminPage params={mockParams} />);

      expect(screen.getByText('Canciones: 0')).toBeInTheDocument();
    });
  });
});
