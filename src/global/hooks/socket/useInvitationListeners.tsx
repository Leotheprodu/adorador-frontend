import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { GuitarIcon, CheckIcon, XMarkIcon } from '@global/icons';

export const useInvitationListeners = (socket: Socket | null) => {
    const user = useStore($user);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        // Listener para invitaciones recibidas
        const handleInvitationReceived = (data: {
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
        };

        // Listener para invitaciones aceptadas
        const handleInvitationAccepted = (data: {
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
                    queryKey: ['BandMembers', data.bandId.toString()],
                });
            }
        };

        // Listener para invitaciones rechazadas
        const handleInvitationRejected = (data: {
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
        };

        socket.on('BAND_INVITATION_RECEIVED', handleInvitationReceived);
        socket.on('BAND_INVITATION_ACCEPTED', handleInvitationAccepted);
        socket.on('BAND_INVITATION_REJECTED', handleInvitationRejected);

        return () => {
            socket.off('BAND_INVITATION_RECEIVED', handleInvitationReceived);
            socket.off('BAND_INVITATION_ACCEPTED', handleInvitationAccepted);
            socket.off('BAND_INVITATION_REJECTED', handleInvitationRejected);
        };
    }, [socket, user.id, queryClient]);
};
