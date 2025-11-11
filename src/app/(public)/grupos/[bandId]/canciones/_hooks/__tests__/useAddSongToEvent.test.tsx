import { renderHook } from '@testing-library/react';
import { useAddSongToEvent } from '../useAddSongToEvent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock de los servicios
jest.mock('@bands/[bandId]/eventos/_services/eventsOfBandService', () => ({
  getEventsOfBand: jest.fn(() => ({
    data: [
      {
        id: 1,
        title: 'Evento 1',
        date: new Date(Date.now() + 86400000).toISOString(), // Mañana
        songs: [],
      },
      {
        id: 2,
        title: 'Evento 2',
        date: new Date(Date.now() + 172800000).toISOString(), // Pasado mañana
        songs: [],
      },
      {
        id: 3,
        title: 'Evento Pasado',
        date: new Date(Date.now() - 86400000).toISOString(), // Ayer
        songs: [],
      },
    ],
  })),
}));

jest.mock(
  '@bands/[bandId]/eventos/[eventId]/en-vivo/_services/eventByIdService',
  () => ({
    getEventsById: jest.fn(() => ({
      data: {
        id: 1,
        title: 'Evento 1',
        date: new Date(Date.now() + 86400000).toISOString(),
        songs: [
          { id: 1, order: 1, song: { id: 100, title: 'Canción 1' } },
          { id: 2, order: 2, song: { id: 101, title: 'Canción 2' } },
        ],
      },
    })),
  }),
);

jest.mock(
  '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/addSongToEvent/services/AddSongsToEventService',
  () => ({
    addSongsToEventService: jest.fn(() => ({
      mutate: jest.fn(),
      status: 'idle',
    })),
  }),
);

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('useAddSongToEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe filtrar solo eventos futuros', () => {
    const { result } = renderHook(
      () =>
        useAddSongToEvent({
          bandId: '1',
          songId: 50,
          songTitle: 'Test Song',
        }),
      { wrapper: createWrapper() },
    );

    // Debe tener solo 2 eventos futuros (no el que ya pasó)
    expect(result.current.upcomingEvents).toHaveLength(2);
    expect(result.current.upcomingEvents[0].title).toBe('Evento 1');
    expect(result.current.upcomingEvents[1].title).toBe('Evento 2');
  });

  it('debe indicar si hay eventos futuros disponibles', () => {
    const { result } = renderHook(
      () =>
        useAddSongToEvent({
          bandId: '1',
          songId: 50,
          songTitle: 'Test Song',
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.hasUpcomingEvents).toBe(true);
  });

  it('debe ordenar eventos futuros por fecha (más cercano primero)', () => {
    const { result } = renderHook(
      () =>
        useAddSongToEvent({
          bandId: '1',
          songId: 50,
          songTitle: 'Test Song',
        }),
      { wrapper: createWrapper() },
    );

    const dates = result.current.upcomingEvents.map((e) =>
      new Date(e.date).getTime(),
    );
    expect(dates[0]).toBeLessThan(dates[1]);
  });

  it('debe abrir el modal correctamente', () => {
    const { result } = renderHook(
      () =>
        useAddSongToEvent({
          bandId: '1',
          songId: 50,
          songTitle: 'Test Song',
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isOpen).toBe(false);
    // El test verifica que el método onOpen está disponible
    expect(typeof result.current.onOpen).toBe('function');
  });

  it('debe retornar el estado de carga correcto', () => {
    const { result } = renderHook(
      () =>
        useAddSongToEvent({
          bandId: '1',
          songId: 50,
          songTitle: 'Test Song',
        }),
      { wrapper: createWrapper() },
    );

    // Estado inicial debe ser false
    expect(result.current.isAdding).toBe(false);
  });

  it('debe proporcionar handleAddSongToEvent para seleccionar un evento', () => {
    const { result } = renderHook(
      () =>
        useAddSongToEvent({
          bandId: '1',
          songId: 50,
          songTitle: 'Test Song',
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.handleAddSongToEvent).toBeDefined();
    expect(typeof result.current.handleAddSongToEvent).toBe('function');
  });
});
