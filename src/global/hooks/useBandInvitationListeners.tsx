'use client';
import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { Server1API } from '@global/config/constants';
import {
  getTokens,
  setTokens,
  getTokenExpirationTime,
} from '@global/utils/jwtUtils';
import { GuitarIcon, CheckIcon, XMarkIcon } from '@global/icons';

export const useBandInvitationListeners = () => {
  const user = useStore($user);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Solo conectar si el usuario está logueado
    if (!user.isLoggedIn) {
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

    // Listener para invitaciones recibidas
    socket.on(
      'BAND_INVITATION_RECEIVED',
      (data: {
        invitationId: number;
        bandId: number;
        bandName: string;
        inviterId: number;
        inviterName: string;
        invitedUserId: number;
        expiresAt: string;
      }) => {
        // Solo mostrar notificación si la invitación es para el usuario actual
        if (data.invitedUserId === user.id) {
          toast.success(`Nueva invitación de ${data.bandName}`, {
            icon: <GuitarIcon className="h-5 w-5 text-brand-purple-600" />,
            duration: 5000,
          });

          // Invalidar query de invitaciones pendientes
          queryClient.invalidateQueries({ queryKey: ['PendingInvitations'] });
        }
      },
    );

    // Listener para invitaciones aceptadas
    socket.on(
      'BAND_INVITATION_ACCEPTED',
      (data: {
        invitationId: number;
        bandId: number;
        userId: number;
        userName: string;
        inviterId: number;
      }) => {
        // Si soy el que invitó
        if (data.inviterId === user.id) {
          toast.success(`${data.userName} aceptó la invitación!`, {
            icon: <CheckIcon className="h-5 w-5 text-green-600" />,
          });

          // Invalidar miembros de la banda
          queryClient.invalidateQueries({
            queryKey: [`BandMembers-${data.bandId}`],
          });
        }
      },
    );

    // Listener para invitaciones rechazadas
    socket.on(
      'BAND_INVITATION_REJECTED',
      (data: {
        invitationId: number;
        bandId: number;
        userId: number;
        userName: string;
        inviterId: number;
      }) => {
        // Si soy el que invitó
        if (data.inviterId === user.id) {
          toast(`${data.userName} rechazó la invitación`, {
            icon: <XMarkIcon className="h-5 w-5 text-red-600" />,
          });
        }
      },
    );

    // Listener para nuevos miembros agregados
    socket.on(
      'BAND_MEMBER_ADDED',
      (data: {
        bandId: number;
        member: {
          id: number;
          userId: number;
          bandId: number;
          role: string;
          isAdmin: boolean;
          isEventManager: boolean;
        };
      }) => {
        // Invalidar queries relacionadas con la banda
        queryClient.invalidateQueries({
          queryKey: [`BandMembers-${data.bandId}`],
        });
        queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
      },
    );

    // Listener para miembros actualizados
    socket.on(
      'BAND_MEMBER_UPDATED',
      (data: {
        bandId: number;
        userId: number;
        changes: {
          role?: string;
          isAdmin?: boolean;
          isEventManager?: boolean;
          active?: boolean;
        };
      }) => {
        // Invalidar miembros de la banda
        queryClient.invalidateQueries({
          queryKey: [`BandMembers-${data.bandId}`],
        });

        // Si soy yo el actualizado, mostrar toast
        if (data.userId === user.id) {
          toast.success('Tu rol en el grupo fue actualizado');
        }
      },
    );

    // Listener para miembros removidos
    socket.on(
      'BAND_MEMBER_REMOVED',
      (data: {
        bandId: number;
        userId: number;
        removedMember?: {
          user: { id: number; name: string };
          band: { id: number; name: string };
        };
        tokens?: {
          accessToken: string;
          refreshToken: string;
        };
      }) => {
        // Invalidar queries
        queryClient.invalidateQueries({
          queryKey: [`BandMembers-${data.bandId}`],
        });

        // Si me removieron a mí
        if (data.userId === user.id) {
          toast.error(
            `Fuiste removido del grupo ${data.removedMember?.band.name || ''}`,
            {
              duration: 5000,
            },
          );

          // Guardar los nuevos tokens sin el grupo usando setTokens de jwtUtils
          if (data.tokens) {
            setTokens({
              accessToken: data.tokens.accessToken,
              refreshToken: data.tokens.refreshToken,
              expiresAt: getTokenExpirationTime(data.tokens.accessToken),
            });
          }

          // Invalidar queries para actualizar el estado
          queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });

          // Forzar redirección si está en la página del grupo
          if (window.location.pathname.includes(`/grupos/${data.bandId}`)) {
            window.location.href = '/grupos';
          }
        }
      },
    );

    // Cleanup al desmontar
    return () => {
      socket.off('BAND_INVITATION_RECEIVED');
      socket.off('BAND_INVITATION_ACCEPTED');
      socket.off('BAND_INVITATION_REJECTED');
      socket.off('BAND_MEMBER_ADDED');
      socket.off('BAND_MEMBER_UPDATED');
      socket.off('BAND_MEMBER_REMOVED');
      socket.disconnect();
    };
  }, [user.isLoggedIn, user.id, queryClient]);

  return socketRef.current;
};
