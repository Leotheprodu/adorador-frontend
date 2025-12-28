import { LyricsSectionProps } from '../_interfaces/songIdInterfaces';
import { EditLyricsOptions } from './EditLyricsOptions';
import { LyricsGroupedCard } from './LyricsGroupedCard';
import { NoLyricsSong } from './NoLyricsSong';
import { $PlayerRef } from '@stores/player';
import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';

export const LyricsSection = ({
  params,
  songTitle,
  lyrics,
  lyricsGrouped,
  isEditMode,
  isPracticeMode,
  transpose,
  showChords,
  lyricsScale,
  chordPreferences,
  refetchLyricsOfCurrentSong,
  mutateUploadLyricsByFile,
  onEditModeChange,
  isFollowMusic,
}: LyricsSectionProps) => {
  const playerRef = useStore($PlayerRef);
  const [activeLineId, setActiveLineId] = useState<number | null>(null);

  // Reset active line when disabling follow music
  useEffect(() => {
    if (!isFollowMusic) {
      setActiveLineId(null);
    }
  }, [isFollowMusic]);

  // Track active line with optimized loop
  useEffect(() => {
    if (!isFollowMusic || !lyrics || lyrics.length === 0 || !playerRef) return;

    let animationFrameId: number;

    const loop = () => {
      const currentTime = playerRef.getCurrentTime() || 0;

      // Find the active line based on current time
      const activeLine = lyrics.reduce(
        (prev, curr) => {
          const currTime = curr.startTime ?? -1;
          const prevTime = prev?.startTime ?? -1;

          if (currTime > -1 && currTime <= currentTime && currTime > prevTime) {
            return curr;
          }
          return prev;
        },
        null as (typeof lyrics)[0] | null,
      );

      // Only update state if it changed
      const newActiveId = activeLine ? activeLine.id : null;
      setActiveLineId((prev) => (prev !== newActiveId ? newActiveId : prev));

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isFollowMusic, lyrics, playerRef]);
  return (
    <section className="px-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {lyrics && lyrics.length > 0 ? (
          <>
            {isEditMode ? (
              <EditLyricsOptions
                params={params}
                songTitle={songTitle}
                refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                mutateUploadLyricsByFile={mutateUploadLyricsByFile}
                existingLyrics={lyrics}
                isExpanded={true}
                onClose={() => onEditModeChange(false)}
              />
            ) : (
              lyricsGrouped?.map(([structure, groupLyrics], groupIndex) => (
                <LyricsGroupedCard
                  key={groupIndex}
                  structure={structure}
                  lyrics={groupLyrics}
                  refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                  params={params}
                  chordPreferences={chordPreferences}
                  lyricsOfCurrentSong={lyrics}
                  transpose={transpose}
                  showChords={showChords}
                  lyricsScale={lyricsScale}
                  isPracticeMode={isPracticeMode}
                  activeLineId={activeLineId}
                />
              ))
            )}
          </>
        ) : (
          <NoLyricsSong
            mutateUploadLyricsByFile={mutateUploadLyricsByFile}
            refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
            LyricsOfCurrentSong={lyrics ?? []}
            params={params}
            songTitle={songTitle}
          />
        )}
      </div>
    </section>
  );
};
