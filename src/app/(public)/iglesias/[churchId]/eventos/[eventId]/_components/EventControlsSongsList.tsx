import { Button } from '@nextui-org/react';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { songTypes } from '@global/config/constants';
import { handleTranspose } from '../_utils/handleTranspose';
import { $eventSelectedSong } from '@stores/event';
import { useStore } from '@nanostores/react';

export const EventControlsSongsList = ({
  songs,
}: {
  songs: EventSongsProps[];
}) => {
  const selectedSong = useStore($eventSelectedSong);
  const handleClickSong = (id: number) => {
    $eventSelectedSong.set(id);
  };
  return (
    <div className="col-start-1 col-end-3 row-start-2 flex w-full flex-col items-center md:col-end-2 md:row-start-1">
      <div>
        <h4 className="text-slate-800">Canciones</h4>

        <div className="flex flex-col items-start gap-2 text-slate-800">
          {songs.map((data) => (
            <Button
              disabled={selectedSong === data.song.id}
              variant="light"
              onClick={() => handleClickSong(data.song.id)}
              className={`flex justify-start ${selectedSong === data.song.id ? 'border-1 border-slate-500 shadow-md' : ''}`}
              key={data.song.id}
            >
              <p className="">
                {data.order}){' '}
                <span className="font-bold">{data.song.title}</span>,{' '}
                {songTypes[data.song.songType].es}
                {data.song.key !== null &&
                  ` - ${handleTranspose(data.song.key, data.transpose)}`}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
