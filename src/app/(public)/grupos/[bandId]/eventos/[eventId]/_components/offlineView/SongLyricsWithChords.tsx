import { structureColors, structureLib } from '@global/config/constants';
import {
  EventSongsProps,
  LyricsProps,
} from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';
import { $chordPreferences, $eventConfig } from '@stores/event';
import { useEffect, useState } from 'react';
import { getNoteByType } from '../../_utils/getNoteByType';

export const SongLyricsWithChords = ({ data }: { data: EventSongsProps }) => {
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );
  const chordPreferences = useStore($chordPreferences);
  const eventConfig = useStore($eventConfig);
  useEffect(() => {
    if (data !== undefined) {
      const array =
        data?.song.lyrics
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
  }, [data]);

  return (
    <div className="w-full">
      {lyricsGrouped.map(([structure, lyrics], groupIndex) => (
        <div className="w-full" key={groupIndex}>
          <h2
            style={{
              borderColor: structureColors[structure],
            }}
            className="my-6 rounded-lg border-l-4 bg-gradient-icon p-3 text-center text-lg font-semibold text-brand-purple-700"
          >
            {structureLib[structure].es}
          </h2>
          {lyrics?.map((lyric) => (
            <div
              key={lyric.id}
              className="mb-4 flex w-full flex-col items-start"
            >
              <div className="grid w-full grid-cols-5 rounded-md">
                {eventConfig.showChords &&
                  lyric?.chords
                    .sort((a, b) => a.position - b.position)
                    .map((chord) => (
                      <div
                        key={chord.id}
                        style={{
                          gridColumnStart: chord.position,
                          gridColumnEnd: chord.position + 1,
                        }}
                        className={`${chord.slashChord && 'rounded-lg border-2 border-brand-purple-300 bg-gradient-light p-2'} col-span-1 flex items-center justify-center gap-1`}
                      >
                        <div className="flex items-end justify-center">
                          <p className="w-full text-center text-base font-semibold text-brand-purple-600">
                            {getNoteByType(
                              chord.rootNote,
                              data?.transpose,
                              chordPreferences,
                            )}
                          </p>
                          <p className="w-full text-center text-base font-medium text-brand-purple-600">
                            {chord.chordQuality}
                          </p>
                        </div>
                        {chord.slashChord && (
                          <>
                            <div className="flex items-end justify-center rounded-md bg-brand-purple-600 px-3 text-white">
                              <p className="w-full text-center text-base font-semibold">
                                {getNoteByType(
                                  chord.slashChord,
                                  data?.transpose,
                                  chordPreferences,
                                )}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
              </div>
              <p className="mt-2 text-lg leading-relaxed text-gray-700">
                {lyric.lyrics}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
