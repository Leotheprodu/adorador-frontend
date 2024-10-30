import { useStore } from '@nanostores/react';
import { $selectedSongData } from '@stores/event';
import { useEffect, useState } from 'react';
import { LyricsProps } from '../../_interfaces/eventsInterface';

export const EventControlsLyricsSelect = () => {
  const selectedSongData = useStore($selectedSongData);
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );
  console.log(lyricsGrouped);
  useEffect(() => {
    if (selectedSongData !== undefined) {
      setLyricsGrouped(
        Object.entries(
          selectedSongData?.song.lyrics.reduce(
            (acc, lyric) => {
              if (!acc[lyric.structure.title]) {
                acc[lyric.structure.title] = [];
              }
              acc[lyric.structure.title].push(lyric);
              return acc;
            },
            {} as Record<string, typeof selectedSongData.song.lyrics>,
          ) || {},
        ),
      );
    }
  }, [selectedSongData]);
  if (selectedSongData === undefined) {
    return null;
  }
  return (
    <div className="overflow-y-scroll rounded-md border">
      {lyricsGrouped.map(([structure, lyrics]) => (
        <div key={structure}>
          <h2>{structure}</h2>
          {lyrics.map((lyric, index) => (
            <div key={index}>
              <h1>{lyric.lyrics}</h1>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
