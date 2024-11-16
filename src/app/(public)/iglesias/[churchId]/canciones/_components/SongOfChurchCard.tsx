import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { SongPropsWithCount } from '../_interfaces/songsInterface';
import { MenuButtonIcon } from '@global/icons/MenuButtonIcon';
import { songTypes } from '@global/config/constants';
import Link from 'next/link';
import { $SelectedSong } from '@stores/player';
import { useStore } from '@nanostores/react';

export const SongOfChurchCard = ({
  song,
  churchId,
}: {
  song: SongPropsWithCount;
  churchId: string;
}) => {
  const selectedSong = useStore($SelectedSong);
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border-1 ${selectedSong?.id === song.id ? 'border-primary-500' : 'border-slate-100'} p-2`}
    >
      <div>
        <div className="flex gap-2">
          <h1>{song.title}</h1>
          <Dropdown>
            <DropdownTrigger>
              <button>
                <MenuButtonIcon />
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem textValue="Ir a detalles de canción" key="Ir">
                <Link href={`/iglesias/${churchId}/canciones/${song.id}`}>
                  Ir a canción
                </Link>
              </DropdownItem>
              <DropdownItem textValue="escuchar canción" key="escuchar">
                <button
                  onClick={() => {
                    if (song.youtubeLink === null || song.youtubeLink === '') {
                      return;
                    }
                    $SelectedSong.set({
                      id: song.id,
                      name: song.title,
                      youtubeLink: song.youtubeLink,
                    });
                  }}
                >
                  Escuchar
                </button>
              </DropdownItem>
              <DropdownItem
                textValue="Eliminar canción"
                key="delete"
                className="text-danger"
                color="danger"
              >
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex flex-wrap gap-1">
          <small className="rounded-sm bg-slate-200 px-2 py-1">
            {songTypes[song.songType].es}
          </small>
          <small className="rounded-sm bg-slate-200 px-2 py-1">
            {song._count.events}{' '}
            {song._count.events === 1 ? 'evento' : 'eventos'}
          </small>
          {song._count.lyrics === 0 && (
            <small className="rounded-sm bg-danger-100 px-2 py-1">
              Sin Letra
            </small>
          )}
        </div>
      </div>
    </div>
  );
};
