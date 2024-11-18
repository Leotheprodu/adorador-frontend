import { useStore } from '@nanostores/react';
import { $PlayList, $SelectedSong } from '@stores/player';
import { PlayIcon } from '@global/icons/PlayIcon';
import { handleTranspose } from '@iglesias/[churchId]/eventos/[eventId]/_utils/handleTranspose';
import { songTypes } from '@global/config/constants';
import { useEffect } from 'react';
import { SongProps } from '../../_interfaces/songsInterface';
import { QueryStatus } from '@tanstack/react-query';

export const SongBasicInfo = ({
  data,
  status,
}: {
  data: SongProps | undefined;
  status: QueryStatus;
}) => {
  const playlist = useStore($PlayList);
  const selectedSong = useStore($SelectedSong);

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
    <div>
      <div className="flex gap-2">
        <h1 className="font-bold">{data?.title}</h1>
        {data?.artist && <h2>por {data?.artist}</h2>}
        {selectedSong?.id !== data?.id && (
          <button
            className="duration-100 active:scale-90"
            onClick={handleClickPlay}
          >
            {<PlayIcon />}
          </button>
        )}
      </div>
      <div className="flex gap-1">
        <p>{data && songTypes[data.songType].es}</p>
        {data?.key && <p>, tonalidad: {handleTranspose(data?.key, 0)}</p>}

        {data?.tempo && <p>, {data?.tempo} bpm</p>}
      </div>
      <a
        className="text-primary-500 hover:border-b-1"
        href={`https://youtu.be/${data?.youtubeLink}`}
      >
        {`https://youtu.be/${data?.youtubeLink}`}
      </a>
    </div>
  );
};
