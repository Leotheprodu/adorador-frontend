import { getNoteByType } from '@bands/[bandId]/eventos/[eventId]/_utils/getNoteByType';
import { ChordProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { ChordCardButtons } from './ChordCardButtons';
export const ChordCard = ({
  chord,
  allChordsState,
  chordPreferences,
  lyricId,
  params,
  transpose = 0,
}: {
  chord: ChordProps;
  lyricId: number;
  params: { bandId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  allChordsState: {
    sortedChords: ChordProps[];
    setSortedChords: React.Dispatch<React.SetStateAction<ChordProps[]>>;
  };
  transpose?: number;
}) => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (!showButtons) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      const formElement = document.querySelector(`.chord-card${chord.id}`);
      if (formElement && !formElement.contains(event.target as Node)) {
        setShowButtons(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showButtons]);

  return (
    <div className={`chord-card${chord.id} relative`}>
      {showButtons && (
        <ChordCardButtons
          chord={chord}
          params={params}
          lyricId={lyricId}
          allChordsState={allChordsState}
        />
      )}
      <div
        key={chord.id}
        style={{
          gridColumnStart: chord.position,
          gridColumnEnd: chord.position + 1,
          gridRowStart: 1,
        }}
        onClick={() => {
          setShowButtons(!showButtons);
        }}
        className="flex h-5 cursor-pointer items-center justify-center rounded-md border-primary-500 hover:border-1"
      >
        <div className="flex items-baseline">
          <span className="font-bold text-brand-purple-700">
            {getNoteByType(chord.rootNote, transpose, chordPreferences)}
          </span>
          <span className="ml-0.5 text-xs text-slate-500">
            {chord.chordQuality}
          </span>
          {chord.slashChord && (
            <>
              <span className="mx-0.5 text-slate-600">/</span>
              <span className="font-bold text-brand-purple-700">
                {getNoteByType(chord.slashChord, transpose, chordPreferences)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
