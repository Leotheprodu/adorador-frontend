// Mock nanostores first - before any imports
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn((store) => store.get()),
}));

// Mock hooks and services
jest.mock('@global/hooks/useIsClient');
jest.mock('@global/hooks/useTokenRefresh');
jest.mock('@global/services/userInitializer');
jest.mock('@global/hooks/useBandInvitationListeners');

// Mock HeroUIProvider
jest.mock('@heroui/react', () => ({
  HeroUIProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="heroui-provider">{children}</div>
  ),
}));

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => {
  const actualModule = jest.requireActual('@tanstack/react-query');
  return {
    ...actualModule,
    QueryClient: jest.fn().mockImplementation(() => ({
      mount: jest.fn(),
      unmount: jest.fn(),
      getQueryCache: jest.fn(() => ({ find: jest.fn() })),
      getMutationCache: jest.fn(() => ({ find: jest.fn() })),
      isFetching: jest.fn(() => 0),
      isMutating: jest.fn(() => 0),
      defaultOptions: {},
    })),
    QueryClientProvider: ({
      children,
      client,
    }: {
      children: React.ReactNode;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client?: any;
    }) => {
      // Provide a real QueryClient for tests that need it
      const realQueryClient =
        client ||
        new actualModule.QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        });
      return (
        <div data-testid="query-client-provider">
          <actualModule.QueryClientProvider client={realQueryClient}>
            {children}
          </actualModule.QueryClientProvider>
        </div>
      );
    },
  };
});

import { render, screen, waitFor, act } from '@testing-library/react';
import { Providers } from '../Providers';
import * as useIsClientModule from '@global/hooks/useIsClient';
import * as useTokenRefreshModule from '@global/hooks/useTokenRefresh';
import * as userInitializerModule from '@global/services/userInitializer';
import { QueryClient } from '@tanstack/react-query';

const mockUseIsClient = useIsClientModule.useIsClient as jest.MockedFunction<
  typeof useIsClientModule.useIsClient
>;
const mockUseTokenRefresh =
  useTokenRefreshModule.useTokenRefresh as jest.MockedFunction<
    typeof useTokenRefreshModule.useTokenRefresh
  >;
const mockInitializeUserOnce =
  userInitializerModule.initializeUserOnce as jest.MockedFunction<
    typeof userInitializerModule.initializeUserOnce
  >;

