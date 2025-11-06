import { useStore } from '@nanostores/react';
import { $lyricSelected, $selectedSongData } from '@stores/event';
import { useEffect, useRef, useState } from 'react';
import { LyricsProps } from '../../_interfaces/eventsInterface';
import { structureColors, structureLib } from '@global/config/constants';
import { useEventGateway } from '../_hooks/useEventGateway';
import { EventControlsButtonsLirics } from './EventControlsButtonsLirics';

export const EventControlsLyricsSelect = () => {
  const selectedSongData = useStore($selectedSongData);
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );

  const { sendMessage } = useEventGateway();
  const lyricSelected = useStore($lyricSelected);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
    if (element && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: element.offsetTop - scrollContainerRef.current.offsetTop,
        behavior: 'smooth',
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

  const handleSelectLyric = (position: number) => {
    sendMessage({
      type: 'lyricSelected',
      data: {
        position: position,
        action: lyricSelected.position > position ? 'backward' : 'forward',
      },
    });
  };
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <h4 className="mb-3 bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-center text-lg font-bold text-transparent">
        Letras
      </h4>
      <div className="flex h-full w-full items-center justify-center gap-3 rounded-xl bg-white/70 p-3 shadow-inner backdrop-blur-sm">
        <div
          ref={scrollContainerRef}
          className="flex h-[20rem] w-full flex-col items-center overflow-y-auto rounded-xl bg-gradient-to-br from-slate-50 to-brand-purple-50/20 p-3 shadow-sm sm:h-[22rem]"
        >
          {lyricsGrouped.map(([structure, lyrics], groupIndex) => (
            <div className="mb-4 w-full" key={groupIndex}>
              <h2 className="mb-2 rounded-lg bg-gradient-to-r from-brand-purple-100 to-brand-blue-100 px-3 py-2 text-center text-sm font-bold text-brand-purple-700 shadow-sm">
                {structureLib[structure].es}
              </h2>
              {lyrics.map((lyric, index) => (
                <div
                  className="w-full"
                  key={index}
                  id={lyric.position.toString()}
                >
                  <button
                    onClick={() => {
                      handleSelectLyric(lyric.position);
                    }}
                    style={{
                      backgroundColor:
                        lyricSelected.position > 0 &&
                        (lyricSelected.position === lyric.position ||
                          lyricSelected.position + 1 === lyric.position ||
                          lyricSelected.position + 2 === lyric.position ||
                          lyricSelected.position + 3 === lyric.position)
                          ? '#000000'
                          : structureColors[structure],
                    }}
                    className={`mb-1 w-full cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 ${
                      lyricSelected.position > 0 &&
                      (lyricSelected.position === lyric.position ||
                        lyricSelected.position + 1 === lyric.position ||
                        lyricSelected.position + 2 === lyric.position ||
                        lyricSelected.position + 3 === lyric.position)
                        ? 'text-white ring-2 ring-brand-purple-400 ring-offset-2'
                        : ''
                    }`}
                  >
                    {lyric.lyrics}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <EventControlsButtonsLirics />
      </div>
    </div>
  );
};
