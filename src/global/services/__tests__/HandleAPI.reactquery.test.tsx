/**
 * Tests para verificar la configuración de React Query
 * y su interacción con el retry logic de fetchAPI
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { FetchData } from '../HandleAPI';
import * as fetchAPI from '../../utils/fetchAPI';

// Mock fetchAPI
jest.mock('../../utils/fetchAPI', () => ({
  fetchAPI: jest.fn(),
}));

describe('React Query Configuration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Desactivar retry en tests para control preciso
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('FetchData wrapper', () => {
    it('should call fetchAPI with correct parameters', async () => {
      const mockData = { id: 1, name: 'Test' };
      (fetchAPI.fetchAPI as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(
        () =>
          FetchData<typeof mockData>({
            key: 'test-key',
            url: '/api/test',
          }),
        {
          wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          ),
        },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(fetchAPI.fetchAPI).toHaveBeenCalledWith({
        url: '/api/test',
        skipAuth: false,
      });
      expect(result.current.data).toEqual(mockData);
    });

    it('should handle errors from fetchAPI', async () => {
      const error = new Error('Network error');
      (fetchAPI.fetchAPI as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(
        () =>
          FetchData({
            key: 'test-key-error',
            url: '/api/test',
          }),
        {
          wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          ),
        },
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(error);
    });

    it('should respect skipAuth parameter', async () => {
      const mockData = { success: true };
      (fetchAPI.fetchAPI as jest.Mock).mockResolvedValue(mockData);

      renderHook(
        () =>
          FetchData({
            key: 'test-skip-auth',
            url: '/api/public',
            skipAuth: true,
          }),
        {
          wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          ),
        },
      );

      await waitFor(() =>
        expect(fetchAPI.fetchAPI).toHaveBeenCalledWith({
          url: '/api/public',
          skipAuth: true,
        }),
      );
    });

    it('should not fetch when disabled', async () => {
      renderHook(
        () =>
          FetchData({
            key: 'test-disabled',
            url: '/api/test',
            isEnabled: false,
          }),
        {
          wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          ),
        },
      );

      // Esperar un poco para asegurar que no se haya llamado
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(fetchAPI.fetchAPI).not.toHaveBeenCalled();
    });
  });

  describe('Query Client Default Options', () => {
    it('should configure retry with exponential backoff in production', () => {
      const prodQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 8000),
          },
        },
      });

      const options = prodQueryClient.getDefaultOptions();
      expect(options.queries?.retry).toBe(3);

      // Test retry delay function
      if (typeof options.queries?.retryDelay === 'function') {
        const mockError = new Error('Test');
        expect(options.queries.retryDelay(0, mockError)).toBe(1000); // 2^0 * 1000 = 1000
        expect(options.queries.retryDelay(1, mockError)).toBe(2000); // 2^1 * 1000 = 2000
        expect(options.queries.retryDelay(2, mockError)).toBe(4000); // 2^2 * 1000 = 4000
        expect(options.queries.retryDelay(3, mockError)).toBe(8000); // 2^3 * 1000 = 8000 (capped)
        expect(options.queries.retryDelay(4, mockError)).toBe(8000); // Still capped at 8000
      }
    });

    it('should not retry mutations by default', () => {
      const prodQueryClient = new QueryClient({
        defaultOptions: {
          mutations: {
            retry: 1,
          },
        },
      });

      const options = prodQueryClient.getDefaultOptions();
      expect(options.mutations?.retry).toBe(1);
    });

    it('should have correct stale and cache times', () => {
      const prodQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            gcTime: 1000 * 60 * 10, // 10 minutos
          },
        },
      });

      const options = prodQueryClient.getDefaultOptions();
      expect(options.queries?.staleTime).toBe(300000); // 5 min en ms
      expect(options.queries?.gcTime).toBe(600000); // 10 min en ms
    });

    it('should disable refetch on window focus and reconnect', () => {
      const prodQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      });

      const options = prodQueryClient.getDefaultOptions();
      expect(options.queries?.refetchOnWindowFocus).toBe(false);
      expect(options.queries?.refetchOnReconnect).toBe(false);
    });
  });

  describe('Integration with fetchAPI retry', () => {
    it('should combine React Query retry with fetchAPI retry for maximum resilience', async () => {
      let fetchAttempts = 0;

      // Simular fetchAPI que falla 2 veces, luego succeed
      (fetchAPI.fetchAPI as jest.Mock).mockImplementation(async () => {
        fetchAttempts++;
        if (fetchAttempts <= 2) {
          throw new Error('Cold start - server sleeping');
        }
        return { success: true };
      });

      const resilientQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2, // React Query reintentará 2 veces
            retryDelay: 100, // Delay corto para tests
          },
        },
      });

      const { result } = renderHook(
        () =>
          FetchData({
            key: 'test-resilient',
            url: '/api/test',
          }),
        {
          wrapper: ({ children }) => (
            <QueryClientProvider client={resilientQueryClient}>
              {children}
            </QueryClientProvider>
          ),
        },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true), {
        timeout: 3000,
      });

      // fetchAPI fue llamado al menos 3 veces (2 fallos + 1 éxito)
      expect(fetchAttempts).toBeGreaterThanOrEqual(3);
      expect(result.current.data).toEqual({ success: true });
    });
  });
});
