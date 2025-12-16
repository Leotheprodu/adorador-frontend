'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Server1API } from '@global/config/constants';
import { $eventSocket } from '@stores/event';
import { getValidAccessToken } from '@global/utils/jwtUtils';

/**
 * Hook simplificado para conectar el WebSocket en EventAdminPage
 * Solo maneja la conexión básica sin listeners de eventos en vivo
 */
export const useEventAdminWebSocket = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeSocket = async () => {
      const socket = socketRef.current;

      // Si ya existe un socket, no crear uno nuevo
      if (socket?.connected) {
        return;
      }

      try {
        const token = await getValidAccessToken();

        const socketConfig: any = {
          forceNew: true,
          reconnection: true,
          timeout: 5000,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 3000,
        };

        if (token) {
          socketConfig.auth = { token };
        }

        const newSocket = io(Server1API, socketConfig);

        newSocket.on('connect', () => {
          console.log('[WebSocket Admin] Conectado en modo observador');
          if (mounted) {
            $eventSocket.set(newSocket);
            // NO hacer joinEvent - solo observar
          }
        });

        newSocket.on('disconnect', () => {
          console.log('[WebSocket Admin] Desconectado');
        });

        newSocket.on('error', (error) => {
          console.error('[WebSocket Admin] Error:', error);
        });

        if (mounted) {
          socketRef.current = newSocket;
        }
      } catch (error) {
        console.error('[WebSocket Admin] Error inicializando:', error);
      }
    };

    initializeSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        // No hacer leaveEvent porque nunca hicimos joinEvent
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [params.eventId, params.bandId]);

  return {};
};
