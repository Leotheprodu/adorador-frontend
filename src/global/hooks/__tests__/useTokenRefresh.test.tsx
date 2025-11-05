import { renderHook, waitFor, act } from '@testing-library/react';
import { useTokenRefresh } from '../useTokenRefresh';
import * as jwtUtils from '@global/utils/jwtUtils';
import * as localStorage from '@global/utils/handleLocalStorage';
import { $user } from '@global/stores/users';

// Mock the dependencies
jest.mock('@global/utils/jwtUtils');
jest.mock('@global/utils/handleLocalStorage');
jest.mock('@global/stores/users', () => ({
  $user: {
    set: jest.fn(),
  },
}));

const mockGetTokens = jwtUtils.getTokens as jest.MockedFunction<
  typeof jwtUtils.getTokens
>;
const mockIsTokenExpired = jwtUtils.isTokenExpired as jest.MockedFunction<
  typeof jwtUtils.isTokenExpired
>;
const mockRefreshAccessToken =
  jwtUtils.refreshAccessToken as jest.MockedFunction<
    typeof jwtUtils.refreshAccessToken
  >;
const mockClearTokens = jwtUtils.clearTokens as jest.MockedFunction<
  typeof jwtUtils.clearTokens
>;
const mockSetLocalStorage = localStorage.setLocalStorage as jest.MockedFunction<
  typeof localStorage.setLocalStorage
>;

