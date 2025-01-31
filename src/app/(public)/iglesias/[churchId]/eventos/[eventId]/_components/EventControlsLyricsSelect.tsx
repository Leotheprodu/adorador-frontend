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
      <h4 className="mb-3 text-center font-bold text-slate-800">Letras</h4>
      <div className="flex h-full items-center justify-center gap-2 rounded-md bg-slate-100 p-2">
        <div
          ref={scrollContainerRef}
          className="flex h-[10rem] w-full flex-col items-center overflow-y-auto rounded-lg bg-slate-100 p-2"
        >
          {lyricsGrouped.map(([structure, lyrics], groupIndex) => (
            <div key={groupIndex}>
              <h2 className="text-center text-slate-600">
                {structureLib[structure].es}
              </h2>
              {lyrics.map((lyric, index) => (
                <div key={index} id={lyric.position.toString()}>
                  <h1
                    onClick={() => {
                      handleSelectLyric(lyric.position);
                    }}
                    style={{
                      backgroundColor: structureColors[structure],
                    }}
                    className={`cursor-pointer rounded-sm px-2 py-1 text-center duration-200 transition-background active:scale-95 ${lyricSelected.position === lyric.position || lyricSelected.position + 1 === lyric.position || lyricSelected.position + 2 === lyric.position || lyricSelected.position + 3 === lyric.position ? 'border-1 border-primary-300' : ''}`}
                  >
                    {lyric.lyrics}
                  </h1>
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
