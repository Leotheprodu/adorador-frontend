import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FetchData } from '../HandleAPI';
import { fetchAPI } from '@/global/utils/fetchAPI';

// Mock del módulo fetchAPI
jest.mock('@/global/utils/fetchAPI');

const mockedFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

// Wrapper para React Query
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

describe('HandleAPI - FetchData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedFetchAPI.mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () =>
        FetchData<typeof mockData>({
          key: 'test-key',
          url: '/api/test',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(mockedFetchAPI).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/test',
        skipAuth: false,
      }),
    );
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Failed to fetch');
    mockedFetchAPI.mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () =>
        FetchData({
          key: 'test-key-error',
          url: '/api/test',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 },
    );

    expect(result.current.error).toBeDefined();
  });

  it('should respect isEnabled flag', () => {
    const { result } = renderHook(
      () =>
        FetchData({
          key: 'test-key-disabled',
          url: '/api/test',
          isEnabled: false,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isFetching).toBe(false);
    expect(mockedFetchAPI).not.toHaveBeenCalled();
  });

  it('should pass skipAuth correctly', async () => {
    const mockData = { id: 1 };
    mockedFetchAPI.mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () =>
        FetchData({
          key: 'test-key-skipauth',
          url: '/api/public',
          skipAuth: true,
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedFetchAPI).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/public',
        skipAuth: true,
      }),
    );
  });

  it('should accept array as query key for unique cache per resource', async () => {
    const mockData = { id: 1, name: 'Band 1' };
    mockedFetchAPI.mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () =>
        FetchData({
          key: ['BandById', '123'],
          url: '/api/bands/123',
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it('should cache independently when using different IDs in query key', async () => {
    const mockDataBand1 = { id: 1, name: 'Band 1' };
    const mockDataBand2 = { id: 2, name: 'Band 2' };

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Fetch para banda 1
    mockedFetchAPI.mockResolvedValueOnce(mockDataBand1);
    const { result: result1 } = renderHook(
      () =>
        FetchData({
          key: ['BandById', '1'],
          url: '/api/bands/1',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));
    expect(result1.current.data).toEqual(mockDataBand1);

    // Fetch para banda 2
    mockedFetchAPI.mockResolvedValueOnce(mockDataBand2);
    const { result: result2 } = renderHook(
      () =>
        FetchData({
          key: ['BandById', '2'],
          url: '/api/bands/2',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result2.current.isSuccess).toBe(true));
    expect(result2.current.data).toEqual(mockDataBand2);

    // Verificar que ambos tienen datos diferentes (no comparten caché)
    expect(result1.current.data).not.toEqual(result2.current.data);
    expect(mockedFetchAPI).toHaveBeenCalledTimes(2);
  });

  it('should use same cache when query key is identical', async () => {
    const mockData = { id: 1, name: 'Band 1' };

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Primera llamada
    mockedFetchAPI.mockResolvedValueOnce(mockData);
    const { result: result1 } = renderHook(
      () =>
        FetchData({
          key: ['BandById', '1'],
          url: '/api/bands/1',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    // Segunda llamada con la misma key - debería usar caché
    const { result: result2 } = renderHook(
      () =>
        FetchData({
          key: ['BandById', '1'],
          url: '/api/bands/1',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result2.current.isSuccess).toBe(true));

    // Solo debe haber hecho 1 llamada al API (la segunda usa caché)
    expect(mockedFetchAPI).toHaveBeenCalledTimes(1);
    expect(result1.current.data).toEqual(result2.current.data);
  });
});
