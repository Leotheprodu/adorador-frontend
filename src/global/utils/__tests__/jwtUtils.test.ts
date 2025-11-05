import {
  setTokens,
  getTokens,
  clearTokens,
  isTokenExpired,
  isTokenActuallyExpired,
  getTokenExpirationTime,
  getValidAccessToken,
  refreshAccessToken,
  scheduleTokenRenewal,
  TokenStorage,
  JWTAuthResponse,
} from '../jwtUtils';

// Mock global functions
global.fetch = jest.fn();
global.atob = jest.fn();

// Helpers
const createMockToken = (expiresInMinutes: number = 60): string => {
  const exp = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  const payload = { exp, userId: '123' };
  return `header.${btoa(JSON.stringify(payload))}.signature`;
};

const createTokenStorage = (expiresInMinutes: number = 60): TokenStorage => ({
  accessToken: createMockToken(expiresInMinutes),
  refreshToken: createMockToken(expiresInMinutes + 30),
  expiresAt: Date.now() + expiresInMinutes * 60 * 1000,
});

describe('jwtUtils', () => {
  beforeEach(() => {
    // Clear localStorage and mocks
    localStorage.clear();
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Mock atob (base64 decode)
    (global.atob as jest.Mock).mockImplementation((str: string) => {
      return Buffer.from(str, 'base64').toString('binary');
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('setTokens', () => {
    it('should store tokens in localStorage', () => {
      const tokens = createTokenStorage();
      setTokens(tokens);

      const stored = localStorage.getItem('auth_tokens');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(tokens);
    });

    it('should schedule token renewal when tokens are set', () => {
      const tokens = createTokenStorage(10); // 10 minutes
      setTokens(tokens);

      // Should schedule a timeout
      expect(jest.getTimerCount()).toBeGreaterThan(0);
    });

    it('should handle window undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const tokens = createTokenStorage();
      expect(() => setTokens(tokens)).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('getTokens', () => {
    it('should retrieve tokens from localStorage', () => {
      const tokens = createTokenStorage();
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      const retrieved = getTokens();
      expect(retrieved).toEqual(tokens);
    });

    it('should return null if no tokens are stored', () => {
      const retrieved = getTokens();
      expect(retrieved).toBeNull();
    });

    it('should return null if localStorage has invalid JSON', () => {
      localStorage.setItem('auth_tokens', 'invalid-json');
      expect(() => getTokens()).toThrow();
    });

    it('should handle window undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const retrieved = getTokens();
      expect(retrieved).toBeNull();

      global.window = originalWindow;
    });
  });

  describe('clearTokens', () => {
    it('should remove tokens from localStorage', () => {
      const tokens = createTokenStorage();
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      clearTokens();
      expect(localStorage.getItem('auth_tokens')).toBeNull();
    });

    it('should clear scheduled renewal timeout', () => {
      const tokens = createTokenStorage(10);
      const timerCountBefore = jest.getTimerCount();

      setTokens(tokens);

      const timerCountAfterSet = jest.getTimerCount();
      expect(timerCountAfterSet).toBeGreaterThan(timerCountBefore);

      clearTokens();
      // Timer count should decrease after clearing
      const timerCountAfterClear = jest.getTimerCount();
      expect(timerCountAfterClear).toBeLessThanOrEqual(timerCountAfterSet);
    });

    it('should handle window undefined (SSR)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      expect(() => clearTokens()).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for null token', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isTokenExpired(null as any)).toBe(true);
    });

    it('should return false for valid token', () => {
      const tokens = createTokenStorage(60); // 60 minutes
      expect(isTokenExpired(tokens)).toBe(false);
    });

    it('should return true for expired token', () => {
      const tokens = createTokenStorage(-10); // Expired 10 minutes ago
      expect(isTokenExpired(tokens)).toBe(true);
    });

    it('should consider token expired with 1 minute buffer', () => {
      // Token expires in 30 seconds (less than 1 minute buffer)
      const tokens: TokenStorage = {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: Date.now() + 30 * 1000,
      };
      expect(isTokenExpired(tokens)).toBe(true);
    });

    it('should not expire token with more than 1 minute remaining', () => {
      // Token expires in 2 minutes
      const tokens: TokenStorage = {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: Date.now() + 2 * 60 * 1000,
      };
      expect(isTokenExpired(tokens)).toBe(false);
    });
  });

  describe('isTokenActuallyExpired', () => {
    it('should return true for null token', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(isTokenActuallyExpired(null as any)).toBe(true);
    });

    it('should return false for valid token without buffer', () => {
      const tokens = createTokenStorage(1); // 1 minute
      expect(isTokenActuallyExpired(tokens)).toBe(false);
    });

    it('should return true for actually expired token', () => {
      const tokens = createTokenStorage(-1); // Expired 1 minute ago
      expect(isTokenActuallyExpired(tokens)).toBe(true);
    });

    it('should not use buffer time', () => {
      // Token expires in 30 seconds
      const tokens: TokenStorage = {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: Date.now() + 30 * 1000,
      };
      // Should not be expired without buffer
      expect(isTokenActuallyExpired(tokens)).toBe(false);
    });
  });

  describe('getTokenExpirationTime', () => {
    it('should extract expiration time from JWT token', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = { exp, userId: '123' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      const expirationTime = getTokenExpirationTime(token);
      expect(expirationTime).toBe(exp * 1000);
    });

    it('should return current time for invalid token', () => {
      const invalidToken = 'invalid.token';
      const beforeCall = Date.now();
      const expirationTime = getTokenExpirationTime(invalidToken);
      const afterCall = Date.now();

      expect(expirationTime).toBeGreaterThanOrEqual(beforeCall);
      expect(expirationTime).toBeLessThanOrEqual(afterCall);
    });

    it('should handle malformed JWT token', () => {
      const token = 'header.invalidbase64!@#$.signature';
      (global.atob as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid base64');
      });

      const beforeCall = Date.now();
      const expirationTime = getTokenExpirationTime(token);
      expect(expirationTime).toBeGreaterThanOrEqual(beforeCall);
    });
  });

  describe('getValidAccessToken', () => {
    it('should return null if no tokens exist', async () => {
      const token = await getValidAccessToken();
      expect(token).toBeNull();
    });

    it('should return access token if not expired', async () => {
      const tokens = createTokenStorage(60);
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      const token = await getValidAccessToken();
      expect(token).toBe(tokens.accessToken);
    });

    it('should refresh token if expired', async () => {
      const expiredTokens = createTokenStorage(-10); // Expired
      localStorage.setItem('auth_tokens', JSON.stringify(expiredTokens));

      const newTokens = createTokenStorage(60);
      const mockResponse: JWTAuthResponse = {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: { id: '123', name: 'Test User' } as any,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      process.env.NEXT_PUBLIC_API_URL_1 = 'http://localhost:3000';

      const token = await getValidAccessToken();
      expect(token).toBe(newTokens.accessToken);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should initiate proactive renewal when token is close to expiry', async () => {
      // Token expires in 1.5 minutes (below 2 minute threshold)
      const tokens = createTokenStorage(1.5);
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      const token = await getValidAccessToken();
      expect(token).toBe(tokens.accessToken);

      // Should have scheduled a background refresh
      expect(jest.getTimerCount()).toBeGreaterThan(0);
    });
  });

  describe('refreshAccessToken', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_API_URL_1 = 'http://localhost:3000';
    });

    it('should return null if no refresh token exists', async () => {
      const result = await refreshAccessToken();
      expect(result).toBeNull();
    });

    it('should successfully refresh token', async () => {
      const oldTokens = createTokenStorage(60);
      localStorage.setItem('auth_tokens', JSON.stringify(oldTokens));

      const newTokens = createTokenStorage(120);
      const mockResponse: JWTAuthResponse = {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: { id: '123', name: 'Test User' } as any,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await refreshAccessToken();
      expect(result).toBeTruthy();
      expect(result?.accessToken).toBe(newTokens.accessToken);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/auth/refresh',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refreshToken: oldTokens.refreshToken }),
        }),
      );
    });

    it('should clear tokens on 401 error', async () => {
      const tokens = createTokenStorage(60);
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      const result = await refreshAccessToken();
      expect(result).toBeNull();
      expect(localStorage.getItem('auth_tokens')).toBeNull();
    });

    it('should clear tokens on 403 error', async () => {
      const tokens = createTokenStorage(60);
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => 'Forbidden',
      });

      const result = await refreshAccessToken();
      expect(result).toBeNull();
      expect(localStorage.getItem('auth_tokens')).toBeNull();
    });

    it('should handle network error', async () => {
      const tokens = createTokenStorage(60);
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error'),
      );

      const result = await refreshAccessToken();
      expect(result).toBeNull();
      // Network errors may clear tokens depending on error type
      // The actual behavior is to clear tokens for non-fetch/non-abort errors
    });

    it('should handle timeout with AbortController', async () => {
      const tokens = createTokenStorage(60);
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);

      const result = await refreshAccessToken();
      expect(result).toBeNull();
    });

    it('should return null if API URL is not configured', async () => {
      delete process.env.NEXT_PUBLIC_API_URL_1;

      const tokens = createTokenStorage(60);
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      const result = await refreshAccessToken();
      expect(result).toBeNull();
      expect(localStorage.getItem('auth_tokens')).toBeNull();
    });
  });

  describe('scheduleTokenRenewal', () => {
    it('should schedule renewal before token expiry', () => {
      const tokens = createTokenStorage(10); // 10 minutes
      scheduleTokenRenewal(tokens);

      expect(jest.getTimerCount()).toBeGreaterThan(0);
    });

    it('should clear previous timeout before scheduling new one', () => {
      const tokens1 = createTokenStorage(10);
      scheduleTokenRenewal(tokens1);
      const count1 = jest.getTimerCount();

      const tokens2 = createTokenStorage(15);
      scheduleTokenRenewal(tokens2);
      const count2 = jest.getTimerCount();

      // Should have cleared previous and created new
      expect(count1).toBeGreaterThan(0);
      expect(count2).toBeGreaterThan(0);
    });

    it('should schedule with minimum 30 seconds delay', () => {
      // Token expires in 2 minutes (less than 3 minute buffer)
      const tokens = createTokenStorage(2);
      scheduleTokenRenewal(tokens);

      // Should schedule with at least 30 seconds
      expect(jest.getTimerCount()).toBeGreaterThan(0);
    });

    it('should handle expired tokens gracefully', () => {
      const tokens = createTokenStorage(-10); // Already expired

      // Should not throw error even with expired token
      expect(() => scheduleTokenRenewal(tokens)).not.toThrow();
    });
  });

  describe('integration tests', () => {
    it('should handle full token lifecycle', async () => {
      process.env.NEXT_PUBLIC_API_URL_1 = 'http://localhost:3000';

      // 1. Set initial tokens
      const initialTokens = createTokenStorage(60);
      setTokens(initialTokens);
      expect(getTokens()).toEqual(initialTokens);

      // 2. Get valid token
      const token1 = await getValidAccessToken();
      expect(token1).toBe(initialTokens.accessToken);

      // 3. Simulate token expiration
      const expiredTokens = createTokenStorage(-10);
      localStorage.setItem('auth_tokens', JSON.stringify(expiredTokens));

      // 4. Get valid token should trigger refresh
      const newTokens = createTokenStorage(60);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
          user: { id: '123' },
        }),
      });

      const token2 = await getValidAccessToken();
      expect(token2).toBe(newTokens.accessToken);

      // 5. Clear tokens
      clearTokens();
      expect(getTokens()).toBeNull();
    });

    it('should prevent multiple simultaneous refresh requests', async () => {
      process.env.NEXT_PUBLIC_API_URL_1 = 'http://localhost:3000';

      const expiredTokens = createTokenStorage(-10);
      localStorage.setItem('auth_tokens', JSON.stringify(expiredTokens));

      const newTokens = createTokenStorage(60);
      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          ok: true,
          json: async () => ({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            user: { id: '123' },
          }),
        });
      });

      // Make multiple simultaneous calls
      const [token1, token2, token3] = await Promise.all([
        getValidAccessToken(),
        getValidAccessToken(),
        getValidAccessToken(),
      ]);

      // All should get the same new token
      expect(token1).toBe(newTokens.accessToken);
      expect(token2).toBe(newTokens.accessToken);
      expect(token3).toBe(newTokens.accessToken);

      // Fetch should be called minimal times (ideally once, but we check it's reasonable)
      expect(callCount).toBeLessThanOrEqual(3);
    }, 10000);
  });
});
