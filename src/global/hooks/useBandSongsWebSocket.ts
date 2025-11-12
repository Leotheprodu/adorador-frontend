'use client';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { Server1API } from '@global/config/constants';
import { getTokens } from '@global/utils/jwtUtils';

interface BandSongCreatedEvent {
  songId: number;
  bandId: number;
  title: string;
  artist: string | null;
}

interface BandSongUpdatedEvent {
  songId: number;
  bandId: number;
  title: string;
  artist: string | null;
  changeType: 'lyrics' | 'info' | 'all';
}

interface BandSongDeletedEvent {
  songId: number;
  bandId: number;
}

interface UseBandSongsWebSocketProps {
  bandId?: number;
  enabled?: boolean;
}

export const useBandSongsWebSocket = ({
  bandId,
  enabled = true,
}: UseBandSongsWebSocketProps = {}) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !bandId) {
      return;
    }

    const tokens = getTokens();
    if (!tokens?.accessToken) {
      return;
    }

    // Crear conexión WebSocket
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

    // Listener para canciones creadas
    socket.on(`bandSongCreated-${bandId}`, (data: BandSongCreatedEvent) => {
      console.log(`[BandSongsWebSocket] Nueva canción creada:`, data);

      // Invalidar queries de canciones de esta banda
      queryClient.invalidateQueries({
        queryKey: ['songsFromBand', bandId],
      });
      queryClient.invalidateQueries({
        queryKey: ['songsForFeed', bandId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ['BandById', bandId.toString()],
      });
    });

    // Listener para canciones actualizadas
    socket.on(`bandSongUpdated-${bandId}`, (data: BandSongUpdatedEvent) => {
      console.log(`[BandSongsWebSocket] Canción actualizada:`, data);

      // Invalidar queries de canciones de esta banda
      queryClient.invalidateQueries({
        queryKey: ['songsFromBand', bandId],
      });
      queryClient.invalidateQueries({
        queryKey: ['songsForFeed', bandId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ['BandById', bandId.toString()],
      });

      // Si hay una query específica de la canción, invalidarla también
      queryClient.invalidateQueries({
        queryKey: ['song', bandId, data.songId],
      });
    });

    // Listener para canciones eliminadas
    socket.on(`bandSongDeleted-${bandId}`, (data: BandSongDeletedEvent) => {
      console.log(`[BandSongsWebSocket] Canción eliminada:`, data);

      // Invalidar queries de canciones de esta banda
      queryClient.invalidateQueries({
        queryKey: ['songsFromBand', bandId],
      });
      queryClient.invalidateQueries({
        queryKey: ['songsForFeed', bandId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ['BandById', bandId.toString()],
      });

      // Remover de cache la canción específica
      queryClient.removeQueries({
        queryKey: ['song', bandId, data.songId],
      });
    });

    // Cleanup
    return () => {
      socket.off(`bandSongCreated-${bandId}`);
      socket.off(`bandSongUpdated-${bandId}`);
      socket.off(`bandSongDeleted-${bandId}`);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bandId, enabled, queryClient]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
  };
};
