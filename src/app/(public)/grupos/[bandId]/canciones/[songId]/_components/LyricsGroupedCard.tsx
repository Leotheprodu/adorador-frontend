import { structureColors, structureLib } from '@global/config/constants';
import React, { useEffect, useState } from 'react';
import { LyricsCard } from './LyricsCard';
import { AddOrUpdateLyricForm } from './AddOrUpdateLyricForm';
import { AddSongIcon } from '@global/icons/AddSongIcon';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';

export const LyricsGroupedCard = ({
  structure,
  lyrics,
  refetchLyricsOfCurrentSong,
  params,
  chordPreferences,
  lyricsOfCurrentSong,
  transpose = 0,
  showChords = true,
  lyricsScale = 1,
}: {
  structure: string;
  lyrics: LyricsProps[];
  refetchLyricsOfCurrentSong: () => void;
  params: { bandId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsOfCurrentSong: LyricsProps[];
  transpose?: number;
  showChords?: boolean;
  lyricsScale?: number;
}) => {
  const [addNewLyric, setAddNewLyric] = useState(false);
  const [newPosition, setNewPosition] = useState(1);

  useEffect(() => {
    if (lyrics.length > 0) {
      setNewPosition(lyrics[lyrics.length - 1].position + 1);
    }
  }, [lyrics]);

  return (
    <div
      className="w-full border-l-4 py-4 pl-4"
      style={{
        borderColor: structureColors[structure],
      }}
    >
      <h2
        className="mb-6 text-left text-2xl font-bold"
        style={{
          color: structureColors[structure],
        }}
      >
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
          transpose={transpose}
          showChords={showChords}
          lyricsScale={lyricsScale}
        />
      ))}
      <div className="mt-5">
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
            className="group flex items-center gap-2 rounded-xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:scale-105 hover:bg-gradient-to-r hover:from-brand-purple-50 hover:to-brand-blue-50 hover:shadow-md hover:ring-brand-purple-200 active:scale-95"
          >
            <AddSongIcon className="h-5 w-5 text-brand-purple-600 transition-transform group-hover:rotate-90" />
            <span className="text-sm font-semibold text-brand-purple-700">
              Agregar línea de letra
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
