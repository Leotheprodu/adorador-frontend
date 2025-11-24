import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Server1API } from '@global/config/constants';
import { getTokens } from '@global/utils/jwtUtils';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';

export const useSocketConnection = () => {
    const user = useStore($user);
    const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

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
        const newSocket = io(Server1API, {
            auth: {
                token: tokens.accessToken,
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Cleanup al desmontar
        return () => {
            newSocket.disconnect();
            socketRef.current = null;
            setSocket(null);
        };
    }, [user.isLoggedIn]);

    return socket;
};
