import { getNoteByType } from '@iglesias/[churchId]/eventos/[eventId]/_utils/getNoteByType';
import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';
import { $chordPreferences } from '@stores/event';
import React, { useEffect, useState } from 'react';
import { NoChordCard } from './NoChordCard';

export const LyricsCard = ({
  lyric,
  refetchLyricsOfCurrentSong,
  params,
}: {
  lyric: LyricsProps;
  refetchLyricsOfCurrentSong: () => void;
  params: { churchId: string; songId: string };
}) => {
  const chordPreferences = useStore($chordPreferences);
  const [noChordsPosition, setNoChordsPosition] = useState<number[]>([]);
  const [sortedChords, setSortedChords] = useState(lyric.chords);

  useEffect(() => {
    const actualChordPositions = lyric.chords.map((chord) => chord.position);
    const totalPositions = [1, 2, 3, 4, 5];
    const noChords = totalPositions.filter(
      (position) => !actualChordPositions.includes(position),
    );
    setNoChordsPosition(noChords);

    const sorted = [...lyric.chords].sort((a, b) => a.position - b.position);
    setSortedChords(sorted);
  }, [lyric.chords]);

  return (
    <div className="group flex flex-col rounded-md p-3 duration-100 hover:shadow-md">
      <div className="grid w-full grid-cols-5 grid-rows-1 gap-1">
        {lyric.chords &&
          lyric.chords.length > 0 &&
          sortedChords.map((chord) => (
            <div
              key={chord.id}
              style={{
                gridColumnStart: chord.position,
                gridColumnEnd: chord.position + 1,
                gridRowStart: 1,
              }}
              className="flex h-10 w-10 items-center justify-center gap-1"
            >
              <div className="flex items-end justify-center">
                <p className="w-full text-center">
                  {getNoteByType(chord.rootNote, 0, chordPreferences)}
                </p>
                <p className="w-full text-center text-slate-400">
                  {chord.chordQuality}
                </p>
              </div>
              {chord.slashChord && (
                <>
                  <p className="w-full text-center text-slate-600">/</p>
                  <div className="flex items-end justify-center">
                    <p className="w-full text-center">
                      {getNoteByType(chord.slashChord, 0, chordPreferences)}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        {noChordsPosition.map((position) => (
          <NoChordCard
            key={position}
            position={position}
            lyric={lyric}
            refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
            params={params}
          />
        ))}
      </div>
      <h1 className="w-full">{lyric.lyrics}</h1>
    </div>
  );
};
