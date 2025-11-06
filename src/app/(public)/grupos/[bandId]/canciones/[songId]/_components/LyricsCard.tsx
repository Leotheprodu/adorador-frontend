import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
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
  transpose = 0,
  showChords = true,
  lyricsScale = 1,
}: {
  lyric: LyricsProps;
  refetchLyricsOfCurrentSong: () => void;
  params: { bandId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsOfCurrentSong: LyricsProps[];
  transpose?: number;
  showChords?: boolean;
  lyricsScale?: number;
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
      className={`group relative flex flex-col items-start justify-center rounded-lg p-3 duration-100 hover:bg-slate-50 lyric-card${lyric.id}`}
    >
      {/* Chords Section - Only show if showChords is true */}
      {showChords && (
        <div
          className="grid grid-cols-5 gap-1"
          style={{ fontSize: `${lyricsScale * 0.9}rem` }}
        >
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
                  transpose={transpose}
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
      )}

      {/* Lyrics Section */}
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
          style={{ fontSize: `${lyricsScale}rem` }}
          className="w-full text-left font-medium leading-relaxed text-slate-800 transition-all duration-100 hover:text-slate-900 hover:underline"
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
