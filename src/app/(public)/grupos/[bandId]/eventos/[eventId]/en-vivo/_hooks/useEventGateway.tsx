import { useStore } from '@nanostores/react';
import { $event, $eventSocket, lyricSelectedProps } from '@stores/event';
import {
  eventSelectedSongGateway,
  lyricSelectedGateway,
} from '@bands/[bandId]/eventos/[eventId]/en-vivo/_services/eventWSService';

export type MessageProps =
  | { type: 'lyricSelected'; data: lyricSelectedProps }
  | { type: 'eventSelectedSong'; data: number }
  | { type: 'videoSeek'; data: { seekTo: number } }
  | {
      type: 'videoProgress';
      data: { progress: number; progressDuration: string; duration: string };
    }
  | { type: 'liveMessage'; data: string }
  | { type: 'joinEvent'; data: { eventId: number } }
  | { type: 'leaveEvent'; data: object }
  | { type: 'getConnectedUsers'; data: { eventId: number } };
export const useEventGateway = () => {
  const event = useStore($event);
  const socket = useStore($eventSocket);
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
    // Video messages use direct socket emit
    if (message.type === 'videoSeek' || message.type === 'videoProgress') {
      if (socket) {
        socket.emit(message.type, {
          id: event.id.toString(),
          message: message.data,
        });
      }
    }
  };

  return {
    sendMessage,
  };
};
