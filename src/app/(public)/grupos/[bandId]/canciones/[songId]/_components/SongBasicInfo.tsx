import { useStore } from '@nanostores/react';
import { $PlayList, $SelectedSong } from '@stores/player';
import {
  PlayIcon,
  GearIcon,
  YoutubeIcon,
  DocumentEditIcon,
  EyeIcon,
  MusicNoteIcon,
  WrenchIcon,
  BookmarkIcon,
  ClockIcon,
} from '@global/icons';
import Link from 'next/link';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import { songTypes } from '@global/config/constants';
import { useEffect } from 'react';
import { SongPropsWithCount } from '../../_interfaces/songsInterface';
import { QueryStatus, RefetchOptions } from '@tanstack/react-query';
import {
  Button,
  useDisclosure,
  Chip,
  Checkbox,
  Tooltip,
  Divider,
} from '@heroui/react';
import { EditSongButton } from '@bands/[bandId]/canciones/_components/EditSongButton';
import { DeleteSongButton } from '@bands/[bandId]/canciones/_components/DeleteSongButton';
import { ButtonNormalizeLyrics } from './ButtonNormalizeLyrics';
import { getYouTubeThumbnail } from '@global/utils/formUtils';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { RehearsalControlsModal } from './RehearsalControlsModal';
import { VideoLyricsModal } from './VideoLyricsModal';

