'use client';
import { useState } from 'react';
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { MarkAllAsReadResponse } from '@global/services/notifications.service';

export const useMarkNotificationAsRead = (notificationId: number) => {
  const [isMarking, setIsMarking] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: markAsReadMutation } = PostData<void, undefined>({
    key: `MarkNotificationAsRead-${notificationId}`,
    url: `${Server1API}/notifications/${notificationId}/read`,
    method: 'PATCH',
  });

  const markAsRead = async () => {
    setIsMarking(true);

    try {
      await markAsReadMutation(undefined);

      queryClient.invalidateQueries({ queryKey: ['Notifications'] });
      queryClient.invalidateQueries({ queryKey: ['UnreadNotificationsCount'] });

      setIsMarking(false);
    } catch (error) {
      setIsMarking(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al marcar notificación como leída';
      toast.error(errorMessage);
    }
  };

  return {
    markAsRead,
    isMarking,
  };
};

export const useMarkAllNotificationsAsRead = () => {
  const [isMarking, setIsMarking] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: markAllAsReadMutation } = PostData<
    MarkAllAsReadResponse,
    undefined
  >({
    key: 'MarkAllNotificationsAsRead',
    url: `${Server1API}/notifications/read-all`,
    method: 'PATCH',
  });

  const markAllAsRead = async () => {
    setIsMarking(true);

    try {
      const response = await markAllAsReadMutation(undefined);

      queryClient.invalidateQueries({ queryKey: ['Notifications'] });
      queryClient.invalidateQueries({ queryKey: ['UnreadNotificationsCount'] });

      toast.success(`${response.count} notificaciones marcadas como leídas`);

      setIsMarking(false);
    } catch (error) {
      setIsMarking(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al marcar todas las notificaciones como leídas';
      toast.error(errorMessage);
    }
  };

  return {
    markAllAsRead,
    isMarking,
  };
};

export const useDeleteNotification = (notificationId: number) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteNotificationMutation } = PostData<void, undefined>(
    {
      key: `DeleteNotification-${notificationId}`,
      url: `${Server1API}/notifications/${notificationId}`,
      method: 'DELETE',
    },
  );

  const deleteNotification = async () => {
    setIsDeleting(true);

    try {
      await deleteNotificationMutation(undefined);

      queryClient.invalidateQueries({ queryKey: ['Notifications'] });
      queryClient.invalidateQueries({ queryKey: ['UnreadNotificationsCount'] });

      toast.success('Notificación eliminada');

      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al eliminar notificación';
      toast.error(errorMessage);
    }
  };

  return {
    deleteNotification,
    isDeleting,
  };
};
