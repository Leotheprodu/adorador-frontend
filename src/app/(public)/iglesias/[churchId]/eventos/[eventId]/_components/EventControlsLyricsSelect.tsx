import { useStore } from '@nanostores/react';
import { $lyricSelected, $selectedSongData } from '@stores/event';
import { useEffect, useRef, useState } from 'react';
import { LyricsProps } from '../../_interfaces/eventsInterface';
import { structureLib } from '@global/config/constants';

export const EventControlsLyricsSelect = () => {
  const selectedSongData = useStore($selectedSongData);
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );
  const lyricSelected = useStore($lyricSelected);
  console.log(lyricsGrouped);
  const scrollContainerRef = useRef(null);
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
  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  };
  useEffect(() => {
    if (lyricSelected.position !== null) {
      scrollToElement(lyricSelected.position.toString());
    }
  }, [lyricSelected.position]);

  if (selectedSongData === undefined) {
    return null;
  }
  return (
    <div className="flex h-full w-full flex-col items-center">
      <h4 className="mb-3 text-center font-bold text-slate-800">Letras</h4>
      <div
        ref={scrollContainerRef}
        className="flex h-[10rem] flex-col items-center overflow-y-auto rounded-lg bg-slate-100 p-2"
      >
        {lyricsGrouped.map(([structure, lyrics]) => (
          <div key={structure}>
            <h2 className="text-center font-bold">
              {structureLib[structure].es}
            </h2>
            {lyrics.map((lyric, index) => (
              <div key={index}>
                <h1
                  id={lyric.position.toString()}
                  onClick={() => {
                    $lyricSelected.set({
                      position: lyric.position,
                      action:
                        lyricSelected.position > lyric.position
                          ? 'backward'
                          : 'forward',
                    });
                  }}
                  className={`cursor-pointer rounded-sm px-2 py-1 text-center duration-200 transition-background active:scale-95 ${lyricSelected.position === lyric.position ? 'bg-slate-200 hover:bg-slate-300' : 'hover:bg-slate-200'}`}
                >
                  {lyric.lyrics}
                </h1>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
