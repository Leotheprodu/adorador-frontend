import { getNoteByType } from '@iglesias/[churchId]/eventos/[eventId]/_utils/getNoteByType';
import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';
import { $chordPreferences } from '@stores/event';
import React from 'react';

export const LyricsCard = ({ lyric }: { lyric: LyricsProps }) => {
  const chordPreferences = useStore($chordPreferences);
  return (
    <div className="flex flex-col">
      <div className="grid w-full grid-cols-5 grid-rows-1 gap-1">
        {lyric.chords && lyric.chords.length > 0 ? (
          lyric.chords
            .sort((a, b) => a.position - b.position)
            .map((chord) => (
              <div
                key={chord.id}
                style={{
                  gridColumnStart: chord.position,
                  gridColumnEnd: chord.position + 1,
                }}
                className={`flex h-10 w-10 items-center justify-center gap-1`}
              >
                <div className="flex items-end justify-center">
                  <p className={`w-full text-center`}>
                    {getNoteByType(chord.rootNote, 0, chordPreferences)}
                  </p>
                  <p className={`w-full text-center text-slate-400`}>
                    {chord.chordQuality}
                  </p>
                </div>
                {chord.slashChord && (
                  <>
                    <p className={`w-full text-center text-slate-600`}>/</p>
                    <div className="flex items-end justify-center">
                      <p className={`w-full text-center`}>
                        {getNoteByType(chord.slashChord, 0, chordPreferences)}
                      </p>
                      <p className={`w-full text-center text-slate-400`}>
                        {chord.slashQuality}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))
        ) : (
          <div
            className={`col-span-1 flex h-10 w-10 items-center justify-center gap-1`}
          ></div>
        )}
      </div>
      <h1 className={`w-full`}>{lyric.lyrics}</h1>
    </div>
  );
};
