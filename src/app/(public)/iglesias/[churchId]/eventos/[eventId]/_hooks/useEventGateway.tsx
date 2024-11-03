import { useStore } from '@nanostores/react';
import { $event, lyricSelectedProps } from '@stores/event';
import {
  eventSelectedSongGateway,
  lyricSelectedGateway,
} from '../_services/eventWSService';

export type MessageProps =
  | { type: 'lyricSelected'; data: lyricSelectedProps }
  | { type: 'eventSelectedSong'; data: number }
  | { type: 'liveMessage'; data: string };
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
