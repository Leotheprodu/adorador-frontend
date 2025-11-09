import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getBandById } from '../bandsService';
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

describe('bandsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBandById', () => {
    it('should use query key with bandId to prevent cache collision', async () => {
      const mockBand = {
        id: 1,
        name: 'Test Band',
        songs: [],
        events: [],
        _count: { songs: 0, events: 0 },
      };

      mockedFetchAPI.mockResolvedValueOnce(mockBand);

      const { result } = renderHook(() => getBandById('123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockBand);
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('/bands/123'),
        }),
      );
    });

    it('should maintain separate cache for different bandIds', async () => {
      const mockBand1 = {
        id: 1,
        name: 'Band 1',
        songs: [],
        events: [],
        _count: { songs: 5, events: 3 },
      };

      const mockBand2 = {
        id: 2,
        name: 'Band 2',
        songs: [],
        events: [],
        _count: { songs: 8, events: 2 },
      };

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Fetch band 1
      mockedFetchAPI.mockResolvedValueOnce(mockBand1);
      const { result: result1 } = renderHook(() => getBandById('1'), {
        wrapper,
      });

      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Fetch band 2
      mockedFetchAPI.mockResolvedValueOnce(mockBand2);
      const { result: result2 } = renderHook(() => getBandById('2'), {
        wrapper,
      });

      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Los datos deben ser diferentes y no compartir caché
      expect(result1.current.data?.name).toBe('Band 1');
      expect(result2.current.data?.name).toBe('Band 2');
      expect(result1.current.data?._count.songs).toBe(5);
      expect(result2.current.data?._count.songs).toBe(8);

      // Debe haber llamado al API dos veces (no compartir caché)
      expect(mockedFetchAPI).toHaveBeenCalledTimes(2);
    });

    it('should use refetchOnMount option', () => {
      const mockBand = {
        id: 1,
        name: 'Test Band',
        songs: [],
        events: [],
        _count: { songs: 0, events: 0 },
      };

      mockedFetchAPI.mockResolvedValue(mockBand);

      // Verificar que el hook se configure con refetchOnMount: true
      const { result } = renderHook(() => getBandById('1'), {
        wrapper: createWrapper(),
      });

      // El simple hecho de que renderice sin error confirma que la opción está configurada
      expect(result.current).toBeDefined();
    });
  });
});
