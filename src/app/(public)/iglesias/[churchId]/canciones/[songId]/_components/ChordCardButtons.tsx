import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@global/icons/ArrowRightIcon';
import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';
import {
  changeChordPositionService,
  deleteChordService,
} from '../_services/songIdServices';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { ChordProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';

export const ChordCardButtons = ({
  chord,
  params,
  lyricId,
  allChordsState,
}: {
  chord: ChordProps;
  params: { churchId: string; songId: string };
  lyricId: number;
  allChordsState: {
    sortedChords: ChordProps[];
    setSortedChords: React.Dispatch<React.SetStateAction<ChordProps[]>>;
  };
}) => {
  const { sortedChords, setSortedChords } = allChordsState;

  const {
    mutate,
    isPending: isPendingChangeChordPosition,
    status: statusChangeChordPosition,
  } = changeChordPositionService({
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
    if (statusChangeChordPosition === 'error') {
      toast.error(
        'El acorde no se pudo actualizar, intente de nuevo mas tarde',
      );
    }
  }, [statusChangeChordPosition]);
  useEffect(() => {
    if (statusDeleteChord === 'error') {
      toast.error('El acorde no se pudo eliminar, intente de nuevo mas tarde');
    } else if (statusDeleteChord === 'success') {
      setSortedChords(sortedChords.filter((c) => c.id !== chord.id));
      toast.success('Acorde eliminado');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusDeleteChord]);

  const handleClickLeft = () => {
    const newPosition = chord.position - 1;
    if (newPosition < 1) return;

    const chordWithSameNewPosition = sortedChords.find(
      (c) => c.position === newPosition,
    );
    console.log(chordWithSameNewPosition);
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
    console.log(chordWithSameNewPosition);
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
            disabled={isPendingChangeChordPosition}
            onClick={handleClickLeft}
            className="p-1"
          >
            <ArrowLeftIcon className="text-primary-500" />
          </button>
          <button
            disabled={isPendingChangeChordPosition}
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
  );
};
