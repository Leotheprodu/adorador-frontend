import { useStore } from '@nanostores/react';
import { LyricsShowcaseCard } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/LyricsShowcaseCard';
import { NextLinePreview } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/NextLinePreview';
import { AnimatePresence, motion } from 'framer-motion';
import { $eventConfig, $lyricSelected, $selectedSongData } from '@stores/event';
import { useMemo } from 'react';

export const LyricsShowcase = ({
  lyricsShowcaseProps,
}: {
  lyricsShowcaseProps: {
    isFullscreen: boolean;
  };
}) => {
  const { isFullscreen } = lyricsShowcaseProps;
  const lyricSelected = useStore($lyricSelected);
  const selectedSongData = useStore($selectedSongData);
  const eventConfig = useStore($eventConfig);

  // Detectar qué líneas deben mostrarse y cuáles deben mostrar el nombre de la estructura
  const visibleLyricsData = useMemo(() => {
    if (!selectedSongData) return [];

    // Obtener todas las letras que realmente existen desde la posición actual
    const availableLyrics = selectedSongData.song.lyrics
      .filter((l) => l.position >= lyricSelected.position)
      .sort((a, b) => a.position - b.position)
      .slice(0, 4); // Máximo 4 líneas

    return availableLyrics.map((lyric, index) => {
      const previousLyric = selectedSongData.song.lyrics.find(
        (l) => l.position === lyric.position - 1,
      );

      return {
        position: lyric.position,
        // Mostrar el nombre si es la primera línea visible o si cambia la estructura
        showStructureName:
          index === 0 ||
          !previousLyric ||
          lyric.structure.title !== previousLyric.structure.title,
      };
    });
  }, [selectedSongData, lyricSelected.position]);

  // Buscar la siguiente línea que se mostrará cuando se avance
  const nextLine = useMemo(() => {
    if (!selectedSongData || !isFullscreen) return null;

    // Obtener las letras visibles actuales usando la misma lógica que visibleLyricsData
    const availableLyrics = selectedSongData.song.lyrics
      .filter((l) => l.position >= lyricSelected.position)
      .sort((a, b) => a.position - b.position)
      .slice(0, 4);

    if (availableLyrics.length === 0) return null;

    // Obtener la última letra visible
    const lastVisibleLyric = availableLyrics[availableLyrics.length - 1];

    // Buscar la siguiente línea después de la última visible
    const nextLyric = selectedSongData.song.lyrics.find(
      (l) => l.position === lastVisibleLyric.position + 1,
    );

    // Retornar la siguiente línea si existe
    return nextLyric || null;
  }, [selectedSongData, lyricSelected.position, isFullscreen]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <AnimatePresence>
        <div className="flex w-full items-center justify-center">
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
            className="flex flex-col"
          >
            {/* Renderizar solo las líneas que realmente existen */}
            {visibleLyricsData.map((lyricData) => (
              <LyricsShowcaseCard
                key={lyricData.position}
                lyricsShowcaseCardProps={{
                  isFullscreen,
                  lyricSelected: {
                    ...lyricSelected,
                    position: lyricData.position,
                  },
                  showStructureName: lyricData.showStructureName,
                  lyricsScale: eventConfig.lyricsScale * 1,
                }}
              />
            ))}

            {/* Vista previa de la siguiente línea (solo en fullscreen) */}
            {nextLine && eventConfig.showStructure && (
              <NextLinePreview nextLine={nextLine} />
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};
