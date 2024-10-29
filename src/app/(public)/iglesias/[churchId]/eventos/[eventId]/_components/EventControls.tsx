import { churchRoles, songTypes } from '@global/config/constants';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { handleTranspose } from '../_utils/handleTranspose';
import { Button } from '@nextui-org/react';
import {
  $eventSelectedSong,
  $isStreamAdmin,
  $lyricSelected,
  $selectedSongLyricLength,
} from '@stores/event';
import { useStore } from '@nanostores/react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { useState } from 'react';

export const EventControls = ({
  songs,
  churchId,
}: {
  songs: EventSongsProps[];
  churchId: string;
}) => {
  const selectedSong = useStore($eventSelectedSong);
  const handleClickSong = (id: number) => {
    $eventSelectedSong.set(id);
  };
  const lyricSelected = useStore($lyricSelected);
  const isStreamAdmin = useStore($isStreamAdmin);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const checkUser = CheckUserStatus({
    isLoggedIn: true,
    checkChurchId: parseInt(churchId),
    churchRoles: [churchRoles.musician.id, churchRoles.worshipLeader.id],
  });
  const [isSomeOneStreaming, setIsSomeOneStreaming] = useState(false);
  const handleStreamAdmin = () => {
    $isStreamAdmin.set(true);
  };
  if (!checkUser) {
    return null;
  } else if (checkUser && !isStreamAdmin && !isSomeOneStreaming) {
    return (
      <div className="flex w-full items-center">
        <p>
          En este momento nadie esta administrando este evento,{' '}
          <span className="font-bold">¿Quieres administrarlo?</span>
        </p>
        <Button variant="solid" color="primary" onClick={handleStreamAdmin}>
          Aceptar
        </Button>
      </div>
    );
  }
  if (checkUser && isStreamAdmin) {
    return (
      <section className="grid items-center bg-slate-50 p-4 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col justify-center">
          <h4 className="my-8 text-slate-800">Canciones</h4>
          <div className="flex w-full flex-col items-start gap-2 text-slate-800">
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
        <div className="flex gap-7">
          <Button
            disabled={lyricSelected.index === 0}
            onClick={() => {
              if (lyricSelected.index > 0)
                $lyricSelected.set({
                  index: lyricSelected.index - 1,
                  action: 'backward',
                });
            }}
          >
            {'<'}
          </Button>
          <Button
            disabled={
              lyricSelected.index === selectedSongLyricLength ||
              selectedSongLyricLength === 0
            }
            onClick={() => {
              if (lyricSelected.index < selectedSongLyricLength)
                $lyricSelected.set({
                  index: lyricSelected.index + 1,
                  action: 'forward',
                });
            }}
          >
            {'>'}
          </Button>
        </div>
      </section>
    );
  }
};
