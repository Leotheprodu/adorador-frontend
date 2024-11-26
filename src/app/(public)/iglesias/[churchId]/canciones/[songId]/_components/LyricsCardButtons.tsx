import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';
import { AnimatePresence, motion } from 'framer-motion';
import {
  deleteLyricService,
  updateLyricsPositionsService,
} from '../_services/songIdServices';
import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const LyricsCardButtons = ({
  lyric,
  params,
  lyricsOfCurrentSong,
  refetchLyricsOfCurrentSong,
}: {
  lyric: LyricsProps;
  params: { churchId: string; songId: string };
  lyricsOfCurrentSong: LyricsProps[];
  refetchLyricsOfCurrentSong: () => void;
}) => {
  const {
    mutate: mutateDeleteLyric,
    isPending: isPendingDeleteLyric,
    status: statusDeleteLyric,
  } = deleteLyricService({
    params,
    lyricId: lyric.id,
  });
  const {
    mutate: mutateUpdateLyricsPositions,
    isPending: isPendingUpdateLyricsPositions,
    status: statusUpdateLyricsPositions,
  } = updateLyricsPositionsService({ params });

  useEffect(() => {
    if (statusUpdateLyricsPositions === 'success') {
      refetchLyricsOfCurrentSong();
      toast.success('Letra eliminada');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdateLyricsPositions]);

  useEffect(() => {
    if (statusDeleteLyric === 'success') {
      const newLyrics = [...lyricsOfCurrentSong].sort(
        (a, b) => a.position - b.position,
      );
      const newPositionOfLyrics = newLyrics.map((lyrics) => {
        if (lyrics.position > lyric.position) {
          return { id: lyrics.id, position: lyrics.position - 1 };
        }
      });
      if (newPositionOfLyrics && newPositionOfLyrics.length > 0) {
        const filteredNewPositionOfLyrics = newPositionOfLyrics.filter(
          (lyric) => lyric !== undefined,
        ) as { id: number; position: number }[];
        mutateUpdateLyricsPositions(filteredNewPositionOfLyrics);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusDeleteLyric]);
  const handleDeleteLyric = () => {
    mutateDeleteLyric(null);
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        className="absolute -right-8 top-3 transform rounded-br-lg rounded-tr-lg bg-slate-100 py-5 pl-3"
      >
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex gap-2"
        >
          <button
            disabled={isPendingDeleteLyric || isPendingUpdateLyricsPositions}
            onClick={handleDeleteLyric}
            className="p-1"
          >
            <DeleteMusicIcon className="text-danger-500" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
