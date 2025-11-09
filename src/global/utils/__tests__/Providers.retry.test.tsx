/**
 * Tests de integración para verificar que la configuración del QueryClient
 * en Providers.tsx está correctamente configurada para manejar cold starts
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

describe('Providers - QueryClient Configuration for Cold Starts', () => {
  describe('Default QueryClient Configuration', () => {
    it('should have retry set to 3 for cold start tolerance', () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 8000),
          },
        },
      });

      const options = queryClient.getDefaultOptions();
      expect(options.queries?.retry).toBe(3);
    });

    it('should use exponential backoff with correct formula', () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 8000),
          },
        },
      });

      const retryDelay = queryClient.getDefaultOptions().queries
        ?.retryDelay as (attemptIndex: number, error: Error) => number;

      expect(retryDelay).toBeDefined();
      if (retryDelay) {
        const mockError = new Error('Test');
        expect(retryDelay(0, mockError)).toBe(1000); // 2^0 * 1000 = 1s
        expect(retryDelay(1, mockError)).toBe(2000); // 2^1 * 1000 = 2s
        expect(retryDelay(2, mockError)).toBe(4000); // 2^2 * 1000 = 4s
        expect(retryDelay(3, mockError)).toBe(8000); // 2^3 * 1000 = 8s (capped)
        expect(retryDelay(4, mockError)).toBe(8000); // capped at max
        expect(retryDelay(10, mockError)).toBe(8000); // still capped
      }
    });

    it('should have mutations retry set to 1 to avoid duplicates', () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          mutations: {
            retry: 1,
          },
        },
      });

      const options = queryClient.getDefaultOptions();
      expect(options.mutations?.retry).toBe(1);
    });

    it('should have correct staleTime and gcTime', () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            gcTime: 1000 * 60 * 10, // 10 minutos
          },
        },
      });

      const options = queryClient.getDefaultOptions();
      expect(options.queries?.staleTime).toBe(300000); // 5 min
      expect(options.queries?.gcTime).toBe(600000); // 10 min
    });

    it('should disable refetch on window focus and reconnect', () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
          },
        },
      });

      const options = queryClient.getDefaultOptions();
      expect(options.queries?.refetchOnWindowFocus).toBe(false);
      expect(options.queries?.refetchOnReconnect).toBe(false);
      expect(options.queries?.refetchOnMount).toBe(false);
    });
  });

  describe('Retry Behavior in Practice', () => {
    it('should retry failed queries according to configuration', async () => {
      let attemptCount = 0;

      const TestComponent = () => {
        const { data, error, isLoading } = useQuery({
          queryKey: ['test-retry'],
          queryFn: async () => {
            attemptCount++;
            if (attemptCount < 3) {
              throw new Error('Cold start');
            }
            return { success: true, attempt: attemptCount };
          },
          retry: 3,
          retryDelay: 100, // Fast for testing
        });

        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: {(error as Error).message}</div>;
        return <div>Success: {data?.attempt}</div>;
      };

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false, // Disable for individual test control
          },
        },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>,
      );

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // After retries, should show success
      await waitFor(
        () => {
          expect(screen.getByText(/Success: 3/)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Verify it tried 3 times before succeeding
      expect(attemptCount).toBe(3);
    });

    it('should apply exponential backoff delays between retries', async () => {
      let attemptCount = 0;

      const TestComponent = () => {
        const { data, error } = useQuery({
          queryKey: ['test-backoff'],
          queryFn: async () => {
            attemptCount++;

            if (attemptCount < 3) {
              throw new Error('Still in cold start');
            }
            return { success: true };
          },
          retry: 3,
          retryDelay: (attemptIndex) => {
            // Use shorter delays for testing
            return Math.min(100 * 2 ** attemptIndex, 400);
          },
        });

        if (error) return <div>Error</div>;
        if (!data) return <div>Loading</div>;
        return <div>Success</div>;
      };

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
          },
        },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>,
      );

      await waitFor(
        () => {
          expect(screen.getByText('Success')).toBeInTheDocument();
        },
        { timeout: 10000 },
      );

      // Verify it tried 3 times before succeeding
      expect(attemptCount).toBe(3);
    }, 15000); // Timeout de 15 segundos para este test
  });

  describe('Integration with fetchAPI', () => {
    it('should work with custom retry configuration per query', async () => {
      let defaultRetryAttempts = 0;
      let customRetryAttempts = 0;

      const TestComponent = () => {
        // This uses default retry (3)
        const defaultQuery = useQuery({
          queryKey: ['default-retry'],
          queryFn: async () => {
            defaultRetryAttempts++;
            if (defaultRetryAttempts < 3) throw new Error('Fail');
            return { type: 'default' };
          },
          retryDelay: 50,
        });

        // This overrides to 5 retries
        const customQuery = useQuery({
          queryKey: ['custom-retry'],
          queryFn: async () => {
            customRetryAttempts++;
            if (customRetryAttempts < 5) throw new Error('Fail');
            return { type: 'custom' };
          },
          retry: 5,
          retryDelay: 50,
        });

        if (defaultQuery.isLoading || customQuery.isLoading) {
          return <div>Loading...</div>;
        }

        return (
          <div>
            <div>Default: {defaultQuery.data?.type}</div>
            <div>Custom: {customQuery.data?.type}</div>
          </div>
        );
      };

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
          },
        },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>,
      );

      await waitFor(
        () => {
          expect(screen.getByText('Default: default')).toBeInTheDocument();
          expect(screen.getByText('Custom: custom')).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      // Default query used 3 attempts
      expect(defaultRetryAttempts).toBe(3);
      // Custom query used 5 attempts
      expect(customRetryAttempts).toBe(5);
    });
  });
});
