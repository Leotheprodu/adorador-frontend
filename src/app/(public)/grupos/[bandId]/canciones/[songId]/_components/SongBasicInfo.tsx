import { useStore } from '@nanostores/react';
import { $PlayList, $SelectedSong } from '@stores/player';
import {
  PlayIcon,
  GearIcon,
  YoutubeIcon,
  DocumentEditIcon,
  EyeIcon,
  MusicNoteIcon,
  EditIcon,
} from '@global/icons';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import { songTypes } from '@global/config/constants';
import { useEffect } from 'react';
import { SongPropsWithCount } from '../../_interfaces/songsInterface';
import { QueryStatus, RefetchOptions } from '@tanstack/react-query';
import { Button, useDisclosure } from '@nextui-org/react';
import { EditSongButton } from '@bands/[bandId]/canciones/_components/EditSongButton';
import { DeleteSongButton } from '@bands/[bandId]/canciones/_components/DeleteSongButton';
import { ButtonNormalizeLyrics } from './ButtonNormalizeLyrics';
import { getYouTubeThumbnail } from '@global/utils/formUtils';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import Image from 'next/image';
import { RehearsalControlsModal } from './RehearsalControlsModal';

export const SongBasicInfo = ({
  data,
  status,
  bandId,
  songId,
  refetch,
  lyrics,
  refetchLyricsOfCurrentSong,
  onEditModeChange,
  isEditMode,
  isPracticeMode,
  onPracticeModeChange,
}: {
  data: SongPropsWithCount | undefined;
  status: QueryStatus;
  bandId: string;
  songId: string;
  refetch: (options?: RefetchOptions | undefined) => Promise<unknown>;
  lyrics?: LyricsProps[];
  refetchLyricsOfCurrentSong?: () => void;
  onEditModeChange?: (isEdit: boolean) => void;
  isEditMode?: boolean;
  isPracticeMode?: boolean;
  onPracticeModeChange?: (isPractice: boolean) => void;
}) => {
  const playlist = useStore($PlayList);
  const selectedSong = useStore($SelectedSong);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Thumbnail de YouTube si existe */}
          {data?.youtubeLink && (
            <div className="flex-shrink-0">
              <Image
                src={getYouTubeThumbnail(data.youtubeLink, 'maxresdefault')}
                alt={data.title}
                width={288}
                height={160}
                className="h-48 w-full rounded-xl object-cover lg:h-40 lg:w-72"
                unoptimized
              />
            </div>
          )}

          {/* Contenido principal */}
          <div className="flex flex-1 flex-col justify-between">
            {/* Título y metadata */}
            <div>
              <h1 className="mb-2 text-3xl font-bold text-slate-900">
                {data?.title}
              </h1>

              {/* Información secundaria en línea */}
              <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-600">
                {data?.artist && <span>{data.artist}</span>}
                {data?.artist &&
                  (data?.key || data?.tempo || data?.songType) && (
                    <span className="text-slate-300">•</span>
                  )}
                {data && <span>{songTypes[data.songType].es}</span>}
                {data?.key && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{handleTranspose(data.key, 0)}</span>
                  </>
                )}
                {data?.tempo && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{data.tempo} BPM</span>
                  </>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3">
              {/* Toggle Modo Práctica / Edición - Un solo botón intuitivo */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => onPracticeModeChange?.(!isPracticeMode)}
                  className={`border-2 font-semibold transition-all ${
                    isPracticeMode
                      ? 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200'
                      : 'border-orange-500 bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                  startContent={
                    isPracticeMode ? (
                      <MusicNoteIcon className="h-4 w-4" />
                    ) : (
                      <EditIcon className="h-4 w-4" />
                    )
                  }
                >
                  {isPracticeMode ? 'Modo Práctica' : 'Modo Edición'}
                </Button>
                <span className="text-xs text-slate-500">
                  {isPracticeMode
                    ? 'Haz clic para editar'
                    : 'Haz clic para practicar'}
                </span>
              </div>

              {/* Botones según el modo */}
              <div className="flex flex-wrap gap-2">
                {/* Botones de Práctica (siempre visibles en modo práctica) */}
                {isPracticeMode && (
                  <>
                    {data?.youtubeLink && (
                      <>
                        <Button
                          size="sm"
                          onClick={handleClickPlay}
                          disabled={selectedSong?.id === data?.id}
                          className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50"
                          startContent={<PlayIcon className="h-4 w-4" />}
                        >
                          Reproducir
                        </Button>
                        <Button
                          size="sm"
                          as={'a'}
                          target="_blank"
                          href={`https://youtu.be/${data.youtubeLink}`}
                          className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-red-300 hover:bg-red-50"
                          startContent={<YoutubeIcon className="h-4 w-4" />}
                        >
                          Ver en YouTube
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      onClick={onOpen}
                      className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50"
                      startContent={<GearIcon className="h-4 w-4" />}
                    >
                      Controles
                    </Button>
                  </>
                )}

                {/* Botones de Edición (solo visibles en modo edición) */}
                {!isPracticeMode && (
                  <>
                    {lyrics && lyrics.length > 0 && onEditModeChange && (
                      <Button
                        size="sm"
                        onClick={() => onEditModeChange(!isEditMode)}
                        className={`border-2 font-semibold transition-all ${
                          isEditMode
                            ? 'border-brand-purple-500 bg-brand-purple-100 text-brand-purple-700 hover:bg-brand-purple-200'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-brand-purple-300 hover:bg-brand-purple-50'
                        }`}
                        startContent={
                          isEditMode ? (
                            <EyeIcon className="h-4 w-4" />
                          ) : (
                            <DocumentEditIcon className="h-4 w-4" />
                          )
                        }
                      >
                        {isEditMode ? 'Ver Letra' : 'Editar Letra'}
                      </Button>
                    )}

                    <EditSongButton
                      bandId={bandId}
                      songId={songId}
                      refetch={refetch}
                      songData={data}
                    />

                    {lyrics &&
                      lyrics.length > 0 &&
                      refetchLyricsOfCurrentSong && (
                        <ButtonNormalizeLyrics
                          params={{ bandId, songId }}
                          lyrics={lyrics}
                          refetchLyricsOfCurrentSong={
                            refetchLyricsOfCurrentSong
                          }
                        />
                      )}

                    {data &&
                      data._count &&
                      (data._count.lyrics === 0 ||
                        data._count.lyrics === null) && (
                        <DeleteSongButton
                          bandId={bandId}
                          songId={songId}
                          songTitle={data.title}
                        />
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de controles de ensayo */}
      <RehearsalControlsModal
        isOpen={isOpen}
        onClose={onClose}
        songId={songId}
      />
    </>
  );
};
