import { useStore } from '@nanostores/react';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { LyricsShowcaseCard } from './LyricsShowcaseCard';
import { AnimatePresence, motion } from 'framer-motion';
import { $lyricSelected } from '@stores/event';

export const LyricsShowcase = ({
  lyricsShowcaseProps,
}: {
  lyricsShowcaseProps: {
    isFullscreen: boolean;
    selectedSongData: EventSongsProps | undefined;
  };
}) => {
  const { isFullscreen, selectedSongData } = lyricsShowcaseProps;
  const lyricSelected = useStore($lyricSelected);
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col">
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            key={lyricSelected.position - 1}
            initial={{
              opacity: 0,
              y: lyricSelected.action === 'backward' ? -300 : 300,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: lyricSelected.action === 'forward' ? -300 : 300,
            }}
            transition={{
              opacity: { duration: 0.3 },
              y: { duration: 0.4 },
            }}
            className="pointer-events-none absolute top-20 z-0 w-full text-center text-2xl text-white/10"
            style={{
              filter: 'blur(6px)',
            }}
          >
            <LyricsShowcaseCard
              lyricsShowcaseCardProps={{
                isFullscreen,
                selectedSongData,
                lyricSelected: {
                  ...lyricSelected,
                  position: lyricSelected.position - 1,
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          key={lyricSelected.position}
          initial={{
            opacity: 0,
            y: lyricSelected.action === 'backward' ? -200 : 200,
          }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: lyricSelected.action === 'forward' ? -200 : 200,
          }}
          transition={{ opacity: { duration: 0.2 }, y: { duration: 0.5 } }}
          className="pointer-events-none absolute bottom-1/2 w-full text-center text-2xl text-white"
        >
          <LyricsShowcaseCard
            lyricsShowcaseCardProps={{
              isFullscreen,
              selectedSongData,
              lyricSelected,
            }}
          />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {isFullscreen && lyricSelected.position !== 0 && (
          <motion.div
            key={lyricSelected.position + 1}
            initial={{
              opacity: 0,
              y: lyricSelected.action === 'backward' ? -300 : 300,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: lyricSelected.action === 'forward' ? -300 : 300,
            }}
            transition={{
              opacity: { duration: 0.3 },
              y: { duration: 0.4 },
            }}
            className="pointer-events-none absolute bottom-20 z-0 w-full text-center text-2xl text-white/10"
          >
            <LyricsShowcaseCard
              lyricsShowcaseCardProps={{
                isFullscreen,
                selectedSongData,
                lyricSelected: {
                  ...lyricSelected,
                  position: lyricSelected.position + 1,
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
