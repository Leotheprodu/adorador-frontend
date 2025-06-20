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
}: {
  chord: ChordProps;
  lyricId: number;
  params: { bandId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  allChordsState: {
    sortedChords: ChordProps[];
    setSortedChords: React.Dispatch<React.SetStateAction<ChordProps[]>>;
  };
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
        className="flex h-10 w-10 cursor-pointer items-end justify-center rounded-md border-primary-500 hover:border-1"
      >
        <div className="flex justify-center">
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
            <p className="w-full text-center">
              {getNoteByType(chord.slashChord, 0, chordPreferences)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
