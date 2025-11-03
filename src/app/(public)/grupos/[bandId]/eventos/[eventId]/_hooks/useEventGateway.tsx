import { useStore } from '@nanostores/react';
import { $event, lyricSelectedProps } from '@stores/event';
import {
  eventSelectedSongGateway,
  lyricSelectedGateway,
} from '@bands/[bandId]/eventos/[eventId]/_services/eventWSService';

export type MessageProps =
  | { type: 'lyricSelected'; data: lyricSelectedProps }
  | { type: 'eventSelectedSong'; data: number }
  | { type: 'liveMessage'; data: string }
  | { type: 'joinEvent'; data: { eventId: number } }
  | { type: 'leaveEvent'; data: object }
  | { type: 'getConnectedUsers'; data: { eventId: number } };
export const useEventGateway = () => {
  const event = useStore($event);
  const { mutate: mutateLyricSelectedWS } = lyricSelectedGateway();
  const { mutate: mutateEventSelectedSongWS } = eventSelectedSongGateway();

  const sendMessage = (message: MessageProps) => {
    if (message.type === 'lyricSelected') {
      mutateLyricSelectedWS({ message: message.data, id: event.id.toString() });
    }
    if (message.type === 'eventSelectedSong') {
      mutateEventSelectedSongWS({
        message: message.data,
        id: event.id.toString(),
      });
    }
  };

  return {
    sendMessage,
  };
};
