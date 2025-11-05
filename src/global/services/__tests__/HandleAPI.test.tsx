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
});
