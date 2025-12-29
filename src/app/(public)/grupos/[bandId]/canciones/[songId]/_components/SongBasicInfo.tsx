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
  WrenchIcon,
} from '@global/icons';
import Link from 'next/link';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import { songTypes } from '@global/config/constants';
import { useEffect } from 'react';
import { SongPropsWithCount } from '../../_interfaces/songsInterface';
import { QueryStatus, RefetchOptions } from '@tanstack/react-query';
import { Button, useDisclosure, Chip, Checkbox } from '@heroui/react';
import { EditSongButton } from '@bands/[bandId]/canciones/_components/EditSongButton';
import { DeleteSongButton } from '@bands/[bandId]/canciones/_components/DeleteSongButton';
import { ButtonNormalizeLyrics } from './ButtonNormalizeLyrics';
import { getYouTubeThumbnail } from '@global/utils/formUtils';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { RehearsalControlsModal } from './RehearsalControlsModal';
import { VideoLyricsModal } from './VideoLyricsModal';
import { getVideoLyricsService } from '../_services/videoLyricsService';

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
  isFollowMusic,
  onFollowMusicChange,

  isSyncChords,
  onSyncChordsChange,
  isMember = false,
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
  isFollowMusic?: boolean;
  onFollowMusicChange?: (isFollowMusic: boolean) => void;
  isSyncChords?: boolean;
  onSyncChordsChange?: (isSyncChords: boolean) => void;
  isMember?: boolean;
}) => {
  const playlist = useStore($PlayList);
  const selectedSong = useStore($SelectedSong);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isVideoLyricsOpen,
    onOpen: onVideoLyricsOpen,
    onClose: onVideoLyricsClose,
  } = useDisclosure();

  //  Fetch video lyrics count
  const { data: videoLyrics } = getVideoLyricsService({ bandId, songId });

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
        {
          id: data?.id,
          name: data?.title,
          youtubeLink: data?.youtubeLink,
          tempo: data?.tempo,
          startTime: data?.startTime,
          key: data?.key,
        },
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
        tempo: data.tempo,
        startTime: data.startTime,
        key: data.key,
        bandId,
      });
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-gray-900 dark:shadow-none">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Thumbnail de YouTube si existe */}
          {data?.youtubeLink && (
            <div className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getYouTubeThumbnail(data.youtubeLink, 'maxresdefault')}
                alt={data.title}
                className="h-48 w-full rounded-xl object-cover lg:h-40 lg:w-72"
              />
            </div>
          )}

          {/* Contenido principal */}
          <div className="flex flex-1 flex-col justify-between">
            {/* Título y metadata */}
            <div>
              <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {data?.title}
              </h1>

              {/* Información secundaria en línea */}
              <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                {data?.artist && <span>{data.artist}</span>}
                {data?.artist &&
                  (data?.key || data?.tempo || data?.songType) && (
                    <span className="text-slate-300 dark:text-slate-600">
                      •
                    </span>
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
              {isMember && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onPress={() => onPracticeModeChange?.(!isPracticeMode)}
                    className={`border-2 font-semibold transition-all ${
                      isPracticeMode
                        ? 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200 dark:border-green-700 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900'
                        : 'border-orange-500 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900'
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
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isPracticeMode
                      ? 'Haz clic para editar'
                      : 'Haz clic para practicar'}
                  </span>
                </div>
              )}

              {/* Checkbox Seguir la música y Sincronizar Acordes (Solo en modo práctica) */}
              {isPracticeMode && (
                <div className="flex flex-col items-end gap-1 px-1">
                  {onFollowMusicChange && (
                    <Checkbox
                      isSelected={isFollowMusic}
                      onValueChange={onFollowMusicChange}
                      size="sm"
                      color="success"
                    >
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Seguir la música
                      </span>
                    </Checkbox>
                  )}
                  {onSyncChordsChange && (
                    <Checkbox
                      isSelected={isSyncChords}
                      onValueChange={onSyncChordsChange}
                      size="sm"
                      color="secondary"
                    >
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Sincronizar Acordes
                      </span>
                    </Checkbox>
                  )}
                </div>
              )}

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
                          className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
                          startContent={<PlayIcon className="h-4 w-4" />}
                        >
                          Reproducir
                        </Button>
                        <Button
                          size="sm"
                          as={'a'}
                          target="_blank"
                          href={`https://youtu.be/${data.youtubeLink}`}
                          className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-red-300 hover:bg-red-50 dark:border-red-700 dark:bg-gray-900 dark:text-red-400 dark:hover:border-red-400 dark:hover:bg-gray-800"
                          startContent={<YoutubeIcon className="h-4 w-4" />}
                        >
                          Ver en YouTube
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      onPress={onOpen}
                      className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
                      startContent={<GearIcon className="h-4 w-4" />}
                    >
                      Controles
                    </Button>

                    {/* Videos button - always visible */}
                    {isMember && (
                      <Button
                        size="sm"
                        onPress={onVideoLyricsOpen}
                        startContent={<PlayIcon className="h-4 w-4" />}
                        className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
                      >
                        Videos
                        {videoLyrics && videoLyrics.length > 0 && (
                          <Chip
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="ml-1"
                          >
                            {videoLyrics.length}
                          </Chip>
                        )}
                      </Button>
                    )}
                  </>
                )}

                {/* Botones de Edición (solo visibles en modo edición y si es miembro) */}
                {!isPracticeMode && isMember && (
                  <>
                    {lyrics && lyrics.length > 0 && onEditModeChange && (
                      <Button
                        size="sm"
                        onClick={() => onEditModeChange(!isEditMode)}
                        className={`border-2 font-semibold transition-all ${
                          isEditMode
                            ? 'border-brand-purple-500 bg-brand-purple-100 text-brand-purple-700 hover:bg-brand-purple-200 dark:border-brand-purple-700 dark:bg-brand-purple-950 dark:text-brand-purple-200 dark:hover:bg-brand-purple-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800'
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

                    <Button
                      size="sm"
                      onPress={onVideoLyricsOpen}
                      startContent={<PlayIcon className="h-4 w-4" />}
                      className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
                    >
                      Videos
                      {videoLyrics && videoLyrics.length > 0 && (
                        <Chip
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="ml-1"
                        >
                          {videoLyrics.length}
                        </Chip>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      as={Link}
                      href={`/grupos/${bandId}/canciones/${songId}/herramientas`}
                      className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
                      startContent={<WrenchIcon className="h-4 w-4" />}
                    >
                      Herramientas
                    </Button>

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

      {/* Modal de video lyrics */}

      <VideoLyricsModal
        isOpen={isVideoLyricsOpen}
        onClose={onVideoLyricsClose}
        bandId={bandId}
        songId={songId}
      />
    </>
  );
};
