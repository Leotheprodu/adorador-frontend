import { useStore } from '@nanostores/react';
import { $selectedSongData, lyricSelectedProps } from '@stores/event';
import { useEffect, useState } from 'react';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

export const useDataOfLyricSelected = ({
  lyricSelected,
}: {
  lyricSelected: lyricSelectedProps;
}) => {
  const selectedSongData = useStore($selectedSongData);
  const [dataOfLyricSelected, setDataOfLyricSelected] = useState<LyricsProps>();
  useEffect(() => {
    if (
      selectedSongData &&
      lyricSelected.position <= selectedSongData?.song.lyrics.length
    ) {
      setDataOfLyricSelected(
        selectedSongData?.song.lyrics.find(
          (lyric) => lyric.position === lyricSelected.position,
        ),
      );
    } else {
      setDataOfLyricSelected(undefined);
    }
  }, [lyricSelected, selectedSongData]);

  return {
    dataOfLyricSelected,
  };
};
