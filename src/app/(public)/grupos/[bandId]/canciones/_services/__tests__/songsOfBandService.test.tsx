import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSongsOfBand } from '../songsOfBandService';
import { fetchAPI } from '@/global/utils/fetchAPI';

jest.mock('@/global/utils/fetchAPI');

const mockedFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('songsOfBandService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSongsOfBand', () => {
    it('should use query key with bandId to prevent cache collision', async () => {
      const mockSongs = [
        {
          id: 1,
          title: 'Song 1',
          artist: 'Artist 1',
          bandId: 123,
          _count: { events: 0 },
        },
        {
          id: 2,
          title: 'Song 2',
          artist: 'Artist 2',
          bandId: 123,
          _count: { events: 0 },
        },
      ];

      mockedFetchAPI.mockResolvedValueOnce(mockSongs);

      const { result } = renderHook(() => getSongsOfBand({ bandId: '123' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSongs);
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('/bands/123/songs'),
        }),
      );
    });

    it('should maintain separate cache for different bandIds', async () => {
      const mockSongsBand1 = [
        {
          id: 1,
          title: 'Band 1 Song',
          artist: 'Artist 1',
          bandId: 1,
          _count: { events: 3 },
        },
      ];

      const mockSongsBand2 = [
        {
          id: 2,
          title: 'Band 2 Song',
          artist: 'Artist 2',
          bandId: 2,
          _count: { events: 5 },
        },
      ];

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // eslint-disable-next-line react/display-name
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Fetch songs for band 1
      mockedFetchAPI.mockResolvedValueOnce(mockSongsBand1);
      const { result: result1 } = renderHook(
        () => getSongsOfBand({ bandId: '1' }),
        { wrapper },
      );

      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Fetch songs for band 2
      mockedFetchAPI.mockResolvedValueOnce(mockSongsBand2);
      const { result: result2 } = renderHook(
        () => getSongsOfBand({ bandId: '2' }),
        { wrapper },
      );

      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Las canciones deben ser diferentes para cada banda
      expect(result1.current.data?.[0]?.title).toBe('Band 1 Song');
      expect(result2.current.data?.[0]?.title).toBe('Band 2 Song');
      expect(result1.current.data?.[0]?._count.events).toBe(3);
      expect(result2.current.data?.[0]?._count.events).toBe(5);

      // Debe haber llamado al API dos veces (no compartir caché)
      expect(mockedFetchAPI).toHaveBeenCalledTimes(2);
    });

    it('should not return songs from wrong band due to cache collision', async () => {
      const mockSongsBand1 = [
        {
          id: 1,
          title: 'Wrong Band Song',
          artist: 'Artist 1',
          bandId: 1,
          _count: { events: 0 },
        },
      ];

      const mockSongsBand2 = [
        {
          id: 2,
          title: 'Correct Band Song',
          artist: 'Artist 2',
          bandId: 2,
          _count: { events: 0 },
        },
      ];

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // eslint-disable-next-line react/display-name
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Primero obtener canciones de banda 1
      mockedFetchAPI.mockResolvedValueOnce(mockSongsBand1);
      const { result: result1 } = renderHook(
        () => getSongsOfBand({ bandId: '1' }),
        { wrapper },
      );
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Luego obtener canciones de banda 2
      mockedFetchAPI.mockResolvedValueOnce(mockSongsBand2);
      const { result: result2 } = renderHook(
        () => getSongsOfBand({ bandId: '2' }),
        { wrapper },
      );
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Verificar que banda 2 NO tiene canciones de banda 1
      expect(result2.current.data).toEqual(mockSongsBand2);
      expect(result2.current.data).not.toEqual(mockSongsBand1);
      expect(result2.current.data?.[0]?.title).toBe('Correct Band Song');
      expect(result2.current.data?.[0]?.title).not.toBe('Wrong Band Song');
    });
  });
});
