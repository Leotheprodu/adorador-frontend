import { useStore } from '@nanostores/react';
import { $PlayList, $SelectedSong } from '@stores/player';
import { PlayIcon } from '@global/icons/PlayIcon';
import { handleTranspose } from '@iglesias/[churchId]/eventos/[eventId]/_utils/handleTranspose';
import { churchRoles, songTypes } from '@global/config/constants';
import { useEffect } from 'react';
import { SongProps } from '../../_interfaces/songsInterface';
import { QueryStatus } from '@tanstack/react-query';
import { Button, Tooltip } from '@nextui-org/react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';

export const SongBasicInfo = ({
  data,
  status,
  churchId,
}: {
  data: SongProps | undefined;
  status: QueryStatus;
  churchId: string;
}) => {
  const playlist = useStore($PlayList);
  const selectedSong = useStore($SelectedSong);

  const isUserChecked = CheckUserStatus({
    isLoggedIn: true,
    checkChurchId: parseInt(churchId),
    churchRoles: [churchRoles.musician.id, churchRoles.worshipLeader.id],
  });

  useEffect(() => {
    if (
      data &&
      playlist &&
      playlist.length === 1 &&
      playlist[0].id === 0 &&
      status === 'success' &&
      data?.youtubeLink !== '' &&
      data?.youtubeLink !== null
    ) {
      $PlayList.set([
        { id: data?.id, name: data?.title, youtubeLink: data?.youtubeLink },
      ]);
    }
  }, [status, data, playlist]);

  const handleClickPlay = () => {
    if (selectedSong && data && selectedSong.id === data?.id) {
      return;
    } else if (data && data.youtubeLink !== null && data.youtubeLink !== '') {
      $SelectedSong.set({
        id: data.id,
        name: data.title,
        youtubeLink: data.youtubeLink,
      });
    }
  };
  return (
    <div
      className={`group flex flex-col gap-1 rounded-lg border-danger-200 p-4 transition-all duration-150 ease-in ${isUserChecked && 'hover:border-2'}`}
    >
      <div className="flex gap-2">
        <h1 className="font-bold">{data?.title}</h1>
        {data?.artist && <h2>por {data?.artist}</h2>}
        {selectedSong?.id !== data?.id && (
          <Tooltip color="primary" content="Reproducir canción">
            <button
              className="duration-100 active:scale-90"
              onClick={handleClickPlay}
            >
              {<PlayIcon />}
            </button>
          </Tooltip>
        )}
      </div>
      <div className="flex gap-1">
        <p>{data && songTypes[data.songType].es}</p>
        {data?.key && <p>, tonalidad: {handleTranspose(data?.key, 0)}</p>}

        {data?.tempo && <p>, {data?.tempo} bpm</p>}
      </div>

      <a
        target="_blank"
        className="text-primary-900 hover:text-primary-500"
        href={`https://youtu.be/${data?.youtubeLink}`}
      >
        {`https://youtu.be/${data?.youtubeLink}`}
      </a>

      {isUserChecked && (
        <div className="invisible mt-7 flex w-full justify-end group-hover:visible">
          <Button variant="bordered" color="danger">
            Editar Información
          </Button>
        </div>
      )}
    </div>
  );
};
