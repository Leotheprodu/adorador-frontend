'use client';

import { useStore } from '@nanostores/react';
import { $eventSocket } from '@stores/event';
import { useState, useEffect } from 'react';

interface ConnectedUser {
  id: number;
  name: string;
  isAuthenticated: boolean;
}

interface ConnectedUsersData {
  eventId: number;
  users: ConnectedUser[];
  guestCount: number;
  totalCount: number;
  maxConnections?: number; // Límite de conexiones según el plan
  planName?: string; // Nombre del plan de suscripción
}

export const EventConnectedUsers = ({
  params,
  observerMode = false, // Si es true, solo observa sin unirse al evento
}: {
  params: { bandId: string; eventId: string };
  observerMode?: boolean;
}) => {
  const socket = useStore($eventSocket);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUsersData>({
    eventId: parseInt(params.eventId),
    users: [],
    guestCount: 0,
    totalCount: 0,
  });

  useEffect(() => {
    if (!socket) {
      return;
    }

    const eventId = parseInt(params.eventId);
    const bandId = parseInt(params.bandId);

    // Solo unirse al evento si NO está en modo observador
    if (!observerMode) {
      socket.emit('joinEvent', { eventId, bandId });
    }

    // Solicitar la lista inicial de usuarios conectados
    socket.emit('getConnectedUsers', { eventId });

    // Escuchar actualizaciones de usuarios conectados
    const handleUsersUpdate = (data: ConnectedUsersData) => {
      if (data.eventId === eventId) {
        setConnectedUsers(data);
      }
    };

    socket.on('eventUsersUpdate', handleUsersUpdate);

    // Si está en modo observador, hacer polling cada 15 segundos
    let pollingInterval: NodeJS.Timeout | null = null;
    if (observerMode) {
      pollingInterval = setInterval(() => {
        socket.emit('getConnectedUsers', { eventId });
      }, 15000); // Refresh cada 15 segundos
    }

    return () => {
      // Solo salir del evento si NO está en modo observador
      if (!observerMode) {
        socket.emit('leaveEvent', {});
      }
      socket.off('eventUsersUpdate', handleUsersUpdate);

      // Limpiar intervalo de polling
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [socket, params.eventId, observerMode]);

  // Si no hay usuarios conectados pero el socket está activo
  if (connectedUsers.totalCount === 0 && socket) {
    // En modo observador, mostrar mensaje diferente
    if (observerMode) {
      return (
        <div className="my-3 w-full">
          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 dark:bg-slate-800">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Nadie conectado al evento
            </span>
          </div>
        </div>
      );
    }

    // En modo normal (en-vivo), mostrar conectando
    return (
      <div className="my-3 w-full">
        <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue-100 to-brand-purple-100 px-4 py-2 shadow-sm backdrop-blur-sm">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-gradient-to-r from-brand-blue-500 to-brand-purple-500"></div>
          <span className="text-sm font-medium text-brand-blue-700">
            Conectándose al evento...
          </span>
        </div>
      </div>
    );
  }

  // Si no hay conexión WebSocket, no mostrar nada
  if (!socket) {
    return null;
  }

  const formatUserList = () => {
    const userNames = connectedUsers.users.map((u) => u.name);
    const parts: string[] = [];

    if (userNames.length > 0) {
      if (userNames.length === 1) {
        parts.push(userNames[0]);
      } else if (userNames.length === 2) {
        parts.push(`${userNames[0]} y ${userNames[1]}`);
      } else {
        parts.push(
          `${userNames.slice(0, -1).join(', ')} y ${userNames[userNames.length - 1]}`,
        );
      }
    }

    if (connectedUsers.guestCount > 0) {
      const guestText =
        connectedUsers.guestCount === 1
          ? '1 invitado'
          : `${connectedUsers.guestCount} invitados`;
      if (parts.length > 0) {
        parts.push(`${guestText}`);
      } else {
        parts.push(guestText);
      }
    }

    const connectText =
      connectedUsers.totalCount === 1 ? ' está conectado' : ' están conectados';
    return parts.join(' y ') + connectText;
  };

  return (
    <div className="my-3 w-full">
      <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 px-4 py-2 shadow-sm ring-1 ring-green-200/50 backdrop-blur-sm">
        <div className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
        </div>
        <span className="text-sm font-medium text-green-800">
          {formatUserList()}
        </span>
        {connectedUsers.maxConnections ? (
          <span className="ml-1 rounded-full bg-green-200 px-2 py-0.5 text-xs font-bold text-green-700">
            {connectedUsers.totalCount}/{connectedUsers.maxConnections}
          </span>
        ) : (
          <span className="ml-1 rounded-full bg-green-200 px-2 py-0.5 text-xs font-bold text-green-700">
            {connectedUsers.totalCount}
          </span>
        )}
      </div>
    </div>
  );
};
