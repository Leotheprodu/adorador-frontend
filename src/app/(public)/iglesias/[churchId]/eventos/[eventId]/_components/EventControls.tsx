import { songTypes } from '@global/config/constants';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { handleTranspose } from '../_utils/handleTranspose';
import { Button } from '@nextui-org/react';
import { $eventSelectedSong } from '@stores/event';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';

export const EventControls = ({ songs }: { songs: EventSongsProps[] }) => {
  const selectedSong = useStore($eventSelectedSong);
  const handleClickSong = (id: number) => {
    $eventSelectedSong.set(id);
    setLocalStorage('eventSelectedSong', id);
  };
  useEffect(() => {
    const songId = getLocalStorage('eventSelectedSong') ?? '0';
    $eventSelectedSong.set(songId);
  }, []);
  return (
    <section className="grid w-full items-center md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col items-center justify-center">
        <h4 className="my-8 text-slate-800">Canciones</h4>
        <div className="flex w-full flex-col items-start gap-2 text-slate-800">
          {songs.map((data) => (
            <Button
              onClick={() => handleClickSong(data.song.id)}
              className={`flex w-full justify-start ${selectedSong === data.song.id ? 'border-1 border-slate-500 shadow-md' : ''}`}
              key={data.song.id}
            >
              <p className="">
                {data.order}) {songTypes[data.song.songType].es},{' '}
                <span className="font-bold">{data.song.title}</span>
                {data.song.key !== null &&
                  `, ${handleTranspose(data.song.key, data.transpose)}`}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
