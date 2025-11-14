'use client';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { usePendingInvitations } from '@app/(public)/grupos/_hooks/usePendingInvitations';
import { useUnreadCount } from '@global/hooks/useNotifications';

export const useNotificationBell = () => {
  const user = useStore($user);
  const { data: invitations, isLoading: loadingInvitations } =
    usePendingInvitations();
  const { data: unreadCount } = useUnreadCount();
  const [isOpen, setIsOpen] = useState(false);

  const invitationsCount = invitations?.length || 0;
  const notificationsCount = unreadCount?.count || 0;
  const totalCount = invitationsCount + notificationsCount;

  return {
    user,
    invitations,
    loadingInvitations,
    unreadCount,
    invitationsCount,
    notificationsCount,
    totalCount,
    isOpen,
    setIsOpen,
  };
};
