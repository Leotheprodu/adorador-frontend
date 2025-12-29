import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '@nanostores/react';
import { $chordPreferences, $eventConfig } from '@stores/event';
import {
  getSongData,
  getSongLyrics,
  uploadSongLyrics,
} from '../_services/songIdServices';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { useLyricsEditMode } from './useLyricsEditMode';
import { SongIdParams } from '../_interfaces/songIdInterfaces';

export const useSongIdPage = (params: SongIdParams) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [lyricsSorted, setLyricsSorted] = useState<LyricsProps[]>([]);
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );

  // Custom hooks
  // const transpose = useSongTranspose(params.songId); // Removed as per instruction
  const { isEditMode, setIsEditMode, isPracticeMode, setIsPracticeMode } =
    useLyricsEditMode(params.bandId, params.songId);
  const [isFollowMusic, setIsFollowMusic] = useState(false);
  const [isSyncChords, setIsSyncChords] = useState(false);
  const [transpose] = useState(0);

  // Stores
  const chordPreferences = useStore($chordPreferences);
  const eventConfig = useStore($eventConfig);

  // Data fetching
  const { data, isLoading, status, refetch } = getSongData({ params });
  const {
    data: LyricsOfCurrentSong,
    refetch: refetchLyricsOfCurrentSong,
    status: statusOfLyricsOfCurrentSong,
  } = getSongLyrics({ params });

  const { mutate: mutateUploadLyricsByFile, status: statusUploadLyricsByFile } =
    uploadSongLyrics({ params });

  // Refetch cuando cambie el songId
  useEffect(() => {
    refetch();
    refetchLyricsOfCurrentSong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.songId]);

  // Sort lyrics
  useEffect(() => {
    if (LyricsOfCurrentSong && statusOfLyricsOfCurrentSong === 'success') {
      setLyricsSorted(
        LyricsOfCurrentSong.sort((a, b) => a.position - b.position),
      );
    }
  }, [LyricsOfCurrentSong, statusOfLyricsOfCurrentSong]);

  // Refetch after upload success
  useEffect(() => {
    if (statusUploadLyricsByFile === 'success') {
      refetchLyricsOfCurrentSong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUploadLyricsByFile]);

  // Group lyrics by structure
  useEffect(() => {
    if (!lyricsSorted) return;

    const array =
      lyricsSorted.reduce(
        (acc, lyric) => {
          const lastGroup = acc[acc.length - 1];
          if (lastGroup && lastGroup[0] === lyric.structure.title) {
            lastGroup[1].push(lyric);
          } else {
            acc.push([lyric.structure.title, [lyric]]);
          }
          return acc;
        },
        [] as [string, LyricsProps[]][],
      ) || [];

    setLyricsGrouped(array);
  }, [lyricsSorted]);

  const handleBackToSongs = () => {
    queryClient.invalidateQueries({ queryKey: ['SongsOfBand', params.bandId] });
    queryClient.invalidateQueries({ queryKey: ['BandById', params.bandId] });
    router.push(`/grupos/${params.bandId}/canciones`);
  };

  return {
    // Data
    data,
    isLoading,
    status,
    LyricsOfCurrentSong,
    lyricsSorted,
    lyricsGrouped,

    // State
    isEditMode,
    setIsEditMode,
    isPracticeMode,
    setIsPracticeMode,
    isFollowMusic,
    setIsFollowMusic,
    isSyncChords,
    setIsSyncChords,
    transpose,

    // Config
    chordPreferences,
    eventConfig,

    // Functions
    refetch,
    refetchLyricsOfCurrentSong,
    mutateUploadLyricsByFile,
    handleBackToSongs,
  };
};
