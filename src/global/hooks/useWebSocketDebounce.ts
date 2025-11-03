// Hook simplificado para debouncing de mensajes WebSocket
import { useRef, useCallback, useEffect } from 'react';

interface DebounceOptions {
  delay: number;
  maxWait?: number;
}

type SendFunction<T> = (data: T) => void | Promise<void>;

export const useWebSocketDebounce = <T = unknown>(
  sendFunction: SendFunction<T>,
  options: DebounceOptions,
) => {
  const { delay, maxWait = delay * 3 } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);
  const pendingDataRef = useRef<T | null>(null);

  const debouncedSend = useCallback(
    (data: T) => {
      const now = Date.now();

      // Guardar los datos más recientes
      pendingDataRef.current = data;

      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Si ha pasado el maxWait, enviar inmediatamente
      if (lastCallRef.current && now - lastCallRef.current >= maxWait) {
        lastCallRef.current = now;
        const result = sendFunction(data);
        if (result instanceof Promise) {
          result.catch((error) =>
            console.warn('[Debounce] Send error:', error),
          );
        }
        return;
      }

      // Configurar nuevo timeout
      timeoutRef.current = setTimeout(() => {
        if (pendingDataRef.current !== null) {
          lastCallRef.current = Date.now();
          const result = sendFunction(pendingDataRef.current);
          if (result instanceof Promise) {
            result.catch((error) =>
              console.warn('[Debounce] Send error:', error),
            );
          }
          pendingDataRef.current = null;
        }
      }, delay);
    },
    [sendFunction, delay, maxWait],
  );

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (pendingDataRef.current !== null) {
      const result = sendFunction(pendingDataRef.current);
      if (result instanceof Promise) {
        result.catch((error) => console.warn('[Debounce] Flush error:', error));
      }
      pendingDataRef.current = null;
      lastCallRef.current = Date.now();
    }
  }, [sendFunction]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingDataRef.current = null;
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { debouncedSend, flush, cancel };
};

// Hook especializado para mensajes de letras con lógica inteligente
export const useLyricMessageDebounce = (
  sendFunction: (data: unknown) => void | Promise<void>,
) => {
  // Para cambios de letras, usar debounce moderado
  const { debouncedSend, flush, cancel } = useWebSocketDebounce(sendFunction, {
    delay: 200, // 200ms de debounce
    maxWait: 500, // Máximo 500ms de espera
  });

  const sendLyricMessage = useCallback(
    (data: unknown) => {
      debouncedSend(data);
    },
    [debouncedSend],
  );

  return { sendLyricMessage, flush, cancel };
};

// Hook especializado para selección de canciones
export const useSongSelectionDebounce = (
  sendFunction: (data: unknown) => void | Promise<void>,
) => {
  // Selección de canciones puede tener más debounce
  const { debouncedSend, flush, cancel } = useWebSocketDebounce(sendFunction, {
    delay: 300, // 300ms de debounce
    maxWait: 800, // Máximo 800ms
  });

  const sendSongSelection = useCallback(
    (songId: number) => {
      debouncedSend(songId);
    },
    [debouncedSend],
  );

  return { sendSongSelection, flush, cancel };
};
