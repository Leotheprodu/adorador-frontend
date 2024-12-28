import {
  $eventConfig,
  $selectedSongData,
  lyricSelectedProps,
  $chordPreferences,
} from '@stores/event';
import { useStore } from '@nanostores/react';
import { useDataOfLyricSelected } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useDataOfLyricSelected';
import { getNoteByType } from '@iglesias/[churchId]/eventos/[eventId]/_utils/getNoteByType';
import { structureColors, structureLib } from '@global/config/constants';
export const LyricsShowcaseCard = ({
  lyricsShowcaseCardProps,
}: {
  lyricsShowcaseCardProps: {
    isFullscreen: boolean;
    lyricSelected: lyricSelectedProps;
  };
}) => {
  const { isFullscreen, lyricSelected } = lyricsShowcaseCardProps;
  const chordPreferences = useStore($chordPreferences);
  const eventConfig = useStore($eventConfig);
  const { dataOfLyricSelected } = useDataOfLyricSelected({ lyricSelected });
  const selectedSongData = useStore($selectedSongData);
  return (
    <div className="relative flex w-full flex-col items-center p-2">
      {lyricSelected?.position > 0 && (
        <div className="flex flex-col items-center justify-center">
          {dataOfLyricSelected !== undefined &&
            eventConfig.showStructure &&
            dataOfLyricSelected.structure.title && (
              <h3
                style={{
                  color:
                    structureColors[
                      dataOfLyricSelected?.structure.title || 'verse'
                    ],
                }}
                className={`absolute left-10 top-1/2 -translate-y-1/2 transform text-center ${isFullscreen ? 'text-xl lg:text-2xl xl:text-3xl' : 'text-base md:text-lg lg:text-xl xl:text-2xl'}`}
              >
                {structureLib[dataOfLyricSelected.structure.title].es}
              </h3>
            )}
          <div className="grid w-full grid-cols-5 rounded-md bg-slate-900/80">
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
                        className={`${isFullscreen ? 'md:text-4xl lg:text-6xl' : 'md:text-lg lg:text-xl'} w-full text-center text-base`}
                      >
                        {getNoteByType(
                          chord.rootNote,
                          selectedSongData?.transpose,
                          chordPreferences,
                        )}
                      </p>
                      <p
                        className={`text-slate-50 ${isFullscreen ? 'md:text-3xl lg:text-5xl' : 'md:text-lg lg:text-xl'} w-full text-center text-base`}
                      >
                        {chord.chordQuality}
                      </p>
                    </div>
                    {chord.slashChord && (
                      <>
                        <div className="flex items-end justify-center rounded-sm bg-slate-300 px-3 text-primary-500">
                          <p
                            className={`${isFullscreen ? 'md:text-4xl lg:text-6xl' : 'md:text-lg lg:text-xl'} w-full text-center text-base`}
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
            }}
            className={`w-full text-justify text-3xl ${isFullscreen ? 'sm:text-3xl md:text-6xl lg:text-8xl' : 'text-base md:text-lg lg:text-xl'}`}
          >
            {dataOfLyricSelected?.lyrics}
          </h1>
        </div>
      )}
    </div>
  );
};
