import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { setTokens, getTokenExpirationTime } from '@global/utils/jwtUtils';

export const useMemberListeners = (socket: Socket | null) => {
    const user = useStore($user);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        // Listener para nuevos miembros agregados
        const handleMemberAdded = (data: {
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
                queryKey: ['BandMembers', data.bandId.toString()],
            });
            queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
        };

        // Listener para miembros actualizados
        const handleMemberUpdated = (data: {
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
                queryKey: ['BandMembers', data.bandId.toString()],
            });

            // Si soy yo el actualizado, mostrar toast SOLO si NO es cambio de isEventManager
            if (data.userId === user.id) {
                const isOnlyEventManagerChange =
                    data.changes.isEventManager !== undefined &&
                    data.changes.role === undefined &&
                    data.changes.isAdmin === undefined &&
                    data.changes.active === undefined;

                if (!isOnlyEventManagerChange) {
                    toast.success('Tu rol en el grupo fue actualizado');
                }
            }
        };

        // Listener para miembros removidos
        const handleMemberRemoved = (data: {
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
                queryKey: ['BandMembers', data.bandId.toString()],
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
        };

        socket.on('BAND_MEMBER_ADDED', handleMemberAdded);
        socket.on('BAND_MEMBER_UPDATED', handleMemberUpdated);
        socket.on('BAND_MEMBER_REMOVED', handleMemberRemoved);

        return () => {
            socket.off('BAND_MEMBER_ADDED', handleMemberAdded);
            socket.off('BAND_MEMBER_UPDATED', handleMemberUpdated);
            socket.off('BAND_MEMBER_REMOVED', handleMemberRemoved);
        };
    }, [socket, user.id, queryClient]);
};