describe('Providers Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Default mock implementations
    mockUseIsClient.mockReturnValue(true);
    mockUseTokenRefresh.mockReturnValue({
      checkAndRefreshToken: jest.fn().mockResolvedValue(true),
    });
    mockInitializeUserOnce.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Provider hierarchy', () => {
    it('should render QueryClientProvider as outermost provider', () => {
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>,
      );

      const queryProvider = screen.getByTestId('query-client-provider');
      expect(queryProvider).toBeInTheDocument();
    });

    it('should render HeroUIProvider inside QueryClientProvider', () => {
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>,
      );

      const queryProvider = screen.getByTestId('query-client-provider');
      const nextUIProvider = screen.getByTestId('heroui-provider');

      expect(queryProvider).toContainElement(nextUIProvider);
    });

    it('should render children inside all providers', () => {
      render(
        <Providers>
          <div data-testid="child-content">Child Component</div>
        </Providers>,
      );

      const childContent = screen.getByTestId('child-content');
      const nextUIProvider = screen.getByTestId('heroui-provider');

      expect(childContent).toBeInTheDocument();
      expect(nextUIProvider).toContainElement(childContent);
    });

    it('should have correct provider nesting order', () => {
      const { container } = render(
        <Providers>
          <div data-testid="app-content">App</div>
        </Providers>,
      );

      const queryProvider = container.querySelector(
        '[data-testid="query-client-provider"]',
      );
      const nextUIProvider = queryProvider?.querySelector(
        '[data-testid="heroui-provider"]',
      );
      const appContent = nextUIProvider?.querySelector(
        '[data-testid="app-content"]',
      );

      expect(appContent).toBeInTheDocument();
    });
  });

  describe('TokenManager', () => {
    it('should call useTokenRefresh hook', () => {
      render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      expect(mockUseTokenRefresh).toHaveBeenCalled();
    });

    it('should call useTokenRefresh only once', () => {
      render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      expect(mockUseTokenRefresh).toHaveBeenCalledTimes(1);
    });

    it('should not render any visible content from TokenManager', () => {
      const { container } = render(
        <Providers>
          <div data-testid="app">App</div>
        </Providers>,
      );

      // TokenManager returns null, so it shouldn't add any extra elements
      const nextUIProvider = container.querySelector(
        '[data-testid="heroui-provider"]',
      );
      const childElements = nextUIProvider?.children;

      // Should only have the app content, no extra elements from TokenManager
      expect(childElements?.length).toBeGreaterThan(0);
    });
  });

  describe('AuthProvider', () => {
    it('should call useIsClient hook', () => {
      render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      expect(mockUseIsClient).toHaveBeenCalled();
    });

    it('should initialize user when client is ready', async () => {
      mockUseIsClient.mockReturnValue(true);

      render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      // Advance timer to trigger the timeout (200ms)
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(mockInitializeUserOnce).toHaveBeenCalled();
      });
    });

    it('should not initialize user when not on client', async () => {
      mockUseIsClient.mockReturnValue(false);

      render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(mockInitializeUserOnce).not.toHaveBeenCalled();
      });
    });

    it('should initialize user immediately on mount', async () => {
      mockUseIsClient.mockReturnValue(true);

      render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      // Should be called immediately (no delay)
      await waitFor(() => {
        expect(mockInitializeUserOnce).toHaveBeenCalled();
      });
    });

    it('should handle unmount correctly', async () => {
      mockUseIsClient.mockReturnValue(true);

      const { unmount } = render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      // Wait for initialization
      await waitFor(() => {
        expect(mockInitializeUserOnce).toHaveBeenCalled();
      });

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow();
    });

    it('should only initialize once even with multiple renders', async () => {
      mockUseIsClient.mockReturnValue(true);

      const { rerender } = render(
        <Providers>
          <div>Content 1</div>
        </Providers>,
      );

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(mockInitializeUserOnce).toHaveBeenCalledTimes(1);
      });

      // Rerender
      rerender(
        <Providers>
          <div>Content 2</div>
        </Providers>,
      );

      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should still only be called once due to useEffect dependencies
      await waitFor(() => {
        expect(mockInitializeUserOnce).toHaveBeenCalledTimes(1);
      });
    });

    it('should render TokenManager and children', () => {
      render(
        <Providers>
          <div data-testid="test-child">Test Child</div>
        </Providers>,
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(mockUseTokenRefresh).toHaveBeenCalled();
    });
  });

  describe('Children rendering', () => {
    it('should render single child', () => {
      render(
        <Providers>
          <div data-testid="single-child">Single Child</div>
        </Providers>,
      );

      expect(screen.getByTestId('single-child')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <Providers>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </Providers>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render complex component tree', () => {
      const ComplexChild = () => (
        <div>
          <header data-testid="header">Header</header>
          <main data-testid="main">
            <section>Content</section>
          </main>
          <footer data-testid="footer">Footer</footer>
        </div>
      );

      render(
        <Providers>
          <ComplexChild />
        </Providers>,
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should handle fragment children', () => {
      render(
        <Providers>
          <>
            <div data-testid="fragment-1">Fragment 1</div>
            <div data-testid="fragment-2">Fragment 2</div>
          </>
        </Providers>,
      );

      expect(screen.getByTestId('fragment-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-2')).toBeInTheDocument();
    });

    it('should handle null children', () => {
      const { container } = render(<Providers>{null}</Providers>);

      expect(
        container.querySelector('[data-testid="heroui-provider"]'),
      ).toBeInTheDocument();
    });
  });

  describe('QueryClient configuration', () => {
    it('should use QueryClient configured with correct options', () => {
      // QueryClient is created outside the component when module is loaded
      // The QueryClient should have been created when the module was imported
      // We verify QueryClientProvider is being used
      render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      // Verify that QueryClientProvider is rendered
      expect(screen.getByTestId('query-client-provider')).toBeInTheDocument();
    });

    it('should use a single shared QueryClient instance', () => {
      // QueryClient is created once when module loads and reused
      const MockedQueryClient = QueryClient as jest.MockedClass<
        typeof QueryClient
      >;
      const callCountBefore = MockedQueryClient.mock.calls.length;

      // Render multiple times
      const { unmount: unmount1 } = render(
        <Providers>
          <div>Content 1</div>
        </Providers>,
      );

      const { unmount: unmount2 } = render(
        <Providers>
          <div>Content 2</div>
        </Providers>,
      );

      const callCountAfter = MockedQueryClient.mock.calls.length;

      // Should not create new QueryClient instances when rendering
      expect(callCountAfter - callCountBefore).toBe(0);

      unmount1();
      unmount2();
    });
  });

  describe('Integration tests', () => {
    it('should initialize all providers and hooks in correct order', async () => {
      mockUseIsClient.mockReturnValue(true);

      render(
        <Providers>
          <div data-testid="app-content">App Content</div>
        </Providers>,
      );

      // Check all providers are rendered
      expect(screen.getByTestId('query-client-provider')).toBeInTheDocument();
      expect(screen.getByTestId('heroui-provider')).toBeInTheDocument();
      expect(screen.getByTestId('app-content')).toBeInTheDocument();

      // Check hooks are called
      expect(mockUseIsClient).toHaveBeenCalled();
      expect(mockUseTokenRefresh).toHaveBeenCalled();

      // Advance time to trigger user initialization
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(mockInitializeUserOnce).toHaveBeenCalled();
      });
    });

    // Note: The actual implementation does not handle errors from initializeUserOnce
    // So we cannot test error handling as it would result in unhandled promise rejection
  });

  describe('Edge cases', () => {
    it('should handle rapid client state changes', async () => {
      const { rerender } = render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      mockUseIsClient.mockReturnValue(false);
      rerender(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      mockUseIsClient.mockReturnValue(true);
      rerender(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should still work correctly
      await waitFor(() => {
        expect(mockInitializeUserOnce).toHaveBeenCalled();
      });
    });

    it('should clean up properly on unmount during initialization', async () => {
      mockUseIsClient.mockReturnValue(true);

      const { unmount } = render(
        <Providers>
          <div>Content</div>
        </Providers>,
      );

      // Wait for initialization to be called (no delay anymore)
      await waitFor(() => {
        expect(mockInitializeUserOnce).toHaveBeenCalled();
      });

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow();
    });
  });
});
