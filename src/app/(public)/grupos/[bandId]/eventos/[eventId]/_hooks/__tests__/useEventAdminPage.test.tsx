import { renderHook, waitFor } from '@testing-library/react';
import { useEventAdminPage } from '../useEventAdminPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock del servicio
jest.mock(
  '@bands/[bandId]/eventos/[eventId]/en-vivo/_services/eventByIdService',
  () => ({
    getEventsById: jest.fn(),
  }),
);

import { getEventsById } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_services/eventByIdService';

describe('useEventAdminPage', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    // eslint-disable-next-line react/display-name
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient?.clear();
  });

  it('debe cargar los datos del evento correctamente', async () => {
    const mockEventData = {
      id: 1,
      title: 'Evento de Prueba',
      date: '2025-12-25',
      bandId: 1,
      songs: [
        {
          id: 1,
          order: 1,
          transpose: 0,
          song: {
            id: 100,
            title: 'Canción 1',
            artist: 'Artista 1',
            songType: 'worship' as const,
            key: 'C',
            lyrics: [],
          },
        },
      ],
    };

    (getEventsById as jest.Mock).mockReturnValue({
      data: mockEventData,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(
      () =>
        useEventAdminPage({
          params: { bandId: '1', eventId: '1' },
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.event).toEqual(mockEventData);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('debe retornar isLoading true mientras carga', () => {
    (getEventsById as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(
      () =>
        useEventAdminPage({
          params: { bandId: '1', eventId: '1' },
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.event).toBeUndefined();
  });

  it('debe manejar errores correctamente', async () => {
    const mockError = new Error('Error al cargar evento');

    (getEventsById as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(
      () =>
        useEventAdminPage({
          params: { bandId: '1', eventId: '1' },
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
      expect(result.current.event).toBeUndefined();
    });
  });

  it('debe usar los parámetros correctos para obtener el evento', () => {
    const params = { bandId: '123', eventId: '456' };

    (getEventsById as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderHook(() => useEventAdminPage({ params }), {
      wrapper: createWrapper(),
    });

    expect(getEventsById).toHaveBeenCalledWith(params);
  });
});
