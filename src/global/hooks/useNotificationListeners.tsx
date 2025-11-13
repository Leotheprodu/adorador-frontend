'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { Server1API } from '@global/config/constants';
import { getTokens } from '@global/utils/jwtUtils';
import { BellIcon } from '@global/icons';
import { Notification } from '@global/services/notifications.service';
import { useRouter } from 'next/navigation';

export const useNotificationListeners = () => {
  const user = useStore($user);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user.isLoggedIn) {
      return;
    }

    const tokens = getTokens();
    if (!tokens?.accessToken) {
      return;
    }

    // Crear conexión WebSocket al namespace de notificaciones
    const socket = io(`${Server1API}/notifications`, {
      auth: {
        token: tokens.accessToken,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Listener para conexión exitosa
    socket.on('notifications_connection_ready', (data) => {
      console.log('Conectado a notificaciones:', data);
    });

    // Listener para nuevas notificaciones
    socket.on('NEW_NOTIFICATION', (notification: Notification) => {
      console.log('Nueva notificación recibida:', notification);

      // Mostrar toast según el tipo de notificación
      const handleClick = () => {
        if (notification.metadata?.postId) {
          router.push(`/feed?postId=${notification.metadata.postId}`);
        }
      };

      const toastElement = (
        <div
          onClick={handleClick}
          className={
            notification.metadata?.postId ? 'cursor-pointer' : 'cursor-default'
          }
        >
          {notification.message}
        </div>
      );

      toast.success(toastElement, {
        icon: <BellIcon className="h-5 w-5 text-brand-purple-600" />,
        duration: 5000,
      });

      // Invalidar queries de notificaciones
      queryClient.invalidateQueries({ queryKey: ['Notifications'] });
      queryClient.invalidateQueries({ queryKey: ['UnreadNotificationsCount'] });
    });

    // Listener para actualización de contador
    socket.on('UNREAD_COUNT_UPDATE', ({ count }: { count: number }) => {
      console.log('Contador de notificaciones actualizado:', count);
      queryClient.setQueryData(['UnreadNotificationsCount'], count);
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user.isLoggedIn, user.id, queryClient, router]);
};
