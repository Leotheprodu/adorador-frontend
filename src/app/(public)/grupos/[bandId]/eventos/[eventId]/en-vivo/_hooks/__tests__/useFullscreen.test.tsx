import { renderHook, act, waitFor } from '@testing-library/react';
import { useFullscreen } from '../useFullscreen';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock react-hot-toast
const mockToastError = jest.fn();
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: (...args: any[]) => mockToastError(...args),
    success: jest.fn(),
  },
}));

describe('useFullscreen', () => {
  let mockElement: HTMLDivElement;
  let mockRequestFullscreen: jest.Mock;
  let mockWebkitRequestFullscreen: jest.Mock;
  let mockExitFullscreen: jest.Mock;
  let mockWebkitExitFullscreen: jest.Mock;
  let originalNavigator: Navigator;

  beforeEach(() => {
    // Limpiar mocks
    jest.clearAllMocks();

    // Guardar navigator original
    originalNavigator = global.navigator;

    // Crear elemento mock
    mockElement = document.createElement('div');
    mockRequestFullscreen = jest.fn().mockResolvedValue(undefined);
    mockWebkitRequestFullscreen = jest.fn().mockResolvedValue(undefined);
    mockExitFullscreen = jest.fn().mockResolvedValue(undefined);
    mockWebkitExitFullscreen = jest.fn().mockResolvedValue(undefined);

    // Asignar métodos al elemento
    (mockElement as any).requestFullscreen = mockRequestFullscreen;
    (mockElement as any).webkitRequestFullscreen = mockWebkitRequestFullscreen;

    // Mock document methods
    (document as any).exitFullscreen = mockExitFullscreen;
    (document as any).webkitExitFullscreen = mockWebkitExitFullscreen;

    // Mock console methods
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    // Restaurar navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  describe('Inicialización', () => {
    it('debería inicializar con valores por defecto', () => {
      const { result } = renderHook(() => useFullscreen());

      expect(result.current.isFullscreen).toBe(false);
      expect(result.current.isSupported).toBe(true);
      expect(result.current.divRef.current).toBe(null);
    });

    it('debería proporcionar funciones activateFullscreen y exitFullscreen', () => {
      const { result } = renderHook(() => useFullscreen());

      expect(typeof result.current.activateFullscreen).toBe('function');
      expect(typeof result.current.exitFullscreen).toBe('function');
    });
  });

  describe('activateFullscreen', () => {
    it('debería mostrar warning si no hay elemento referenciado', async () => {
      const { result } = renderHook(() => useFullscreen());

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(console.warn).toHaveBeenCalledWith('Elemento no disponible');
    });

    it('debería llamar requestFullscreen en navegadores modernos', async () => {
      const { result } = renderHook(() => useFullscreen());

      // Asignar el elemento al ref
      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(mockRequestFullscreen).toHaveBeenCalled();
    });

    it('debería llamar webkitRequestFullscreen si requestFullscreen no está disponible', async () => {
      const { result } = renderHook(() => useFullscreen());

      // Remover requestFullscreen
      delete (mockElement as any).requestFullscreen;

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(mockWebkitRequestFullscreen).toHaveBeenCalled();
    });

    it('debería manejar errores al activar fullscreen', async () => {
      const { result } = renderHook(() => useFullscreen());
      const error = new Error('Fullscreen denied');
      mockRequestFullscreen.mockRejectedValue(error);

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error activating fullscreen:',
        error,
      );
    });
  });

  describe('activateFullscreen en iOS', () => {
    beforeEach(() => {
      // Mock iOS navigator
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'iPhone',
          platform: 'iPhone',
          maxTouchPoints: 5,
        },
        writable: true,
        configurable: true,
      });
    });

    it('debería usar webkitRequestFullscreen con opciones en iOS', async () => {
      const { result } = renderHook(() => useFullscreen());

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(mockWebkitRequestFullscreen).toHaveBeenCalledWith({
        navigationUI: 'hide',
      });
    });

    it('debería mostrar toast si falla en iOS después de intentar todas las opciones', async () => {
      const { result } = renderHook(() => useFullscreen());
      const error = new Error('iOS fullscreen denied');

      // Hacer que todos los métodos fallen
      mockWebkitRequestFullscreen.mockRejectedValue(error);
      mockRequestFullscreen.mockRejectedValue(error);

      // Agregar requestFullscreen como fallback
      (mockElement as any).requestFullscreen = mockRequestFullscreen;

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(mockToastError).toHaveBeenCalledWith(
        'Para una mejor experiencia, rota tu dispositivo a modo horizontal.',
        {
          duration: 4000,
          position: 'bottom-center',
        },
      );
    });

    it('debería intentar método alternativo si el primero falla en iOS', async () => {
      const { result } = renderHook(() => useFullscreen());

      // Hacer que webkitRequestFullscreen falle la primera vez
      mockWebkitRequestFullscreen
        .mockRejectedValueOnce(new Error('iOS method failed'))
        .mockResolvedValueOnce(undefined);

      // Agregar también requestFullscreen como fallback
      (mockElement as any).requestFullscreen = mockRequestFullscreen;

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(console.log).toHaveBeenCalledWith(
        'Método iOS moderno falló, intentando alternativa',
      );
    });
  });

  describe('exitFullscreen', () => {
    it('debería llamar document.exitFullscreen', async () => {
      const { result } = renderHook(() => useFullscreen());

      await act(async () => {
        await result.current.exitFullscreen();
      });

      expect(mockExitFullscreen).toHaveBeenCalled();
    });

    it('debería llamar webkitExitFullscreen si exitFullscreen no está disponible', async () => {
      const { result } = renderHook(() => useFullscreen());

      // Remover exitFullscreen
      delete (document as any).exitFullscreen;

      await act(async () => {
        await result.current.exitFullscreen();
      });

      expect(mockWebkitExitFullscreen).toHaveBeenCalled();
    });

    it('debería manejar errores al salir de fullscreen', async () => {
      const { result } = renderHook(() => useFullscreen());
      const error = new Error('Exit fullscreen failed');
      mockExitFullscreen.mockRejectedValue(error);

      await act(async () => {
        await result.current.exitFullscreen();
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error exiting fullscreen:',
        error,
      );
    });
  });

  describe('Eventos de cambio de fullscreen', () => {
    it('debería actualizar isFullscreen cuando cambia el estado', async () => {
      const { result } = renderHook(() => useFullscreen());

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      // Simular entrada a fullscreen
      act(() => {
        Object.defineProperty(document, 'fullscreenElement', {
          value: mockElement,
          writable: true,
          configurable: true,
        });
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      await waitFor(() => {
        expect(result.current.isFullscreen).toBe(true);
      });

      // Simular salida de fullscreen
      act(() => {
        Object.defineProperty(document, 'fullscreenElement', {
          value: null,
          writable: true,
          configurable: true,
        });
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      await waitFor(() => {
        expect(result.current.isFullscreen).toBe(false);
      });
    });

    it('debería escuchar eventos webkit en navegadores Safari', async () => {
      const { result } = renderHook(() => useFullscreen());

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      // Simular cambio webkit
      act(() => {
        Object.defineProperty(document, 'webkitFullscreenElement', {
          value: mockElement,
          writable: true,
          configurable: true,
        });
        document.dispatchEvent(new Event('webkitfullscreenchange'));
      });

      await waitFor(() => {
        expect(result.current.isFullscreen).toBe(true);
      });
    });
  });

  describe('Detección de iOS', () => {
    it('debería detectar iPhone', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
          platform: 'iPhone',
        },
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useFullscreen());

      // Verificar que está en iOS llamando activateFullscreen sin ref
      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      act(() => {
        result.current.activateFullscreen();
      });

      // Debería llamar webkitRequestFullscreen con opciones de iOS
      expect(mockWebkitRequestFullscreen).toHaveBeenCalledWith({
        navigationUI: 'hide',
      });
    });

    it('debería detectar iPad', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
          platform: 'iPad',
        },
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useFullscreen());

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      act(() => {
        result.current.activateFullscreen();
      });

      expect(mockWebkitRequestFullscreen).toHaveBeenCalledWith({
        navigationUI: 'hide',
      });
    });

    it('debería detectar iPad Pro (MacIntel con touch)', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          platform: 'MacIntel',
          maxTouchPoints: 5,
        },
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useFullscreen());

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      act(() => {
        result.current.activateFullscreen();
      });

      expect(mockWebkitRequestFullscreen).toHaveBeenCalledWith({
        navigationUI: 'hide',
      });
    });
  });

  describe('Compatibilidad con diferentes navegadores', () => {
    it('debería funcionar en Chrome/Edge (requestFullscreen)', async () => {
      const { result } = renderHook(() => useFullscreen());

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(mockRequestFullscreen).toHaveBeenCalled();
    });

    it('debería funcionar en Safari (webkitRequestFullscreen)', async () => {
      const { result } = renderHook(() => useFullscreen());

      // Remover requestFullscreen para forzar webkit
      delete (mockElement as any).requestFullscreen;

      act(() => {
        (result.current.divRef as any).current = mockElement;
      });

      await act(async () => {
        await result.current.activateFullscreen();
      });

      expect(mockWebkitRequestFullscreen).toHaveBeenCalled();
    });
  });
});
