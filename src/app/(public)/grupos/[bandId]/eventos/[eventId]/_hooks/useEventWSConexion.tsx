import { Server1API } from '@global/config/constants';
import {
  $eventAdminName,
  $eventLiveMessage,
  $eventSelectedSongId,
  $eventSocket,
  $lyricSelected,
} from '@stores/event';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const useEventWSConexion = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  useEffect(() => {
    const socket = io(Server1API); // Asegúrate de que el puerto coincida con el del servidor
    $eventSocket.set(socket);
    $lyricSelected.set({ position: 0, action: 'forward' });
    $eventAdminName.set('');
    $eventSelectedSongId.set(0);
    // Escuchar el evento 'lyricSelected' con el ID específico y actualizar el estado correspondiente
    socket.on(`lyricSelected-${params.eventId}`, (data) => {
      $lyricSelected.set(data.message);
      $eventAdminName.set(data.eventAdmin);
    });

    // Escuchar el evento 'eventSelectedSong' con el ID específico y actualizar el estado correspondiente
    socket.on(`eventSelectedSong-${params.eventId}`, (data) => {
      $eventSelectedSongId.set(data.message);
      $eventAdminName.set(data.eventAdmin);
    });

    // Escucha el evento 'liveMessage' con el ID específico y actualiza el estado correspondiente
    socket.on(`liveMessage-${params.eventId}`, (data) => {
      $eventLiveMessage.set(data);
    });

    return () => {
      socket.close();
    };
  }, [params.eventId]);

  return {};
};
