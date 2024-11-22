import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import React, { useEffect, useState } from 'react';
import { NoChordCard } from './NoChordCard';
import { ChordCard } from './ChordCard';

export const LyricsCard = ({
  lyric,
  refetchLyricsOfCurrentSong,
  params,
}: {
  lyric: LyricsProps;
  refetchLyricsOfCurrentSong: () => void;
  params: { churchId: string; songId: string };
}) => {
  const [noChordsPosition, setNoChordsPosition] = useState<number[]>([]);
  const [sortedChords, setSortedChords] = useState([...lyric.chords]);

  useEffect(() => {
    const actualChordPositions = sortedChords.map((chord) => chord.position);
    const totalPositions = [1, 2, 3, 4, 5];
    const noChords = totalPositions.filter(
      (position) => !actualChordPositions.includes(position),
    );
    setNoChordsPosition(noChords);
  }, [sortedChords]);

  /* useEffect(() => {
    const sorted = [...lyric.chords].sort((a, b) => a.position - b.position);
    setSortedChords(sorted);

  }, []); */

  return (
    <div className="group flex flex-col rounded-md p-3 duration-100 hover:shadow-md">
      <div className="grid w-full grid-cols-5 grid-rows-1 gap-1">
        {lyric.chords &&
          lyric.chords.length > 0 &&
          sortedChords.map((chord) => (
            <ChordCard
              key={chord.id}
              chord={chord}
              allChordsState={{
                sortedChords,
                setSortedChords,
              }}
            />
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
