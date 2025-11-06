import {
  $eventConfig,
  $selectedSongData,
  lyricSelectedProps,
  $chordPreferences,
} from '@stores/event';
import { useStore } from '@nanostores/react';
import { useDataOfLyricSelected } from '@bands/[bandId]/eventos/[eventId]/_hooks/useDataOfLyricSelected';
import { getNoteByType } from '@bands/[bandId]/eventos/[eventId]/_utils/getNoteByType';
import { structureColors, structureLib } from '@global/config/constants';
export const LyricsShowcaseCard = ({
  lyricsShowcaseCardProps,
}: {
  lyricsShowcaseCardProps: {
    isFullscreen: boolean;
    lyricSelected: lyricSelectedProps;
    showStructureName?: boolean;
  };
}) => {
  const {
    isFullscreen,
    lyricSelected,
    showStructureName = false,
  } = lyricsShowcaseCardProps;
  const chordPreferences = useStore($chordPreferences);
  const eventConfig = useStore($eventConfig);
  const { dataOfLyricSelected } = useDataOfLyricSelected({ lyricSelected });
  const selectedSongData = useStore($selectedSongData);
  return (
    <div
      style={{
        ...(eventConfig.showStructure && {
          borderColor:
            structureColors[dataOfLyricSelected?.structure.title || 'verse'],
        }),
      }}
      className={`relative flex w-full flex-col items-center ${isFullscreen ? 'p-4 lg:p-6' : 'p-1 lg:p-2'} ${eventConfig.showStructure ? 'border-x-4' : ''}`}
    >
      {lyricSelected?.position > 0 && (
        <div className="flex w-full flex-col items-center justify-center">
          {/* Nombre de la estructura */}
          {eventConfig.showStructure &&
            dataOfLyricSelected &&
            showStructureName && (
              <div className="mb-1 flex w-full justify-start">
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
                  className={`rounded border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-md ${isFullscreen ? 'text-sm' : 'text-xs'}`}
                >
                  {structureLib[dataOfLyricSelected.structure.title]?.es ||
                    dataOfLyricSelected.structure.title}
                </span>
              </div>
            )}
          <div>
            <div className="grid grid-cols-5">
              {eventConfig.showChords &&
                dataOfLyricSelected?.chords
                  .sort((a, b) => a.position - b.position)
                  .map((chord) => (
                    <div
                      key={chord.id}
                      style={{
                        gridColumnStart: chord.position,
                        gridColumnEnd: chord.position + 1,
                      }}
                      className={`${chord.slashChord && 'rounded-md border-1 p-1'} col-span-1 flex items-center justify-center gap-1`}
                    >
                      <div className="flex items-end justify-center">
                        <p
                          className={`${isFullscreen ? 'md:text-xl lg:text-2xl' : 'md:text-lg lg:text-xl'} w-full text-center text-base`}
                        >
                          {getNoteByType(
                            chord.rootNote,
                            selectedSongData?.transpose,
                            chordPreferences,
                          )}
                        </p>
                        <p
                          className={`text-slate-50 ${isFullscreen ? 'md:text-xl lg:text-2xl' : 'md:text-lg lg:text-xl'} w-full text-center text-base`}
                        >
                          {chord.chordQuality}
                        </p>
                      </div>
                      {chord.slashChord && (
                        <>
                          <div className="flex items-end justify-center rounded-sm bg-slate-300 px-3 text-primary-500">
                            <p
                              className={`${isFullscreen ? 'md:text-xl lg:text-2xl' : 'md:text-lg lg:text-xl'} w-full text-center text-base`}
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
            <h1
              style={{
                color:
                  structureColors[
                    dataOfLyricSelected?.structure.title || 'verse'
                  ],
                filter: 'brightness(1.5)',
              }}
              className={`w-full text-center text-3xl ${isFullscreen ? 'sm:text-xl md:text-3xl lg:text-4xl' : 'text-base md:text-lg lg:text-xl'}`}
            >
              {dataOfLyricSelected?.lyrics}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};
