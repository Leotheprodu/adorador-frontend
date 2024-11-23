import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@global/icons/ArrowRightIcon';
import { getNoteByType } from '@iglesias/[churchId]/eventos/[eventId]/_utils/getNoteByType';
import { ChordProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  changeChordPositionService,
  deleteChordService,
} from '../_services/songIdServices';
import toast from 'react-hot-toast';
import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';
export const ChordCard = ({
  chord,
  allChordsState,
  chordPreferences,
  lyricId,
  params,
}: {
  chord: ChordProps;
  lyricId: number;
  params: { churchId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  allChordsState: {
    sortedChords: ChordProps[];
    setSortedChords: React.Dispatch<React.SetStateAction<ChordProps[]>>;
  };
}) => {
  const { sortedChords, setSortedChords } = allChordsState;
  const [showButtons, setShowButtons] = useState(false);
  const { mutate, isPending, status } = changeChordPositionService({
    params,
    lyricId,
    chordId: chord.id,
  });
  const {
    mutate: mutateDeleteChord,
    isPending: isPendingDeleteChord,
    status: statusDeleteChord,
  } = deleteChordService({
    params,
    lyricId,
    chordId: chord.id,
  });

  useEffect(() => {
    if (status === 'error') {
      toast.error(
        'El acorde no se pudo actualizar, intente de nuevo mas tarde',
      );
    }
  }, [status]);
  useEffect(() => {
    if (statusDeleteChord === 'error') {
      toast.error('El acorde no se pudo eliminar, intente de nuevo mas tarde');
    } else if (statusDeleteChord === 'success') {
      setSortedChords(sortedChords.filter((c) => c.id !== chord.id));
      toast.success('Acorde eliminado');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusDeleteChord]);

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

  const handleClickLeft = () => {
    const newPosition = chord.position - 1;
    if (newPosition < 1) return;

    const chordWithSameNewPosition = sortedChords.find(
      (c) => c.position === newPosition,
    );
    if (chordWithSameNewPosition) return;

    const newArray = sortedChords.map((c) => {
      if (c.id === chord.id) {
        return { ...c, position: newPosition };
      }
      return c;
    });
    mutate({ position: newPosition });
    setSortedChords(newArray);
  };

  const handleClickRight = () => {
    const newPosition = chord.position + 1;
    if (newPosition > 5) return;

    const chordWithSameNewPosition = sortedChords.find(
      (c) => c.position === newPosition,
    );
    if (chordWithSameNewPosition) return;

    const newArray = sortedChords.map((c) => {
      if (c.id === chord.id) {
        return { ...c, position: newPosition };
      }
      return c;
    });
    mutate({ position: newPosition });
    setSortedChords(newArray);
  };

  const handleDeleteChord = () => {
    mutateDeleteChord(null);
  };
  return (
    <div className={`chord-card${chord.id} relative`}>
      {showButtons && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 transform"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex gap-2"
            >
              <button
                disabled={isPending}
                onClick={handleClickLeft}
                className="p-1"
              >
                <ArrowLeftIcon className="text-primary-500" />
              </button>
              <button
                disabled={isPending}
                onClick={handleClickRight}
                className="p-1"
              >
                <ArrowRightIcon className="text-primary-500" />
              </button>
              <button
                disabled={isPendingDeleteChord}
                onClick={handleDeleteChord}
                className="p-1"
              >
                <DeleteMusicIcon className="text-danger-500" />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
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
