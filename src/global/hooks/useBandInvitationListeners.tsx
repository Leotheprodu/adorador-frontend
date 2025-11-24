'use client';
import { useSocketConnection } from './socket/useSocketConnection';
import { useInvitationListeners } from './socket/useInvitationListeners';
import { useMemberListeners } from './socket/useMemberListeners';

export const useBandInvitationListeners = () => {
  const socket = useSocketConnection();

  useInvitationListeners(socket);
  useMemberListeners(socket);

  return socket;
};
