'use client';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { Server1API } from '@global/config/constants';
import { getTokens } from '@global/utils/jwtUtils';

interface BandSongEvent {
  songId: number;
  bandId: number;
  title?: string;
  artist?: string | null;
}

interface UseAllBandSongsWebSocketProps {
  bandIds: number[];
  enabled?: boolean;
}

/**
 * Hook para escuchar eventos de WebSocket de múltiples bandas
 * Útil para la página de listado de grupos donde se muestran contadores
 */
export const useAllBandSongsWebSocket = ({
  bandIds,
  enabled = true,
}: UseAllBandSongsWebSocketProps) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || bandIds.length === 0) {
      return;
    }

    const tokens = getTokens();
    if (!tokens?.accessToken) {
      return;
    }

    // Guardar referencia a listeners para el cleanup
    const currentListeners = listenersRef.current;

    // Crear conexión WebSocket si no existe
    if (!socketRef.current?.connected) {
      const socket = io(Server1API, {
        auth: {
          token: tokens.accessToken,
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;
    }

    const socket = socketRef.current;

    // Función para manejar eventos de canciones
    const handleSongEvent = (data: BandSongEvent) => {
      console.log('[AllBandSongsWebSocket] Evento de canción:', data);

      // Invalidar la query de BandsOfUser para actualizar contadores
      queryClient.invalidateQueries({
        queryKey: ['BandsOfUser'],
      });
    };

    // Registrar listeners para cada banda
    bandIds.forEach((bandId) => {
      const createdEvent = `bandSongCreated-${bandId}`;
      const updatedEvent = `bandSongUpdated-${bandId}`;
      const deletedEvent = `bandSongDeleted-${bandId}`;

      // Solo agregar si no existe ya
      if (!listenersRef.current.has(createdEvent)) {
        socket.on(createdEvent, handleSongEvent);
        listenersRef.current.add(createdEvent);
      }

      if (!listenersRef.current.has(updatedEvent)) {
        socket.on(updatedEvent, handleSongEvent);
        listenersRef.current.add(updatedEvent);
      }

      if (!listenersRef.current.has(deletedEvent)) {
        socket.on(deletedEvent, handleSongEvent);
        listenersRef.current.add(deletedEvent);
      }
    });

    // Cleanup
    return () => {
      currentListeners.forEach((eventName) => {
        socket.off(eventName);
      });
      currentListeners.clear();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bandIds, enabled, queryClient]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
  };
};
