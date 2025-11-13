'use client';
import { FetchData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import type {
  NotificationListResponse,
  UnreadCountResponse,
} from '@global/services/notifications.service';

export const useNotifications = (cursor?: number, unreadOnly = false) => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor.toString());
  params.append('limit', '20');
  params.append('unreadOnly', unreadOnly.toString());

  return FetchData<NotificationListResponse>({
    key: [
      'Notifications',
      cursor?.toString() ?? 'initial',
      unreadOnly.toString(),
    ],
    url: `${Server1API}/notifications?${params.toString()}`,
    isEnabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useUnreadCount = () => {
  return FetchData<UnreadCountResponse>({
    key: 'UnreadNotificationsCount',
    url: `${Server1API}/notifications/unread-count`,
    isEnabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
