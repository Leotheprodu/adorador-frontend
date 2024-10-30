import { useStore } from '@nanostores/react';
import { $lyricSelected, $selectedSongData } from '@stores/event';
import { useEffect, useState } from 'react';
import { LyricsProps } from '../../_interfaces/eventsInterface';
import { structureLib } from '@global/config/constants';

export const EventControlsLyricsSelect = () => {
  const selectedSongData = useStore($selectedSongData);
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );
  const lyricSelected = useStore($lyricSelected);
  console.log(lyricsGrouped);
  useEffect(() => {
    if (selectedSongData !== undefined) {
      const array =
        selectedSongData?.song.lyrics
          .sort((a, b) => a.position - b.position)
          .reduce(
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
    }
  }, [selectedSongData]);
  if (selectedSongData === undefined) {
    return null;
  }
  return (
    <div className="flex h-[10rem] flex-col items-center overflow-y-scroll rounded-md border p-2">
      {lyricsGrouped.map(([structure, lyrics]) => (
        <div key={structure}>
          <h2 className="text-center font-bold">
            {structureLib[structure].es}
          </h2>
          {lyrics.map((lyric, index) => (
            <div key={index}>
              <h1
                onClick={() => {
                  $lyricSelected.set({
                    position: lyric.position,
                    action:
                      lyricSelected.position > lyric.position
                        ? 'backward'
                        : 'forward',
                  });
                }}
                className={`cursor-pointer rounded-lg px-2 py-1 text-center transition-all duration-200 ${lyricSelected.position === lyric.position ? 'bg-slate-200 hover:bg-slate-300' : 'hover:bg-slate-200'}`}
              >
                {lyric.lyrics}
              </h1>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
