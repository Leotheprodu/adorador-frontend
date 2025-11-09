import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getBandById } from '@bands/_services/bandsService';
import { getEventsOfBand } from '@bands/[bandId]/eventos/_services/eventsOfBandService';
import { getSongsOfBand } from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { fetchAPI } from '@/global/utils/fetchAPI';

jest.mock('@/global/utils/fetchAPI');

const mockedFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('Band Cache Isolation - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not share cache between different bands when switching bands', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    // eslint-disable-next-line react/display-name
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Datos del Grupo 1
    const band1Data = {
      id: 1,
      name: 'Grupo de Adoración 1',
      songs: [],
      events: [],
      _count: { songs: 5, events: 3 },
    };
    const band1Songs = [
      {
        id: 101,
        title: 'Canción del Grupo 1',
        artist: 'Artist 1',
        bandId: 1,
        _count: { events: 2 },
      },
    ];
    const band1Events = [
      { id: 201, title: 'Evento del Grupo 1', date: '2024-01-01', bandId: 1 },
    ];

    // Datos del Grupo 2
    const band2Data = {
      id: 2,
      name: 'Grupo de Adoración 2',
      songs: [],
      events: [],
      _count: { songs: 8, events: 5 },
    };
    const band2Songs = [
      {
        id: 102,
        title: 'Canción del Grupo 2',
        artist: 'Artist 2',
        bandId: 2,
        _count: { events: 3 },
      },
    ];
    const band2Events = [
      { id: 202, title: 'Evento del Grupo 2', date: '2024-02-01', bandId: 2 },
    ];

    // ===== PASO 1: Usuario entra al Grupo 1 =====
    mockedFetchAPI.mockResolvedValueOnce(band1Data);
    const { result: bandResult1 } = renderHook(() => getBandById('1'), {
      wrapper,
    });
    await waitFor(() => expect(bandResult1.current.isSuccess).toBe(true));

    mockedFetchAPI.mockResolvedValueOnce(band1Songs);
    const { result: songsResult1 } = renderHook(
      () => getSongsOfBand({ bandId: '1' }),
      { wrapper },
    );
    await waitFor(() => expect(songsResult1.current.isSuccess).toBe(true));

    mockedFetchAPI.mockResolvedValueOnce(band1Events);
    const { result: eventsResult1 } = renderHook(
      () => getEventsOfBand({ bandId: '1' }),
      { wrapper },
    );
    await waitFor(() => expect(eventsResult1.current.isSuccess).toBe(true));

    // Verificar datos del Grupo 1
    expect(bandResult1.current.data?.name).toBe('Grupo de Adoración 1');
    expect(songsResult1.current.data?.[0]?.title).toBe('Canción del Grupo 1');
    expect(eventsResult1.current.data?.[0]?.title).toBe('Evento del Grupo 1');

    // ===== PASO 2: Usuario crea/cambia al Grupo 2 =====
    mockedFetchAPI.mockResolvedValueOnce(band2Data);
    const { result: bandResult2 } = renderHook(() => getBandById('2'), {
      wrapper,
    });
    await waitFor(() => expect(bandResult2.current.isSuccess).toBe(true));

    mockedFetchAPI.mockResolvedValueOnce(band2Songs);
    const { result: songsResult2 } = renderHook(
      () => getSongsOfBand({ bandId: '2' }),
      { wrapper },
    );
    await waitFor(() => expect(songsResult2.current.isSuccess).toBe(true));

    mockedFetchAPI.mockResolvedValueOnce(band2Events);
    const { result: eventsResult2 } = renderHook(
      () => getEventsOfBand({ bandId: '2' }),
      { wrapper },
    );
    await waitFor(() => expect(eventsResult2.current.isSuccess).toBe(true));

    // ===== VERIFICACIÓN CRÍTICA: Grupo 2 NO debe tener datos del Grupo 1 =====
    expect(bandResult2.current.data?.name).toBe('Grupo de Adoración 2');
    expect(bandResult2.current.data?.name).not.toBe('Grupo de Adoración 1');

    // Las canciones del Grupo 2 deben ser SOLO del Grupo 2
    expect(songsResult2.current.data?.[0]?.title).toBe('Canción del Grupo 2');
    expect(songsResult2.current.data?.[0]?.title).not.toBe(
      'Canción del Grupo 1',
    );

    // Los eventos del Grupo 2 deben ser SOLO del Grupo 2
    expect(eventsResult2.current.data?.[0]?.title).toBe('Evento del Grupo 2');
    expect(eventsResult2.current.data?.[0]?.title).not.toBe(
      'Evento del Grupo 1',
    );

    // Verificar que se hicieron llamadas separadas al API (no se compartió caché)
    expect(mockedFetchAPI).toHaveBeenCalledTimes(6); // 3 para banda 1 + 3 para banda 2
  });

  it('should correctly isolate cache when user has multiple bands', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    // eslint-disable-next-line react/display-name
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const band1Data = {
      id: 1,
      name: 'Band 1',
      songs: [],
      events: [],
      _count: { songs: 5, events: 3 },
    };

    const band2Data = {
      id: 2,
      name: 'Band 2',
      songs: [],
      events: [],
      _count: { songs: 8, events: 5 },
    };

    const band3Data = {
      id: 3,
      name: 'Band 3',
      songs: [],
      events: [],
      _count: { songs: 2, events: 1 },
    };

    // Usuario tiene 3 bandas diferentes
    mockedFetchAPI.mockResolvedValueOnce(band1Data);
    const { result: result1 } = renderHook(() => getBandById('1'), { wrapper });
    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    mockedFetchAPI.mockResolvedValueOnce(band2Data);
    const { result: result2 } = renderHook(() => getBandById('2'), { wrapper });
    await waitFor(() => expect(result2.current.isSuccess).toBe(true));

    mockedFetchAPI.mockResolvedValueOnce(band3Data);
    const { result: result3 } = renderHook(() => getBandById('3'), { wrapper });
    await waitFor(() => expect(result3.current.isSuccess).toBe(true));

    // Todas las bandas deben tener sus propios datos únicos
    expect(result1.current.data?.name).toBe('Band 1');
    expect(result1.current.data?._count.songs).toBe(5);

    expect(result2.current.data?.name).toBe('Band 2');
    expect(result2.current.data?._count.songs).toBe(8);

    expect(result3.current.data?.name).toBe('Band 3');
    expect(result3.current.data?._count.songs).toBe(2);

    // Cada banda debe haber hecho su propia llamada al API
    expect(mockedFetchAPI).toHaveBeenCalledTimes(3);
  });
});
