import { renderHook, waitFor } from '@testing-library/react';
import { useEventTimeLeft } from '../useEventTimeLeft';

// Mock de formatTimeLeft
jest.mock('@global/utils/dataFormat', () => ({
  formatTimeLeft: jest.fn((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }),
}));

describe('useEventTimeLeft', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Casos de eventos futuros', () => {
    it('debe mostrar tiempo restante para un evento futuro (más de 1 minuto)', () => {
      // Evento en 2 horas
      const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      expect(result.current.eventTimeLeft).toContain('h');
      expect(result.current.eventTimeLeft).toContain('m');
      expect(result.current.timeLeft).toBeGreaterThan(0);
    });

    it('debe mostrar mensaje especial para eventos que comienzan en menos de 1 minuto', () => {
      // Evento en 30 segundos
      const futureDate = new Date(Date.now() + 30 * 1000);

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      expect(result.current.eventTimeLeft).toBe(
        'El evento comenzará en menos de un minuto',
      );
    });

    it('debe actualizar el tiempo restante cada segundo', async () => {
      // Evento en 5 segundos
      const futureDate = new Date(Date.now() + 5000);

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      const initialTimeLeft = result.current.timeLeft;

      // Avanzar 1 segundo
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(result.current.timeLeft).toBeLessThan(initialTimeLeft);
      });
    });

    it('debe calcular correctamente días, horas y minutos para eventos lejanos', () => {
      // Evento en 3 días, 5 horas y 30 minutos
      const futureDate = new Date(
        Date.now() +
          3 * 24 * 60 * 60 * 1000 +
          5 * 60 * 60 * 1000 +
          30 * 60 * 1000,
      );

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      expect(result.current.eventTimeLeft).toContain('3d');
      expect(result.current.eventTimeLeft).toContain('5h');
      expect(result.current.timeLeft).toBeGreaterThan(0);
    });
  });

  describe('Casos de eventos que ya comenzaron', () => {
    it('debe mostrar "El evento ha comenzado" para eventos de hoy que ya pasaron su hora', () => {
      // Mockear la fecha actual para que sea 15:00 (3 PM) de hoy
      const mockNow = new Date();
      mockNow.setHours(15, 0, 0, 0);
      jest.setSystemTime(mockNow);

      // Crear evento de hoy a las 14:00 (1 hora atrás)
      const pastEventToday = new Date(
        mockNow.getFullYear(),
        mockNow.getMonth(),
        mockNow.getDate(),
        14,
        0,
        0,
        0,
      );

      const { result } = renderHook(() => useEventTimeLeft(pastEventToday));

      expect(result.current.eventTimeLeft).toBe('El evento ha comenzado');
      expect(result.current.timeLeft).toBeLessThanOrEqual(0);

      // Restaurar el tiempo real
      jest.useRealTimers();
      jest.useFakeTimers();
    });

    it('debe mostrar "El evento ya ha pasado" para eventos de días anteriores', () => {
      // Evento de ayer
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const { result } = renderHook(() => useEventTimeLeft(yesterday));

      expect(result.current.eventTimeLeft).toBe('El evento ya ha pasado');
      expect(result.current.timeLeft).toBeLessThanOrEqual(0);
    });

    it('debe mostrar "El evento ya ha pasado" para eventos de hace varios días', () => {
      // Evento hace 5 días
      const oldDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

      const { result } = renderHook(() => useEventTimeLeft(oldDate));

      expect(result.current.eventTimeLeft).toBe('El evento ya ha pasado');
    });
  });

  describe('Casos especiales y edge cases', () => {
    it('debe retornar strings vacíos cuando no se proporciona fecha', () => {
      const { result } = renderHook(() => useEventTimeLeft(undefined));

      expect(result.current.eventTimeLeft).toBe('');
      expect(result.current.timeLeft).toBe(0);
    });

    it('debe manejar fechas en formato string', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      expect(result.current.eventTimeLeft).toBeTruthy();
      expect(result.current.timeLeft).toBeGreaterThan(0);
    });

    it('debe actualizar cuando cambia la fecha del evento', async () => {
      const date1 = new Date(Date.now() + 2 * 60 * 60 * 1000);

      const { result, rerender } = renderHook(
        ({ date }) => useEventTimeLeft(date),
        {
          initialProps: { date: date1 },
        },
      );

      const firstTimeLeft = result.current.timeLeft;

      // Cambiar a una fecha diferente
      const date2 = new Date(Date.now() + 5 * 60 * 60 * 1000);
      rerender({ date: date2 });

      await waitFor(() => {
        expect(result.current.timeLeft).not.toBe(firstTimeLeft);
        expect(result.current.timeLeft).toBeGreaterThan(firstTimeLeft);
      });
    });

    it('debe limpiar el intervalo cuando el componente se desmonta', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      const { unmount } = renderHook(() => useEventTimeLeft(futureDate));

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });
  });

  describe('Transición de estados en tiempo real', () => {
    it('debe cambiar de "menos de un minuto" a "ha comenzado" cuando pasa el tiempo', async () => {
      // Mock de Date.now para controlar el tiempo
      const now = Date.now();
      jest.spyOn(Date, 'now').mockImplementation(() => now);

      // Evento en 30 segundos
      const eventDate = new Date(now + 30000);

      const { result } = renderHook(() => useEventTimeLeft(eventDate));

      // Debe mostrar "menos de un minuto"
      expect(result.current.eventTimeLeft).toBe(
        'El evento comenzará en menos de un minuto',
      );

      // Avanzar 31 segundos (el evento ya comenzó)
      jest.spyOn(Date, 'now').mockImplementation(() => now + 31000);
      jest.advanceTimersByTime(31000);

      await waitFor(() => {
        expect(result.current.eventTimeLeft).toBe('El evento ha comenzado');
      });
    });

    it('debe transicionar correctamente cuando el contador llega a 0', async () => {
      const now = Date.now();

      // Evento hoy en 2 segundos
      const eventDate = new Date(now + 2000);

      jest.spyOn(Date, 'now').mockImplementation(() => now);

      const { result } = renderHook(() => useEventTimeLeft(eventDate));

      const initialMessage = result.current.eventTimeLeft;
      expect(initialMessage).toBe('El evento comenzará en menos de un minuto');

      // Avanzar 3 segundos
      jest.spyOn(Date, 'now').mockImplementation(() => now + 3000);
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(result.current.eventTimeLeft).not.toBe(initialMessage);
        expect(result.current.eventTimeLeft).toBe('El evento ha comenzado');
      });
    });
  });

  describe('Precisión del contador', () => {
    it('debe decrementar el timeLeft aproximadamente 1000ms cada segundo', async () => {
      const futureDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      const initialTimeLeft = result.current.timeLeft;

      // Avanzar 1 segundo
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        const difference = initialTimeLeft - result.current.timeLeft;
        // La diferencia debe ser cercana a 1000ms (con margen de error)
        expect(difference).toBeGreaterThanOrEqual(900);
        expect(difference).toBeLessThanOrEqual(1100);
      });
    });

    it('debe mantener la precisión después de múltiples actualizaciones', async () => {
      const futureDate = new Date(Date.now() + 60 * 1000); // 60 segundos

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      const initialTimeLeft = result.current.timeLeft;

      // Avanzar 5 segundos, uno por uno
      for (let i = 0; i < 5; i++) {
        jest.advanceTimersByTime(1000);
        await waitFor(() => {
          expect(result.current.timeLeft).toBeGreaterThan(0);
        });
      }

      // Verificar que el tiempo restante es menor que el inicial
      expect(result.current.timeLeft).toBeLessThanOrEqual(initialTimeLeft);
      expect(result.current.timeLeft).toBeGreaterThan(50000);
    });
  });

  describe('Retorno de valores', () => {
    it('debe retornar tanto eventTimeLeft como timeLeft', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      expect(result.current).toHaveProperty('eventTimeLeft');
      expect(result.current).toHaveProperty('timeLeft');
      expect(typeof result.current.eventTimeLeft).toBe('string');
      expect(typeof result.current.timeLeft).toBe('number');
    });

    it('eventTimeLeft debe ser un string legible', () => {
      const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      expect(result.current.eventTimeLeft).toBeTruthy();
      expect(result.current.eventTimeLeft.length).toBeGreaterThan(0);
    });

    it('timeLeft debe ser un número en milisegundos', () => {
      const hoursInMs = 2 * 60 * 60 * 1000;
      const futureDate = new Date(Date.now() + hoursInMs);

      const { result } = renderHook(() => useEventTimeLeft(futureDate));

      expect(typeof result.current.timeLeft).toBe('number');
      // Debe ser aproximadamente 2 horas en milisegundos
      expect(result.current.timeLeft).toBeGreaterThan(hoursInMs - 2000);
      expect(result.current.timeLeft).toBeLessThanOrEqual(hoursInMs);
    });
  });
});