import { getVideoLyricsService } from '../_services/videoLyricsService';
import { OFFICIAL_BAND_ID } from '@global/config/constants';
import { useSavedSong } from '@/app/(public)/feed/_hooks/useSavedSong';
import { useSyncedLyricsAccess } from '@global/hooks/useSyncedLyricsAccess';

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
  const hasAccess = useSyncedLyricsAccess(); // Hook de permisos

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
          hasSyncedLyrics: data?.hasSyncedLyrics,
          hasSyncedChords: data?.hasSyncedChords,
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
        hasSyncedLyrics: data.hasSyncedLyrics,
        hasSyncedChords: data.hasSyncedChords,
      });
    }
  };

  const isOfficialBand = String(bandId) === String(OFFICIAL_BAND_ID);
  const {
    isSaved,
    isLoading: isSaveLoading,
    toggleSave,
  } = useSavedSong(Number(songId), data?.title);

  const hasLyrics = data?._count?.lyrics ? data._count.lyrics > 0 : false;
  const hasVideoLyrics = videoLyrics && videoLyrics.length > 0;

  if (!data) return null;

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-default-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-default-100 dark:bg-content1">
        {/* Decorative Background Blur */}
        <div className="absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full bg-brand-purple-500/10 blur-3xl dark:bg-brand-purple-500/5" />

        <div className="relative z-10 grid grid-cols-1 gap-6 p-6 lg:grid-cols-[auto_1fr] lg:p-8">
          {/* Left Column: Thumbnail */}
          <div className="flex flex-col gap-4">
            {data?.youtubeLink ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-sm transition-transform lg:w-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getYouTubeThumbnail(data.youtubeLink, 'maxresdefault')}
                  alt={data.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Play Button on Thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    isIconOnly
                    radius="full"
                    className="bg-white/90 text-black shadow-lg dark:bg-black/80 dark:text-white"
                    onPress={handleClickPlay}
                  >
                    <PlayIcon className="ml-0.5 h-6 w-6" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-default-100 text-default-400 lg:w-80">
                <MusicNoteIcon className="h-12 w-12 opacity-50" />
              </div>
            )}

            {/* Thumbnail Actions */}
            <div className="flex justify-center gap-2">
              {data.youtubeLink && (
                <Button
                  size="sm"
                  variant="light"
                  as="a"
                  href={`https://youtu.be/${data.youtubeLink}`}
                  target="_blank"
                  startContent={
                    <YoutubeIcon className="h-4 w-4 text-red-500" />
                  }
                  className="text-default-500"
                >
                  Ver en YouTube
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Content & Actions */}
          <div className="flex flex-col justify-between gap-6">
            {/* Header & Metadata */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {data?.title}
                  </h1>
                  {/* Official Band Save Button */}
                  {isOfficialBand && (
                    <Tooltip
                      content={
                        isSaved ? 'Guardado en tu lista' : 'Guardar en tu lista'
                      }
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant={isSaved ? 'solid' : 'bordered'}
                        color={isSaved ? 'secondary' : 'default'}
                        onPress={toggleSave}
                        isLoading={isSaveLoading}
                        className={`transition-transform active:scale-95 ${isSaved ? '' : 'border-default-300 text-default-500'}`}
                      >
                        <BookmarkIcon
                          className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                        />
                      </Button>
                    </Tooltip>
                  )}
                </div>

                {data?.artist && (
                  <p className="text-xl font-medium text-default-500">
                    {data.artist}
                  </p>
                )}
              </div>

              {/* Metadata Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{
                    base: 'bg-default-100',
                    content: 'font-semibold text-default-600',
                  }}
                >
                  {songTypes[data.songType].es}
                </Chip>

                {data?.key && (
                  <Chip
                    size="sm"
                    variant="flat"
                    startContent={<span className="ml-1 text-xs">Ton:</span>}
                    classNames={{
                      base: 'bg-default-100',
                      content: 'font-semibold text-default-600',
                    }}
                  >
                    {handleTranspose(data.key, 0)}
                  </Chip>
                )}

                {data?.tempo && (
                  <Chip
                    size="sm"
                    variant="flat"
                    startContent={<ClockIcon className="ml-1 h-3 w-3" />}
                    classNames={{
                      base: 'bg-default-100',
                      content: 'font-semibold text-default-600',
                    }}
                  >
                    {data.tempo} BPM
                  </Chip>
                )}

                <Divider orientation="vertical" className="mx-1 h-6" />

                {/* Capabilities Badges */}
                <div className="flex gap-2">
                  {/* Lyrics Badge */}
                  {hasLyrics && (
                    <Chip
                      size="sm"
                      color={data?.hasSyncedLyrics ? 'success' : 'default'}
                      variant="dot"
                      className="border-none pl-1"
                    >
                      {data?.hasSyncedLyrics ? 'Letra Sync' : 'Letra'}
                    </Chip>
                  )}

                  {/* Chords Sync Badge */}
                  {data?.hasSyncedChords && (
                    <Chip
                      size="sm"
                      color="secondary"
                      variant="dot"
                      className="border-none pl-1"
                    >
                      Acordes Sync
                    </Chip>
                  )}

                  {/* Video Lyrics Badge */}
                  {hasVideoLyrics && (
                    <Chip
                      size="sm"
                      color="warning"
                      variant="dot"
                      className="border-none pl-1"
                    >
                      Video Lyrics
                    </Chip>
                  )}
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="space-y-4 rounded-xl bg-default-50 p-4 dark:bg-default-100/50">
              {/* Primary Controls Row */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Play Button */}
                {data?.youtubeLink && (
                  <Button
                    size="md"
                    color="primary"
                    className="font-semibold shadow-md shadow-primary/20"
                    onPress={handleClickPlay}
                    isDisabled={selectedSong?.id === data?.id}
                    startContent={<PlayIcon className="h-5 w-5" />}
                  >
                    {selectedSong?.id === data?.id
                      ? 'Reproduciendo...'
                      : 'Reproducir'}
                  </Button>
                )}

                <Divider
                  orientation="vertical"
                  className="hidden h-8 sm:block"
                />

                {/* Practice Mode Toggle */}

                <Button
                  isDisabled={!isMember}
                  size="md"
                  variant={isPracticeMode ? 'solid' : 'bordered'}
                  color={isPracticeMode ? 'success' : 'default'}
                  onPress={() => onPracticeModeChange?.(!isPracticeMode)}
                  startContent={
                    isPracticeMode ? (
                      <MusicNoteIcon className="h-5 w-5" />
                    ) : (
                      <MusicNoteIcon className="h-5 w-5 text-default-500" />
                    )
                  }
                  className={`font-medium ${!isPracticeMode && 'border-default-300 text-default-600 hover:border-success-500 hover:text-success-600'}`}
                >
                  Modo Práctica
                </Button>

                {/* Practice Options (visible when active) */}
                {isPracticeMode && (
                  <div className="flex animate-appearance-in flex-wrap items-center gap-4 rounded-lg border border-default-200 bg-white px-3 py-1.5 shadow-sm dark:border-default-200/50 dark:bg-default-100">
                    {onFollowMusicChange && data?.hasSyncedLyrics && (
                      <Tooltip
                        content="Función exclusiva para miembros de grupos con plan activo."
                        isDisabled={hasAccess}
                      >
                        <div>
                          <Checkbox
                            isSelected={isFollowMusic}
                            onValueChange={onFollowMusicChange}
                            isDisabled={!hasAccess}
                            size="sm"
                            color="success"
                            classNames={{
                              label: `text-small text-default-600 ${!hasAccess ? 'opacity-50' : ''}`,
                            }}
                          >
                            Seguir música
                          </Checkbox>
                        </div>
                      </Tooltip>
                    )}
                    {onSyncChordsChange && data?.hasSyncedChords && (
                      <Tooltip
                        content="Función exclusiva para miembros de grupos con plan activo."
                        isDisabled={hasAccess}
                      >
                        <div>
                          <Checkbox
                            isSelected={isSyncChords}
                            onValueChange={onSyncChordsChange}
                            isDisabled={!hasAccess}
                            size="sm"
                            color="secondary"
                            classNames={{
                              label: `text-small text-default-600 ${!hasAccess ? 'opacity-50' : ''}`,
                            }}
                          >
                            Sync acordes
                          </Checkbox>
                        </div>
                      </Tooltip>
                    )}
                    <Divider orientation="vertical" className="h-5" />
                    <Tooltip content="Configuración avanzada">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={onOpen}
                        isDisabled={!hasAccess}
                      >
                        <GearIcon className="h-4 w-4 text-default-500" />
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Secondary Actions / Admin Row */}
              {isMember && !isPracticeMode && (
                <>
                  <Divider className="my-1" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {/* Edit Lyrics */}
                      {isMember &&
                        lyrics &&
                        lyrics.length > 0 &&
                        onEditModeChange && (
                          <Button
                            size="sm"
                            variant="flat"
                            color={isEditMode ? 'secondary' : 'default'}
                            onPress={() => onEditModeChange(!isEditMode)}
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

                      {/* Tools Link */}
                      <Button
                        size="sm"
                        variant="flat"
                        as={Link}
                        href={`/grupos/${bandId}/canciones/${songId}/herramientas`}
                        startContent={<WrenchIcon className="h-4 w-4" />}
                      >
                        Herramientas
                      </Button>

                      {/* Video Lyrics */}
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={onVideoLyricsOpen}
                        endContent={
                          videoLyrics && videoLyrics.length > 0 ? (
                            <Chip
                              size="sm"
                              variant="flat"
                              color="warning"
                              className="h-5 min-h-5 px-1 text-xs"
                            >
                              {videoLyrics.length}
                            </Chip>
                          ) : null
                        }
                      >
                        Videos
                      </Button>
                    </div>

                    {/* Dangerous Actions */}
                    {isMember && (
                      <div className="flex items-center gap-2">
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
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RehearsalControlsModal
        isOpen={isOpen}
        onClose={onClose}
        songId={songId}
      />
      <VideoLyricsModal
        isOpen={isVideoLyricsOpen}
        onClose={onVideoLyricsClose}
        bandId={bandId}
        songId={songId}
      />
    </>
  );
};
