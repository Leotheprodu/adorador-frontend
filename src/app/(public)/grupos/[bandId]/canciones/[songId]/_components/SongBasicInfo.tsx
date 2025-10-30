import { useStore } from '@nanostores/react';
import { $PlayList, $SelectedSong } from '@stores/player';
import { PlayIcon } from '@global/icons/PlayIcon';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/_utils/handleTranspose';
import { churchRoles, songTypes } from '@global/config/constants';
import { useEffect } from 'react';
import { SongProps } from '../../_interfaces/songsInterface';
import { QueryStatus, RefetchOptions } from '@tanstack/react-query';
import { Button, Tooltip } from '@nextui-org/react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { EditSongButton } from '@bands/[bandId]/canciones/_components/EditSongButton';

export const SongBasicInfo = ({
  data,
  status,
  bandId,
  songId,
  refetch,
}: {
  data: SongProps | undefined;
  status: QueryStatus;
  bandId: string;
  songId: string;
  refetch: (options?: RefetchOptions | undefined) => Promise<unknown>;
}) => {
  const playlist = useStore($PlayList);
  const selectedSong = useStore($SelectedSong);

  const isUserChecked = CheckUserStatus({
    isLoggedIn: true,
    checkBandId: parseInt(bandId),
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
      className={`group flex flex-col gap-1 rounded-lg p-4 transition-all duration-100 ease-in ${isUserChecked && 'hover:shadow-lg'}`}
    >
      <div className="flex gap-2">
        <h1 className="font-bold">{data?.title}</h1>
        {data?.artist && <h2>por {data?.artist}</h2>}
        {selectedSong?.id !== data?.id && (
          <Tooltip color="primary" content="Reproducir canción">
            <button
              className="rounded-sm bg-primary-100 p-1 duration-100 hover:opacity-80 hover:shadow-md active:scale-90"
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
      <div className="flex gap-1">
        <div className="flex w-full gap-2">
          <Button
            color="primary"
            variant="flat"
            as={'a'}
            target="_blank"
            className="text-primary-900 hover:text-primary-500"
            href={`https://youtu.be/${data?.youtubeLink}`}
          >
            Ir a Youtube
          </Button>
        </div>

        <div className="flex w-full gap-2">
          <EditSongButton
            bandId={bandId}
            songId={songId}
            refetch={refetch}
            songData={data}
          />
        </div>
      </div>
    </div>
  );
};
