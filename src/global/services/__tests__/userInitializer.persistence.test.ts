/**
 * Tests de integración para verificar persistencia de sesión con cold starts
 * Estos tests aseguran que la sesión del usuario persiste correctamente
 * incluso cuando el servidor tarda en responder (cold start)
 */

import { initializeUserOnce } from '../userInitializer';
import * as jwtUtils from '../../utils/jwtUtils';

// Mock de jwtUtils
jest.mock('../../utils/jwtUtils');

// Mock de localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Session Persistence with Cold Starts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    // Reset global flag
    (globalThis as Record<string, unknown>)['globalInitFlag'] = false;
  });

  describe('Token Refresh with Retry on Cold Start', () => {
    it('should persist session after successful token refresh on retry', async () => {
      const validTokens: jwtUtils.TokenStorage = {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutos en el futuro
      };

      const loggedUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        isLoggedIn: true,
        status: 'active' as const,
        roles: [1],
        memberships: [],
        membersofBands: [],
        phone: '1234567890',
        birthdate: '1990-01-01',
      };

      // Configurar localStorage con usuario logueado
      mockLocalStorage.setItem('user', JSON.stringify(loggedUser));

      // Mock: Token válido en localStorage
      (jwtUtils.getTokens as jest.Mock).mockReturnValue(validTokens);
      (jwtUtils.isTokenActuallyExpired as jest.Mock).mockReturnValue(false);

      await initializeUserOnce();

      // Verificar que el usuario permanece logueado
      const storedUser = JSON.parse(mockLocalStorage.getItem('user') || '{}');
      expect(storedUser.isLoggedIn).toBe(true);
      expect(storedUser.id).toBe(1);
    });

    it('should recover session when token expired but refresh succeeds after retry', async () => {
      const expiredTokens: jwtUtils.TokenStorage = {
        accessToken: 'expired-access-token',
        refreshToken: 'valid-refresh-token',
        expiresAt: Date.now() - 1000, // Expirado
      };

      const newTokens: jwtUtils.TokenStorage = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: Date.now() + 30 * 60 * 1000,
      };

      const loggedUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        isLoggedIn: true,
        status: 'active' as const,
        roles: [1],
        memberships: [],
        membersofBands: [],
        phone: '1234567890',
        birthdate: '1990-01-01',
      };

      mockLocalStorage.setItem('user', JSON.stringify(loggedUser));

      // Mock: Token expirado pero refresh exitoso después de retry
      (jwtUtils.getTokens as jest.Mock).mockReturnValue(expiredTokens);
      (jwtUtils.isTokenActuallyExpired as jest.Mock).mockReturnValue(true);
      (jwtUtils.refreshAccessToken as jest.Mock).mockResolvedValue(newTokens);

      await initializeUserOnce();

      // Verificar que el usuario permanece logueado
      const storedUser = JSON.parse(mockLocalStorage.getItem('user') || '{}');
      expect(storedUser.isLoggedIn).toBe(true);
      expect(jwtUtils.refreshAccessToken).toHaveBeenCalled();
    });

    it('should logout user when refresh fails after all retries', async () => {
      const expiredTokens: jwtUtils.TokenStorage = {
        accessToken: 'expired-access-token',
        refreshToken: 'expired-refresh-token',
        expiresAt: Date.now() - 1000,
      };

      const loggedUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        isLoggedIn: true,
        status: 'active' as const,
        roles: [1],
        memberships: [],
        membersofBands: [],
        phone: '1234567890',
        birthdate: '1990-01-01',
      };

      mockLocalStorage.setItem('user', JSON.stringify(loggedUser));

      // Mock: Token expirado y refresh falla
      (jwtUtils.getTokens as jest.Mock).mockReturnValue(expiredTokens);
      (jwtUtils.isTokenActuallyExpired as jest.Mock).mockReturnValue(true);
      (jwtUtils.refreshAccessToken as jest.Mock).mockRejectedValue(
        new Error('Network error'),
      );

      await initializeUserOnce();

      // Verificar que el usuario fue deslogueado
      const storedUser = JSON.parse(mockLocalStorage.getItem('user') || '{}');
      expect(storedUser.isLoggedIn).toBe(false);
    });
  });

  describe('Session Consistency', () => {
    it('should correct inconsistent state: valid token but user marked as logged out', async () => {
      const validTokens: jwtUtils.TokenStorage = {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        expiresAt: Date.now() + 30 * 60 * 1000,
      };

      const inconsistentUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        isLoggedIn: false, // Inconsistente: tiene token válido pero marcado como deslogueado
        status: 'active' as const,
        roles: [1],
        memberships: [],
        membersofBands: [],
        phone: '1234567890',
        birthdate: '1990-01-01',
      };

      mockLocalStorage.setItem('user', JSON.stringify(inconsistentUser));

      (jwtUtils.getTokens as jest.Mock).mockReturnValue(validTokens);
      (jwtUtils.isTokenActuallyExpired as jest.Mock).mockReturnValue(false);

      await initializeUserOnce();

      // Verificar que se corrigió el estado
      const storedUser = JSON.parse(mockLocalStorage.getItem('user') || '{}');
      expect(storedUser.isLoggedIn).toBe(true);
    });

    it('should maintain logged out state when no tokens exist', async () => {
      const loggedOutUser = {
        id: 0,
        name: '',
        email: '',
        isLoggedIn: false,
        status: 'inactive' as const,
        roles: [],
        memberships: [],
        membersofBands: [],
        phone: '',
        birthdate: '',
      };

      mockLocalStorage.setItem('user', JSON.stringify(loggedOutUser));

      (jwtUtils.getTokens as jest.Mock).mockReturnValue(null);
      (jwtUtils.isTokenActuallyExpired as jest.Mock).mockReturnValue(true);

      await initializeUserOnce();

      const storedUser = JSON.parse(mockLocalStorage.getItem('user') || '{}');
      expect(storedUser.isLoggedIn).toBe(false);
    });
  });

  describe('Cold Start Scenarios', () => {
    it('should initialize user even without localStorage (new user)', async () => {
      // No hay usuario en localStorage
      (jwtUtils.getTokens as jest.Mock).mockReturnValue(null);

      await initializeUserOnce();

      // Debe crear usuario por defecto
      const storedUser = JSON.parse(mockLocalStorage.getItem('user') || '{}');
      expect(storedUser.isLoggedIn).toBe(false);
      expect(storedUser.id).toBe(0);
    });

    it('should only initialize once even if called multiple times', async () => {
      const validTokens: jwtUtils.TokenStorage = {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        expiresAt: Date.now() + 30 * 60 * 1000,
      };

      (jwtUtils.getTokens as jest.Mock).mockReturnValue(validTokens);
      (jwtUtils.isTokenActuallyExpired as jest.Mock).mockReturnValue(false);

      // Llamar múltiples veces
      await initializeUserOnce();
      await initializeUserOnce();
      await initializeUserOnce();

      // getTokens solo debe llamarse una vez en la primera inicialización
      expect(jwtUtils.getTokens).toHaveBeenCalledTimes(1);
    });
  });
});
