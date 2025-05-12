import { LyricsProps } from '@app/(public)/grupos/[churchId]/eventos/_interfaces/eventsInterface';
import React, { useEffect, useState } from 'react';
import { NoChordCard } from './NoChordCard';
import { ChordCard } from './ChordCard';
import { useStore } from '@nanostores/react';
import { AddOrUpdateLyricForm } from './AddOrUpdateLyricForm';
import { LyricsCardButtons } from './LyricsCardButtons';

export const LyricsCard = ({
  lyric,
  refetchLyricsOfCurrentSong,
  params,
  chordPreferences,
  lyricsOfCurrentSong,
}: {
  lyric: LyricsProps;
  refetchLyricsOfCurrentSong: () => void;
  params: { churchId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsOfCurrentSong: LyricsProps[];
}) => {
  const [noChordsPosition, setNoChordsPosition] = useState<number[]>([]);
  const [sortedChords, setSortedChords] = useState([...lyric.chords]);
  const [showButtons, setShowButtons] = useState(false);
  const [updateLyric, setUpdateLyric] = useState(false);
  useEffect(() => {
    setSortedChords([...lyric.chords]);
  }, [lyric.chords]);
  useEffect(() => {
    const actualChordPositions = sortedChords.map((chord) => chord.position);
    const totalPositions = [1, 2, 3, 4, 5];
    const noChords = totalPositions.filter(
      (position) => !actualChordPositions.includes(position),
    );
    setNoChordsPosition(noChords);
  }, [sortedChords]);

  const handleClickLyric = () => {
    setShowButtons(!showButtons);
    setUpdateLyric(!updateLyric);
  };
  return (
    <div
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
      className={`group relative flex min-w-[20rem] flex-col items-center justify-center rounded-md p-3 duration-100 hover:shadow-md lyric-card${lyric.id}`}
    >
      <div className="grid grid-cols-5 grid-rows-1 gap-1">
        {sortedChords &&
          sortedChords.length > 0 &&
          sortedChords
            .sort((a, b) => a.position - b.position)
            .map((chord) => (
              <ChordCard
                key={chord.id}
                chord={chord}
                params={params}
                allChordsState={{
                  sortedChords,
                  setSortedChords,
                }}
                chordPreferences={chordPreferences}
                lyricId={lyric.id}
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
      {updateLyric ? (
        <AddOrUpdateLyricForm
          type="update"
          setAddNewLyric={setUpdateLyric}
          dataOfLyricToUpdate={lyric}
          refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
          params={params}
        />
      ) : (
        <button
          onClick={handleClickLyric}
          className="text-center text-2xl transition-all duration-100 hover:underline"
        >
          {lyric.lyrics}
        </button>
      )}

      {showButtons && (
        <LyricsCardButtons
          lyricsOfCurrentSong={lyricsOfCurrentSong}
          lyric={lyric}
          params={params}
          refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
        />
      )}
    </div>
  );
};
