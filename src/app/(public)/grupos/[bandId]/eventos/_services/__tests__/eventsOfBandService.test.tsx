import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getEventsOfBand } from '../eventsOfBandService';
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

describe('eventsOfBandService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEventsOfBand', () => {
    it('should use query key with bandId to prevent cache collision', async () => {
      const mockEvents = [
        { id: 1, title: 'Event 1', date: '2024-01-01', bandId: 123 },
        { id: 2, title: 'Event 2', date: '2024-01-02', bandId: 123 },
      ];

      mockedFetchAPI.mockResolvedValueOnce(mockEvents);

      const { result } = renderHook(() => getEventsOfBand({ bandId: '123' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockEvents);
      expect(mockedFetchAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('/bands/123/events'),
        }),
      );
    });

    it('should maintain separate cache for different bandIds', async () => {
      const mockEventsBand1 = [
        { id: 1, title: 'Band 1 Event', date: '2024-01-01', bandId: 1 },
      ];

      const mockEventsBand2 = [
        { id: 2, title: 'Band 2 Event', date: '2024-01-02', bandId: 2 },
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

      // Fetch events for band 1
      mockedFetchAPI.mockResolvedValueOnce(mockEventsBand1);
      const { result: result1 } = renderHook(
        () => getEventsOfBand({ bandId: '1' }),
        { wrapper },
      );

      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Fetch events for band 2
      mockedFetchAPI.mockResolvedValueOnce(mockEventsBand2);
      const { result: result2 } = renderHook(
        () => getEventsOfBand({ bandId: '2' }),
        { wrapper },
      );

      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Los eventos deben ser diferentes para cada banda
      expect(result1.current.data?.[0]?.title).toBe('Band 1 Event');
      expect(result2.current.data?.[0]?.title).toBe('Band 2 Event');

      // Debe haber llamado al API dos veces (no compartir caché)
      expect(mockedFetchAPI).toHaveBeenCalledTimes(2);
    });

    it('should not return events from wrong band due to cache', async () => {
      const mockEventsBand1 = [
        {
          id: 1,
          title: 'Should NOT appear in Band 2',
          date: '2024-01-01',
          bandId: 1,
        },
      ];

      const mockEventsBand2 = [
        { id: 2, title: 'Band 2 Correct Event', date: '2024-01-02', bandId: 2 },
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

      // Primero obtener eventos de banda 1
      mockedFetchAPI.mockResolvedValueOnce(mockEventsBand1);
      const { result: result1 } = renderHook(
        () => getEventsOfBand({ bandId: '1' }),
        { wrapper },
      );
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Luego obtener eventos de banda 2
      mockedFetchAPI.mockResolvedValueOnce(mockEventsBand2);
      const { result: result2 } = renderHook(
        () => getEventsOfBand({ bandId: '2' }),
        { wrapper },
      );
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Verificar que banda 2 NO tiene eventos de banda 1
      expect(result2.current.data).toEqual(mockEventsBand2);
      expect(result2.current.data).not.toEqual(mockEventsBand1);
      expect(result2.current.data?.[0]?.title).not.toContain(
        'Should NOT appear',
      );
    });
  });
});
