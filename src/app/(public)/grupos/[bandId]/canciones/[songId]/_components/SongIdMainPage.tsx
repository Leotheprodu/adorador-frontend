'use client';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { UIGuard } from '@global/utils/UIGuard';
import { SongBasicInfo } from './SongBasicInfo';
import { StoredLyricsAlert } from './StoredLyricsAlert';
import { SongHeader } from './SongHeader';
import { LyricsSection } from './LyricsSection';
import { useSongIdPage } from '../_hooks/useSongIdPage';

export const SongIdMainPage = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  const user = useStore($user);
  const {
    data,
    isLoading,
    status,
    LyricsOfCurrentSong,
    lyricsGrouped,
    isEditMode,
    setIsEditMode,
    isPracticeMode,
    setIsPracticeMode,
    isFollowMusic,
    setIsFollowMusic,
    isSyncChords,
    setIsSyncChords,
    transpose,
    chordPreferences,
    eventConfig,
    refetch,
    refetchLyricsOfCurrentSong,
    mutateUploadLyricsByFile,
    handleBackToSongs,
  } = useSongIdPage(params);

  const isMember = user.membersofBands.some(
    (mb) => mb.band.id === parseInt(params.bandId),
  );

  const hasLyrics = LyricsOfCurrentSong && LyricsOfCurrentSong.length > 0;

  return (
    <UIGuard isLoading={isLoading} isLoggedIn>
      <div className="flex flex-col items-center overflow-hidden">
        {/* Alert for stored lyrics */}
        <StoredLyricsAlert />

        {/* Header Section */}
        <SongHeader onBack={handleBackToSongs} />

        {/* Song Basic Info */}
        <section className="mb-6 w-full max-w-4xl px-4">
          <SongBasicInfo
            bandId={params.bandId}
            songId={params.songId}
            data={data}
            status={status}
            refetch={refetch}
            lyrics={LyricsOfCurrentSong}
            refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
            onEditModeChange={setIsEditMode}
            isEditMode={isEditMode}
            isPracticeMode={isPracticeMode}
            onPracticeModeChange={setIsPracticeMode}
            isFollowMusic={isFollowMusic}
            onFollowMusicChange={setIsFollowMusic}
            isSyncChords={isSyncChords}
            onSyncChordsChange={setIsSyncChords}
            isMember={isMember}
          />
        </section>

        {/* Lyrics Section or Empty State for Non-members */}
        {hasLyrics || isMember ? (
          <LyricsSection
            params={params}
            songTitle={data?.title}
            lyrics={LyricsOfCurrentSong}
            lyricsGrouped={lyricsGrouped}
            isEditMode={isEditMode}
            isPracticeMode={isPracticeMode}
            isFollowMusic={isFollowMusic}
            isSyncChords={isSyncChords}
            transpose={transpose}
            showChords={eventConfig.showChords}
            lyricsScale={eventConfig.lyricsScale}
            chordPreferences={chordPreferences}
            refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
            mutateUploadLyricsByFile={mutateUploadLyricsByFile}
            onEditModeChange={setIsEditMode}
          />
        ) : (
          <div className="flex w-full max-w-4xl flex-col items-center justify-center py-20 text-center">
            <p className="max-w-md text-lg font-medium text-slate-500 dark:text-slate-400">
              Esta canción aún no cuenta con letra disponible para el público.
            </p>
          </div>
        )}
      </div>
    </UIGuard>
  );
};
