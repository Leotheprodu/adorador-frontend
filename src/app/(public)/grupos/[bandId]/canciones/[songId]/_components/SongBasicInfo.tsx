import { useStore } from '@nanostores/react';
import { $PlayList, $SelectedSong } from '@stores/player';
import { PlayIcon } from '@global/icons/PlayIcon';
import { MicrophoneIcon, MusicNoteIcon } from '@global/icons';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/_utils/handleTranspose';
import { songTypes } from '@global/config/constants';
import { useEffect } from 'react';
import { SongPropsWithCount } from '../../_interfaces/songsInterface';
import { QueryStatus, RefetchOptions } from '@tanstack/react-query';
import { Button, Tooltip } from '@nextui-org/react';
import { EditSongButton } from '@bands/[bandId]/canciones/_components/EditSongButton';
import { DeleteSongButton } from '@bands/[bandId]/canciones/_components/DeleteSongButton';

export const SongBasicInfo = ({
  data,
  status,
  bandId,
  songId,
  refetch,
}: {
  data: SongPropsWithCount | undefined;
  status: QueryStatus;
  bandId: string;
  songId: string;
  refetch: (options?: RefetchOptions | undefined) => Promise<unknown>;
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
    <div className="rounded-2xl bg-white/90 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur-sm">
      {/* Título y artista */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">{data?.title}</h1>
        {data?.artist && (
          <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-purple-100 to-brand-pink-100 px-3 py-1 text-sm font-medium text-brand-purple-700">
            <MicrophoneIcon className="h-4 w-4" /> {data?.artist}
          </span>
        )}
        {selectedSong?.id !== data?.id && data?.youtubeLink && (
          <Tooltip color="primary" content="Reproducir canción">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
              onClick={handleClickPlay}
            >
              <PlayIcon className="h-5 w-5" />
            </button>
          </Tooltip>
        )}
      </div>

      {/* Información de la canción */}
      <div className="mb-5 flex flex-wrap gap-2">
        {data && (
          <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            <MusicNoteIcon className="h-4 w-4" />
            {songTypes[data.songType].es}
          </span>
        )}
        {data?.key && (
          <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            <span>🎹</span>
            {handleTranspose(data?.key, 0)}
          </span>
        )}
        {data?.tempo && (
          <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700">
            <span>⏱️</span>
            {data?.tempo} BPM
          </span>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        {data?.youtubeLink && (
          <Button
            as={'a'}
            target="_blank"
            href={`https://youtu.be/${data?.youtubeLink}`}
            className="bg-gradient-to-r from-red-500 to-red-600 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95"
            startContent={<span className="text-lg">▶️</span>}
          >
            Ver en YouTube
          </Button>
        )}

        <EditSongButton
          bandId={bandId}
          songId={songId}
          refetch={refetch}
          songData={data}
        />

        {data &&
          data._count &&
          (data._count.lyrics === 0 || data._count.lyrics === null) && (
            <DeleteSongButton
              bandId={bandId}
              songId={songId}
              songTitle={data.title}
            />
          )}
      </div>
    </div>
  );
};
