import { useStore } from '@nanostores/react';
import { LyricsShowcaseCard } from '@bands/[bandId]/eventos/[eventId]/_components/LyricsShowcaseCard';
import { AnimatePresence, motion } from 'framer-motion';
import { $eventConfig, $lyricSelected } from '@stores/event';

export const LyricsShowcase = ({
  lyricsShowcaseProps,
}: {
  lyricsShowcaseProps: {
    isFullscreen: boolean;
  };
}) => {
  const { isFullscreen } = lyricsShowcaseProps;
  const lyricSelected = useStore($lyricSelected);
  /*  const songData = useStore($selectedSongData); */
  const eventConfig = useStore($eventConfig);

  return (
    <div
      style={{
        scale: isFullscreen
          ? eventConfig.lyricsScale * 1
          : eventConfig.lyricsScale * 0.95,
      }}
      className="absolute inset-0 flex h-full w-full flex-col"
    >
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
            <LyricsShowcaseCard
              lyricsShowcaseCardProps={{
                isFullscreen,
                lyricSelected: {
                  ...lyricSelected,
                  position: lyricSelected.position + 1,
                },
              }}
            />
            <LyricsShowcaseCard
              lyricsShowcaseCardProps={{
                isFullscreen,
                lyricSelected: {
                  ...lyricSelected,
                  position: lyricSelected.position + 2,
                },
              }}
            />
            <LyricsShowcaseCard
              lyricsShowcaseCardProps={{
                isFullscreen,
                lyricSelected: {
                  ...lyricSelected,
                  position: lyricSelected.position + 3,
                },
              }}
            />
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};