describe('useTokenRefresh Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('checkAndRefreshToken', () => {
    it('should return false when no tokens are stored', async () => {
      mockGetTokens.mockReturnValue(null);

      const { result } = renderHook(() => useTokenRefresh());

      let checkResult: boolean = false;
      await act(async () => {
        checkResult = await result.current.checkAndRefreshToken();
      });

      expect(checkResult).toBe(false);
      expect(console.log).toHaveBeenCalledWith(
        '[TokenRefresh] No hay tokens guardados',
      );
    });

    it('should return true when token is valid and not expired', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000, // 1 hour from now
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      const { result } = renderHook(() => useTokenRefresh());

      let checkResult: boolean = false;
      await act(async () => {
        checkResult = await result.current.checkAndRefreshToken();
      });

      expect(checkResult).toBe(true);
      expect(console.log).toHaveBeenCalledWith(
        '[TokenRefresh] Token válido, no necesita renovación',
      );
    });

    it('should refresh token when expired and return true on success', async () => {
      const expiredTokens = {
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() - 1000, // Expired
      };

      const newTokens = {
        accessToken: 'new-token',
        refreshToken: 'new-refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(expiredTokens);
      mockIsTokenExpired.mockReturnValue(true);
      mockRefreshAccessToken.mockResolvedValue(newTokens);

      const { result } = renderHook(() => useTokenRefresh());

      let checkResult: boolean = false;
      await act(async () => {
        checkResult = await result.current.checkAndRefreshToken();
      });

      expect(checkResult).toBe(true);
      expect(mockRefreshAccessToken).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        '[TokenRefresh] Token renovado exitosamente',
      );
    });

    it('should clear tokens and reset user when refresh fails', async () => {
      const expiredTokens = {
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() - 1000,
      };

      mockGetTokens.mockReturnValue(expiredTokens);
      mockIsTokenExpired.mockReturnValue(true);
      mockRefreshAccessToken.mockResolvedValue(null);

      const { result } = renderHook(() => useTokenRefresh());

      let checkResult: boolean = false;
      await act(async () => {
        checkResult = await result.current.checkAndRefreshToken();
      });

      expect(checkResult).toBe(false);
      expect(mockClearTokens).toHaveBeenCalled();
      expect($user.set).toHaveBeenCalledWith({
        id: 0,
        name: '',
        isLoggedIn: false,
        email: '',
        status: 'inactive',
        roles: [],
        memberships: [],
        membersofBands: [],
        phone: '',
        birthdate: '',
      });
      expect(mockSetLocalStorage).toHaveBeenCalledWith(
        'user',
        expect.any(Object),
      );
    });

    it('should handle errors gracefully', async () => {
      mockGetTokens.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useTokenRefresh());

      let checkResult: boolean = false;
      await act(async () => {
        checkResult = await result.current.checkAndRefreshToken();
      });

      expect(checkResult).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error in token refresh:',
        expect.any(Error),
      );
    });

    it('should debounce rapid consecutive calls', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      const { result } = renderHook(() => useTokenRefresh());

      // First call
      await act(async () => {
        await result.current.checkAndRefreshToken();
      });

      expect(mockGetTokens).toHaveBeenCalledTimes(1);

      // Second call immediately (should be debounced)
      await act(async () => {
        await result.current.checkAndRefreshToken();
      });

      // Should not call getTokens again due to debounce
      expect(mockGetTokens).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        '[TokenRefresh] Verificación reciente, saltando...',
      );
    });

    it('should allow check after debounce period', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      const { result } = renderHook(() => useTokenRefresh());

      // First call
      await act(async () => {
        await result.current.checkAndRefreshToken();
      });

      expect(mockGetTokens).toHaveBeenCalledTimes(1);

      // Advance time by more than debounce period (10 seconds)
      act(() => {
        jest.advanceTimersByTime(11000);
      });

      // Second call after debounce period
      await act(async () => {
        await result.current.checkAndRefreshToken();
      });

      // Should call getTokens again
      expect(mockGetTokens).toHaveBeenCalledTimes(2);
    });
  });

  describe('useEffect behavior', () => {
    it('should initialize check after initial delay', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      renderHook(() => useTokenRefresh());

      // Should not call immediately
      expect(mockGetTokens).not.toHaveBeenCalled();

      // Advance initial delay (2000ms) + internal delay (1000ms)
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalled();
      });
    });

    it('should check token periodically', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      renderHook(() => useTokenRefresh());

      // Advance initial delay
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalledTimes(1);
      });

      // Clear mocks and advance to next interval (2 minutes)
      jest.clearAllMocks();
      act(() => {
        jest.advanceTimersByTime(2 * 60 * 1000);
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalled();
      });
    });

    it('should check token on window focus', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      renderHook(() => useTokenRefresh());

      // Advance initial delay
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalledTimes(1);
      });

      // Advance time to allow debounce
      act(() => {
        jest.advanceTimersByTime(11000);
      });

      jest.clearAllMocks();

      // Simulate window focus event
      act(() => {
        window.dispatchEvent(new Event('focus'));
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalled();
      });
    });

    it('should check token on visibility change', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      renderHook(() => useTokenRefresh());

      // Advance initial delay
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalledTimes(1);
      });

      // Advance time to allow debounce
      act(() => {
        jest.advanceTimersByTime(11000);
      });

      jest.clearAllMocks();

      // Simulate visibility change to visible
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        configurable: true,
        value: 'visible',
      });

      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalled();
      });
    });

    it('should not check on visibility change when hidden', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      renderHook(() => useTokenRefresh());

      // Advance initial delay
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalledTimes(1);
      });

      jest.clearAllMocks();

      // Set visibility to hidden
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        configurable: true,
        value: 'hidden',
      });

      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      // Should not call getTokens when hidden
      expect(mockGetTokens).not.toHaveBeenCalled();
    });

    it('should cleanup event listeners on unmount', async () => {
      const removeEventListenerSpy = jest.spyOn(
        document,
        'removeEventListener',
      );
      const windowRemoveEventListenerSpy = jest.spyOn(
        window,
        'removeEventListener',
      );

      const { unmount } = renderHook(() => useTokenRefresh());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function),
      );
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
        'focus',
        expect.any(Function),
      );
    });

    it('should only initialize once', async () => {
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: Date.now() + 3600000,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      const { rerender } = renderHook(() => useTokenRefresh());

      // Advance initial delay
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(mockGetTokens).toHaveBeenCalledTimes(1);
      });

      // Rerender the hook
      rerender();

      // Should not initialize again
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Still only called once from initial mount
      expect(mockGetTokens).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle SSR environment gracefully', async () => {
      const originalWindow = global.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).window;

      const { result } = renderHook(() => useTokenRefresh());

      // Should still provide the function
      expect(result.current.checkAndRefreshToken).toBeDefined();

      global.window = originalWindow;
    });

    it('should log token expiration time', async () => {
      const futureTime = Date.now() + 3600000;
      const validTokens = {
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        expiresAt: futureTime,
      };

      mockGetTokens.mockReturnValue(validTokens);
      mockIsTokenExpired.mockReturnValue(false);

      const { result } = renderHook(() => useTokenRefresh());

      await act(async () => {
        await result.current.checkAndRefreshToken();
      });

      expect(console.log).toHaveBeenCalledWith(
        '[TokenRefresh] Token expira en:',
        new Date(futureTime).toLocaleString(),
      );
    });
  });
});
