import { ChordProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { getNoteByType } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/getNoteByType';
import { useStore } from '@nanostores/react';

interface ChordDisplayProps {
  chords: ChordProps[];
  transpose: number;
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsScale: number;
}

export const ChordDisplay = ({
  chords,
  transpose,
  chordPreferences,
  lyricsScale,
}: ChordDisplayProps) => {
  return (
    <div
      className="grid grid-cols-5 gap-1"
      style={{ fontSize: `${lyricsScale * 0.9}rem` }}
    >
      {chords
        .sort((a, b) => a.position - b.position)
        .map((chord) => (
          <div
            key={chord.id}
            style={{
              gridColumnStart: chord.position,
              gridColumnEnd: chord.position + 1,
            }}
            className="col-span-1 flex items-end gap-1"
          >
            <div className="flex items-baseline">
              <span className="font-semibold text-primary-600">
                {getNoteByType(chord.rootNote, transpose, chordPreferences)}
                {chord.chordQuality}
              </span>
              {chord.slashChord && (
                <span className="font-semibold text-primary-600">
                  /
                  {getNoteByType(chord.slashChord, transpose, chordPreferences)}
                </span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
