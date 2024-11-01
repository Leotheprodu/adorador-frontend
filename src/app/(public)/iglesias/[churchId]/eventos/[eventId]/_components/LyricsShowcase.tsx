import { useStore } from '@nanostores/react';
import { LyricsShowcaseCard } from './LyricsShowcaseCard';
import { AnimatePresence, motion } from 'framer-motion';
import { $lyricSelected } from '@stores/event';
import { structureLib } from '@global/config/constants';
import { useDataOfLyricSelected } from '../_hooks/useDataOfLyricSelected';

export const LyricsShowcase = ({
  lyricsShowcaseProps,
}: {
  lyricsShowcaseProps: {
    isFullscreen: boolean;
  };
}) => {
  const { isFullscreen } = lyricsShowcaseProps;
  const lyricSelected = useStore($lyricSelected);
  const { dataOfLyricSelected } = useDataOfLyricSelected({ lyricSelected });

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col">
      <AnimatePresence>
        <div className="absolute top-20 z-0 w-full -translate-y-1/2 transform text-white/10">
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
              style={{
                filter: 'blur(6px)',
              }}
            >
              <LyricsShowcaseCard
                lyricsShowcaseCardProps={{
                  isFullscreen,
                  lyricSelected: {
                    ...lyricSelected,
                    position: lyricSelected.position - 1,
                  },
                }}
              />
            </motion.div>
          )}
        </div>
      </AnimatePresence>
      {dataOfLyricSelected !== undefined &&
        dataOfLyricSelected.structure.title && (
          <h3
            className={`absolute left-10 top-10 text-center ${isFullscreen ? 'text-xl lg:text-2xl xl:text-3xl' : 'text-base md:text-lg lg:text-xl xl:text-2xl'}`}
          >
            {structureLib[dataOfLyricSelected.structure.title].es}
          </h3>
        )}
      <AnimatePresence>
        <div className="absolute bottom-1/2 w-full translate-y-1/2 transform">
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
          >
            <LyricsShowcaseCard
              lyricsShowcaseCardProps={{
                isFullscreen,
                lyricSelected,
              }}
            />
          </motion.div>
        </div>
      </AnimatePresence>
      <AnimatePresence>
        <div className="absolute bottom-20 z-0 w-full translate-y-1/2 transform text-white/10">
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
            >
              <LyricsShowcaseCard
                lyricsShowcaseCardProps={{
                  isFullscreen,
                  lyricSelected: {
                    ...lyricSelected,
                    position: lyricSelected.position + 1,
                  },
                }}
              />
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};
