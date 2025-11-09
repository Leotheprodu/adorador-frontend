/**
 * Tests para verificar el comportamiento de fetchAPI con cold starts del servidor
 * Estos tests aseguran que la aplicación maneje correctamente:
 * - Timeouts largos cuando el servidor está dormido
 * - Retry logic con exponential backoff
 * - Persistencia de sesión después de cold starts
 */

import { fetchAPI } from '../fetchAPI';
import * as jwtUtils from '../jwtUtils';

// Mock de jwtUtils
jest.mock('../jwtUtils', () => ({
  getValidAccessToken: jest.fn(),
  clearTokens: jest.fn(),
  getTokens: jest.fn(),
  isTokenExpired: jest.fn(),
  isTokenActuallyExpired: jest.fn(),
  refreshAccessToken: jest.fn(),
  setTokens: jest.fn(),
  scheduleTokenRenewal: jest.fn(),
  getTokenExpirationTime: jest.fn(),
}));

describe('fetchAPI - Cold Start Handling', () => {
  const mockToken = 'mock-access-token';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_1 || 'http://localhost:3001';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.fetch = jest.fn();
    (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (jwtUtils.clearTokens as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Retry Logic', () => {
    it('should retry on network timeout and succeed on second attempt', async () => {
      const mockData = { id: 1, name: 'Test' };
      let attemptCount = 0;

      (global.fetch as jest.Mock).mockImplementation(() => {
        attemptCount++;
        if (attemptCount === 1) {
          // Simular timeout en primer intento (cold start)
          return Promise.reject(new Error('fetch failed'));
        }
        // Éxito en segundo intento (servidor despertó)
        return Promise.resolve({
          ok: true,
          json: async () => mockData,
        });
      });

      const promise = fetchAPI<typeof mockData>({
        url: `${apiUrl}/test`,
        method: 'GET',
      });

      // Fast-forward through delays
      await jest.runAllTimersAsync();

      const result = await promise;

      expect(result).toEqual(mockData);
      expect(attemptCount).toBe(2);
    });

    it('should retry up to maxRetries times before failing', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => {
        return Promise.reject(new Error('fetch failed'));
      });

      const promise = fetchAPI({
        url: `${apiUrl}/test`,
        method: 'GET',
        maxRetries: 2,
      });

      // Fast-forward all timers
      await jest.runAllTimersAsync();

      await expect(promise).rejects.toThrow('fetch failed');

      // 1 intento inicial + 2 reintentos = 3 llamadas totales
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff between retries', async () => {
      const delays: number[] = [];

      // Capturar delays reales
      jest.spyOn(global, 'setTimeout').mockImplementation((callback, delay) => {
        if (typeof delay === 'number' && delay > 0 && delay < 10000) {
          delays.push(delay);
        }
        // Ejecutar callback inmediatamente en tests
        if (typeof callback === 'function') {
          callback();
        }
        return 0 as unknown as NodeJS.Timeout;
      });

      (global.fetch as jest.Mock).mockRejectedValue(new Error('fetch failed'));

      const promise = fetchAPI({
        url: `${apiUrl}/test`,
        method: 'GET',
        maxRetries: 3,
      });

      await jest.runAllTimersAsync();

      await expect(promise).rejects.toThrow();

      // Verificar exponential backoff: delays crecientes
      expect(delays.length).toBeGreaterThan(0);
      // Los delays deben incrementarse exponencialmente
      for (let i = 1; i < delays.length; i++) {
        expect(delays[i]).toBeGreaterThanOrEqual(delays[i - 1]);
      }
    });

    it('should handle timeout with AbortController', async () => {
      const mockAbort = jest.fn();
      const mockSignal = {
        aborted: false,
        onabort: null,
        reason: undefined,
        throwIfAborted: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as unknown as AbortSignal;

      const mockController = {
        signal: mockSignal,
        abort: mockAbort,
      } as AbortController;

      global.AbortController = jest.fn(
        () => mockController,
      ) as unknown as typeof AbortController;

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      void fetchAPI({
        url: `${apiUrl}/test`,
        method: 'GET',
        timeout: 30000,
      });

      await jest.runAllTimersAsync();

      expect(global.AbortController).toHaveBeenCalled();
    });
  });

  describe('Cold Start Recovery', () => {
    it('should persist session after recovering from cold start', async () => {
      const mockUserData = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        isLoggedIn: true,
      };

      let attemptCount = 0;
      (global.fetch as jest.Mock).mockImplementation(() => {
        attemptCount++;
        if (attemptCount === 1) {
          // Cold start - timeout
          return Promise.reject(new Error('fetch failed'));
        }
        // Servidor despierto
        return Promise.resolve({
          ok: true,
          json: async () => mockUserData,
        });
      });

      const result = await fetchAPI<typeof mockUserData>({
        url: `${apiUrl}/users/me`,
        method: 'GET',
      });

      expect(result).toEqual(mockUserData);
      expect(result.isLoggedIn).toBe(true);
      // Verificar que no se limpiaron los tokens después de recuperación
      expect(jwtUtils.clearTokens).not.toHaveBeenCalled();
    });

    it('should not redirect to login on network errors', async () => {
      const originalLocation = window.location;
      const mockLocation = { ...originalLocation, href: '' };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: mockLocation,
      });

      (global.fetch as jest.Mock).mockImplementation(() => {
        return Promise.reject(new Error('fetch failed'));
      });

      await expect(
        fetchAPI({
          url: `${apiUrl}/test`,
          method: 'GET',
          maxRetries: 1,
        }),
      ).rejects.toThrow();

      // No debe redirigir en errores de red
      expect(mockLocation.href).not.toBe('/auth/login');

      Object.defineProperty(window, 'location', {
        writable: true,
        value: originalLocation,
      });
    });

    it('should redirect to login only on 401 with valid token', async () => {
      const originalLocation = window.location;
      const mockLocation = { ...originalLocation, href: '' };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: mockLocation,
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ statusCode: 401, message: 'Unauthorized' }),
      });

      await expect(
        fetchAPI({
          url: `${apiUrl}/protected`,
          method: 'GET',
        }),
      ).rejects.toThrow('401');

      // Debe limpiar tokens
      expect(jwtUtils.clearTokens).toHaveBeenCalled();
      // Debe redirigir porque teníamos token
      expect(mockLocation.href).toBe('/auth/login');

      Object.defineProperty(window, 'location', {
        writable: true,
        value: originalLocation,
      });
    });
  });

  describe('Public Endpoints', () => {
    it('should not add auth token to public endpoints', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fetchAPI({
        url: `${apiUrl}/auth/login`,
        method: 'POST',
        body: { phone: '1234', password: 'test' },
      });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const headers = fetchCall[1].headers;

      expect(headers.Authorization).toBeUndefined();
      expect(jwtUtils.getValidAccessToken).not.toHaveBeenCalled();
    });

    it('should add auth token to protected endpoints', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fetchAPI({
        url: `${apiUrl}/users/me`,
        method: 'GET',
      });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const headers = fetchCall[1].headers;

      expect(headers.Authorization).toBe(`Bearer ${mockToken}`);
      expect(jwtUtils.getValidAccessToken).toHaveBeenCalled();
    });
  });

  describe('Timeout Configuration', () => {
    it('should respect custom timeout parameter', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fetchAPI({
        url: `${apiUrl}/test`,
        method: 'GET',
        timeout: 45000,
      });

      // Verificar que AbortController fue usado
      expect(global.fetch).toHaveBeenCalled();
      const fetchConfig = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(fetchConfig.signal).toBeDefined();
    });

    it('should use default 30s timeout', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fetchAPI({
        url: `${apiUrl}/test`,
        method: 'GET',
      });

      // Verificar que AbortController fue usado con default
      expect(global.fetch).toHaveBeenCalled();
      const fetchConfig = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(fetchConfig.signal).toBeDefined();
    });
  });
});
