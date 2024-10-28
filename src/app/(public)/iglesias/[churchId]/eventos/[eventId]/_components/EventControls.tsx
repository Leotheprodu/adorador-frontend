import { songTypes } from '@global/config/constants';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { handleTranspose } from '../_utils/handleTranspose';
import { Button } from '@nextui-org/react';
import { $eventSelectedSong } from '@stores/event';
import { useStore } from '@nanostores/react';

export const EventControls = ({ songs }: { songs: EventSongsProps[] }) => {
  const selectedSong = useStore($eventSelectedSong);
  const handleClickSong = (id: number) => {
    $eventSelectedSong.set(id);
  };

  return (
    <section className="grid items-center bg-slate-50 p-4 md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col justify-center">
        <h4 className="my-8 text-slate-800">Canciones</h4>
        <div className="flex w-full flex-col items-start gap-2 text-slate-800">
          {songs.map((data) => (
            <Button
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
    </section>
  );
};
