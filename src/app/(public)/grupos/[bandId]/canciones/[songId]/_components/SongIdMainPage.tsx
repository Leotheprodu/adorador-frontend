'use client';
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
    transpose,
    chordPreferences,
    eventConfig,
    refetch,
    refetchLyricsOfCurrentSong,
    mutateUploadLyricsByFile,
    handleBackToSongs,
  } = useSongIdPage(params);

  return (
    <UIGuard
      isLoggedIn
      checkBandId={parseInt(params.bandId)}
      isLoading={isLoading}
    >
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
          />
        </section>

        {/* Lyrics Section */}
        <LyricsSection
          params={params}
          songTitle={data?.title}
          lyrics={LyricsOfCurrentSong}
          lyricsGrouped={lyricsGrouped}
          isEditMode={isEditMode}
          isPracticeMode={isPracticeMode}
          transpose={transpose}
          showChords={eventConfig.showChords}
          lyricsScale={eventConfig.lyricsScale}
          chordPreferences={chordPreferences}
          refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
          mutateUploadLyricsByFile={mutateUploadLyricsByFile}
          onEditModeChange={setIsEditMode}
        />
      </div>
    </UIGuard>
  );
};
