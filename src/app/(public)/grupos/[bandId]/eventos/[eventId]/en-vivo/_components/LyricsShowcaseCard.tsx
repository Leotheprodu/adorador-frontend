import {
  $eventConfig,
  $selectedSongData,
  lyricSelectedProps,
  $chordPreferences,
} from '@stores/event';
import { useStore } from '@nanostores/react';
import { useDataOfLyricSelected } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useDataOfLyricSelected';
import { getNoteByType } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/getNoteByType';
import { structureColors, structureLib } from '@global/config/constants';
export const LyricsShowcaseCard = ({
  lyricsShowcaseCardProps,
}: {
  lyricsShowcaseCardProps: {
    isFullscreen: boolean;
    lyricSelected: lyricSelectedProps;
    showStructureName?: boolean;
    lyricsScale: number;
  };
}) => {
  const {
    isFullscreen,
    lyricSelected,
    showStructureName = false,
    lyricsScale,
  } = lyricsShowcaseCardProps;
  const chordPreferences = useStore($chordPreferences);
  const eventConfig = useStore($eventConfig);
  const { dataOfLyricSelected } = useDataOfLyricSelected({ lyricSelected });
  const selectedSongData = useStore($selectedSongData);

  // Determinar si se debe centrar todo (cuando estructura y acordes están desactivados)
  const shouldCenter = !eventConfig.showStructure && !eventConfig.showChords;

  return (
    <div
      style={{
        ...(eventConfig.showStructure && {
          borderColor:
            structureColors[dataOfLyricSelected?.structure.title || 'verse'],
        }),
        scale: lyricsScale,
      }}
      className={`relative flex w-full flex-col ${shouldCenter ? 'items-center' : 'items-start'} ${isFullscreen ? 'p-4 lg:p-6' : 'p-1 lg:p-2'} ${eventConfig.showStructure ? 'border-x-4' : ''}`}
    >
      {lyricSelected?.position > 0 && (
        <>
          {/* Nombre de la estructura - completamente a la izquierda */}
          {eventConfig.showStructure &&
            dataOfLyricSelected &&
            showStructureName && (
              <div className="mb-1 flex w-full items-start">
                <span
                  style={{
                    color:
                      structureColors[dataOfLyricSelected.structure.title] ||
                      structureColors.verse,
                    backgroundColor: '#000000',
                    borderColor:
                      structureColors[dataOfLyricSelected.structure.title] ||
                      structureColors.verse,
                  }}
                  className={`rounded border px-3 py-1 font-semibold uppercase tracking-wide shadow-md ${isFullscreen ? 'text-sm' : 'text-xs'}`}
                >
                  {structureLib[dataOfLyricSelected.structure.title]?.es ||
                    dataOfLyricSelected.structure.title}
                </span>
              </div>
            )}
          {/* Contenedor centrado para letras y acordes */}
          <div
            className={`flex w-fit min-w-0 max-w-full flex-col ${shouldCenter ? 'origin-top' : 'origin-top-left'}`}
          >
            {eventConfig.showChords &&
              dataOfLyricSelected?.chords &&
              dataOfLyricSelected.chords.length > 0 && (
                <div className="m-0 grid w-full min-w-0 grid-cols-5 justify-items-start gap-2 p-0">
                  {dataOfLyricSelected.chords
                    .sort((a, b) => a.position - b.position)
                    .map((chord) => (
                      <div
                        key={chord.id}
                        style={{
                          gridColumnStart: chord.position,
                          gridColumnEnd: chord.position + 1,
                        }}
                        className={`${chord.slashChord && 'rounded-md border-1 p-1'} col-span-1 flex items-end gap-1`}
                      >
                        <div className="flex items-end">
                          <p
                            className={`${isFullscreen ? 'md:text-xl lg:text-2xl' : 'md:text-lg lg:text-xl'} text-base`}
                          >
                            {getNoteByType(
                              chord.rootNote,
                              selectedSongData?.transpose,
                              chordPreferences,
                            )}
                          </p>
                          <p
                            className={`text-slate-50 ${isFullscreen ? 'md:text-xl lg:text-2xl' : 'md:text-lg lg:text-xl'} text-base`}
                          >
                            {chord.chordQuality}
                          </p>
                        </div>
                        {chord.slashChord && (
                          <>
                            <div className="flex rounded-sm bg-slate-300 px-3 text-primary-500">
                              <p
                                className={`${isFullscreen ? 'md:text-xl lg:text-2xl' : 'md:text-lg lg:text-xl'} text-base`}
                              >
                                {getNoteByType(
                                  chord.slashChord,
                                  selectedSongData?.transpose,
                                  chordPreferences,
                                )}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}
            <div className="m-0 w-full min-w-0 p-0">
              <h1
                style={{
                  color:
                    structureColors[
                      dataOfLyricSelected?.structure.title || 'verse'
                    ],
                  filter: 'brightness(1.5)',
                }}
                className={`m-0 w-full p-0 ${shouldCenter ? 'text-center' : ''} ${isFullscreen ? 'sm:text-xl md:text-3xl lg:text-4xl' : 'text-base md:text-lg lg:text-xl'}`}
              >
                {dataOfLyricSelected?.lyrics}
              </h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
