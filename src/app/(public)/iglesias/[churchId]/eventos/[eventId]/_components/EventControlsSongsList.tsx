import { EventSongsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { songTypes } from '@global/config/constants';
import { handleTranspose } from '@iglesias/[churchId]/eventos/[eventId]/_utils/handleTranspose';
import { $eventSelectedSongId } from '@stores/event';
import { useStore } from '@nanostores/react';
import { useEventGateway } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useEventGateway';

export const EventControlsSongsList = ({
  songs,
}: {
  songs: EventSongsProps[];
}) => {
  const { sendMessage } = useEventGateway();
  const selectedSongId = useStore($eventSelectedSongId);
  const handleClickSong = (id: number) => {
    sendMessage({ type: 'eventSelectedSong', data: id });
  };
  return (
    <div className="col-start-1 col-end-3 row-start-3 flex h-full w-full flex-col items-center md:col-end-2 md:row-start-1">
      <div className="w-full">
        <h4 className="mb-3 text-center font-bold text-slate-800">Canciones</h4>

        <div className="flex h-[10rem] w-full flex-col items-start gap-2 overflow-y-auto rounded-lg bg-slate-100 p-2 text-slate-800">
          {songs.map((data) => (
            <button
              disabled={selectedSongId === data.song.id}
              onClick={() => handleClickSong(data.song.id)}
              className={`flex justify-start rounded-sm p-1 duration-200 transition-background hover:bg-slate-200 active:scale-95 ${selectedSongId === data.song.id ? 'bg-slate-200 hover:bg-slate-300' : ''}`}
              key={data.song.id}
            >
              <p className="">
                {data.order}) <span className="">{data.song.title}</span> -{' '}
                {songTypes[data.song.songType].es}
                {data.song.key !== null &&
                  ` - ${handleTranspose(data.song.key, data.transpose)}`}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
