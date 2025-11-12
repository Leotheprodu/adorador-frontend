'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { Server1API } from '@global/config/constants';
import { getValidAccessToken } from '@global/utils/jwtUtils';
import {
  Post,
  WebSocketNewPostEvent,
  WebSocketPostUpdatedEvent,
  WebSocketPostDeletedEvent,
  WebSocketNewCommentEvent,
  WebSocketBlessingEvent,
  WebSocketSongCopiedEvent,
} from '../_interfaces/feedInterface';

interface UseFeedWebSocketProps {
  enabled?: boolean;
  onNewPost?: (post: Post) => void;
  onPostUpdated?: (post: Post) => void;
  onPostDeleted?: (postId: number) => void;
  onNewComment?: (data: WebSocketNewCommentEvent) => void;
  onBlessing?: (data: WebSocketBlessingEvent) => void;
  onSongCopied?: (data: WebSocketSongCopiedEvent) => void;
}

export const useFeedWebSocket = ({
  enabled = true,
  onNewPost,
  onPostUpdated,
  onPostDeleted,
  onNewComment,
  onBlessing,
  onSongCopied,
}: UseFeedWebSocketProps = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const isConnectingRef = useRef(false);

  const createSocket = useCallback(async (): Promise<Socket | null> => {
    try {
      // Evitar conexiones múltiples simultáneas
      if (isConnectingRef.current) {
        return null;
      }
      isConnectingRef.current = true;

      // Obtener token si está disponible
      const token = await getValidAccessToken();

      interface SocketConfig {
        forceNew: boolean;
        reconnection: boolean;
        timeout: number;
        reconnectionAttempts: number;
        reconnectionDelay: number;
        reconnectionDelayMax: number;
        maxReconnectionAttempts: number;
        randomizationFactor: number;
        auth?: { token: string };
      }

      const socketConfig: SocketConfig = {
        forceNew: true,
        reconnection: true,
        timeout: 5000,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 3000,
        maxReconnectionAttempts: 10,
        randomizationFactor: 0.5,
      };

      // Incluir auth si hay token
      if (token) {
        socketConfig.auth = { token };
      }

      // Conectar al namespace /feed
      const newSocket = io(`${Server1API}/feed`, socketConfig);

      // Eventos de conexión
      newSocket.on('connect', () => {
        console.log('[FeedWebSocket] Conectado al feed');
        // Unirse al feed global
        newSocket.emit('joinFeed');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('[FeedWebSocket] Desconectado:', reason);
        isConnectingRef.current = false;
      });

      newSocket.on('connect_error', (error) => {
        console.error('[FeedWebSocket] Error de conexión:', error);
        isConnectingRef.current = false;
      });

      // Eventos del feed
      newSocket.on('newPost', (data: WebSocketNewPostEvent) => {
        console.log('[FeedWebSocket] Nuevo post recibido:', data);

        // Invalidar el query del feed para refrescar
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });

        // Callback opcional
        if (onNewPost) {
          onNewPost(data.post);
        }
      });

      newSocket.on('postUpdated', (data: WebSocketPostUpdatedEvent) => {
        console.log('[FeedWebSocket] Post actualizado:', data);

        // Actualizar el post en cache
        queryClient.setQueryData(['post', data.post.id.toString()], data.post);

        // Invalidar feed para reflejar cambios
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });

        if (onPostUpdated) {
          onPostUpdated(data.post);
        }
      });

      newSocket.on('postDeleted', (data: WebSocketPostDeletedEvent) => {
        console.log('[FeedWebSocket] Post eliminado:', data);

        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
        queryClient.invalidateQueries({
          queryKey: ['post', data.postId.toString()],
        });

        if (onPostDeleted) {
          onPostDeleted(data.postId);
        }
      });

      newSocket.on('newComment', (data: WebSocketNewCommentEvent) => {
        console.log('[FeedWebSocket] Nuevo comentario:', data);

        // Invalidar comentarios del post
        queryClient.invalidateQueries({
          queryKey: ['comments', data.postId.toString()],
        });

        // Actualizar contador en el post si está en cache
        const postQueryKey = ['post', data.postId.toString()];
        queryClient.setQueryData(postQueryKey, (oldData: Post | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              _count: {
                ...oldData._count,
                comments: oldData._count.comments + 1,
              },
            };
          }
          return oldData;
        });

        // Invalidar feed para actualizar contador
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });

        if (onNewComment) {
          onNewComment(data);
        }
      });

      newSocket.on('newBlessing', (data: WebSocketBlessingEvent) => {
        console.log('[FeedWebSocket] Nuevo blessing:', data);

        // Actualizar contador en el post
        const postQueryKey = ['post', data.postId.toString()];
        queryClient.setQueryData(postQueryKey, (oldData: Post | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              _count: {
                ...oldData._count,
                blessings: data.count,
              },
            };
          }
          return oldData;
        });

        // Invalidar feed
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });

        if (onBlessing) {
          onBlessing(data);
        }
      });

      newSocket.on('blessingRemoved', (data: WebSocketBlessingEvent) => {
        console.log('[FeedWebSocket] Blessing removido:', data);

        // Actualizar contador en el post
        const postQueryKey = ['post', data.postId.toString()];
        queryClient.setQueryData(postQueryKey, (oldData: Post | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              _count: {
                ...oldData._count,
                blessings: data.count,
              },
            };
          }
          return oldData;
        });

        // Invalidar feed
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });

        if (onBlessing) {
          onBlessing(data);
        }
      });

      newSocket.on('songCopied', (data: WebSocketSongCopiedEvent) => {
        console.log('[FeedWebSocket] Canción copiada:', data);

        // Actualizar contador en el post
        const postQueryKey = ['post', data.postId.toString()];
        queryClient.setQueryData(postQueryKey, (oldData: Post | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              _count: {
                ...oldData._count,
                songCopies: data.count,
              },
            };
          }
          return oldData;
        });

        // Invalidar feed
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });

        if (onSongCopied) {
          onSongCopied(data);
        }
      });

      isConnectingRef.current = false;
      return newSocket;
    } catch (error) {
      console.error('[FeedWebSocket] Error creando socket:', error);
      isConnectingRef.current = false;
      return null;
    }
  }, [
    queryClient,
    onNewPost,
    onPostUpdated,
    onPostDeleted,
    onNewComment,
    onBlessing,
    onSongCopied,
  ]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Crear socket
    createSocket().then((socket) => {
      if (socket) {
        socketRef.current = socket;
      }
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        console.log('[FeedWebSocket] Limpiando conexión');
        socketRef.current.emit('leaveFeed');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [enabled, createSocket]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
  };
};
