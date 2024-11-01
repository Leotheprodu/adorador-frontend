import { useStore } from '@nanostores/react';
import { $eventSocket, lyricSelectedProps } from '@stores/event';

export const useEventGateway = () => {
  const eventSocket = useStore($eventSocket);
  const sendMessage = ({
    type,
    data,
  }: {
    type: 'lyricSelected' | 'eventSelectedSong';
    data: lyricSelectedProps | number;
  }) => {
    if (eventSocket) {
      eventSocket.emit(type, data);
    }
  };

  return {
    sendMessage,
  };
};
