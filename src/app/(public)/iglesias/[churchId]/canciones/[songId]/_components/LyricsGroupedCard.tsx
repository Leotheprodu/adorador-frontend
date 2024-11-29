import { structureLib } from '@global/config/constants';
import React, { useEffect, useState } from 'react';
import { LyricsCard } from './LyricsCard';
import { AddOrUpdateLyricForm } from './AddOrUpdateLyricForm';
import { AddSongIcon } from '@global/icons/AddSongIcon';
import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';

export const LyricsGroupedCard = ({
  structure,
  lyrics,
  refetchLyricsOfCurrentSong,
  params,
  chordPreferences,
  lyricsOfCurrentSong,
}: {
  structure: string;
  lyrics: LyricsProps[];
  refetchLyricsOfCurrentSong: () => void;
  params: { churchId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsOfCurrentSong: LyricsProps[];
}) => {
  const [addNewLyric, setAddNewLyric] = useState(false);
  const [newPosition, setNewPosition] = useState(1);

  useEffect(() => {
    if (lyrics.length > 0) {
      setNewPosition(lyrics[lyrics.length - 1].position + 1);
    }
  }, [lyrics]);

  const structureColors: { [key: string]: string } = {
    intro: '#CCFFDD', // slightly darker green
    verse: '#FFE6E6', // light red
    'pre-chorus': '#FFE6F2', // light pink
    chorus: '#FFEED6', // light orange
    bridge: '#FFFFE6', // light yellow
    outro: '#E6F2FF', // light blue
    preChorus: '#F2E6FF', // light purple
    interlude: '#FFE6FF', // light magenta
    solo: '#B3FFB3', // darker lime
    // Add more structures and colors as needed
  };

  return (
    <div
      style={{
        backgroundColor: structureColors[structure],
      }}
      className="min-w-[20rem] rounded-lg p-4"
    >
      <h2 className="text-center text-lg text-slate-600">
        {structureLib[structure].es}
      </h2>
      {lyrics.map((lyric) => (
        <LyricsCard
          key={lyric.id}
          lyric={lyric}
          refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
          params={params}
          chordPreferences={chordPreferences}
          lyricsOfCurrentSong={lyricsOfCurrentSong}
        />
      ))}
      <div className="mt-5 max-w-screen-sm">
        {addNewLyric ? (
          <AddOrUpdateLyricForm
            LyricsOfCurrentSong={lyricsOfCurrentSong}
            params={params}
            refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
            setAddNewLyric={setAddNewLyric}
            newPosition={newPosition}
            type="add"
          />
        ) : (
          <button
            onClick={() => setAddNewLyric(true)}
            className="flex items-center gap-2 duration-200 hover:underline"
          >
            <AddSongIcon /> Agregar Letra
          </button>
        )}
      </div>
    </div>
  );
};
