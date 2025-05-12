import { structureColors, structureLib } from '@global/config/constants';
import React, { useEffect, useState } from 'react';
import { LyricsCard } from './LyricsCard';
import { AddOrUpdateLyricForm } from './AddOrUpdateLyricForm';
import { AddSongIcon } from '@global/icons/AddSongIcon';
import { LyricsProps } from '@app/(public)/grupos/[churchId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';
import { Button } from '@nextui-org/react';

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

  return (
    <div
      style={{
        backgroundColor: structureColors[structure],
      }}
      className="w-[25rem] rounded-lg p-4"
    >
      <h2 className="text-center text-2xl font-bold text-slate-600">
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
          <Button
            variant="light"
            color="primary"
            startContent={<AddSongIcon />}
            onClick={() => setAddNewLyric(true)}
            className="text-2xl"
          >
            Agregar letra
          </Button>
        )}
      </div>
    </div>
  );
};
