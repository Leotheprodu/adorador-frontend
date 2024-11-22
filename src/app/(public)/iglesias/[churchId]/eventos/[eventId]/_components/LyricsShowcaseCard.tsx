import {
  $eventConfig,
  $selectedSongData,
  lyricSelectedProps,
  $chordPreferences,
} from '@stores/event';
import { useStore } from '@nanostores/react';
import { useDataOfLyricSelected } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useDataOfLyricSelected';
import { getNoteByType } from '@iglesias/[churchId]/eventos/[eventId]/_utils/getNoteByType';
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
    <div className="font-agdasima relative flex w-full flex-col items-center">
      {lyricSelected?.position > 0 && (
        <div className="flex flex-col items-center">
          <div className="grid w-full grid-cols-5 gap-1">
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
                    className={`col-span-1 flex w-10 items-center justify-center gap-1`}
                  >
                    <div className="flex items-end justify-center">
                      <p
                        className={`${isFullscreen ? 'md:text-4xl lg:text-6xl' : 'md:text-2xl lg:text-4xl'} w-full text-center text-lg`}
                      >
                        {getNoteByType(
                          chord.rootNote,
                          selectedSongData?.transpose,
                          chordPreferences,
                        )}
                        {/* {`${getNoteByType(chord.rootNote, selectedSongData?.transpose, chordPreferences)}${chord.chordQuality}${chord.slashChord ? '/' + getNoteByType(chord.slashChord, selectedSongData?.transpose, chordPreferences) + chord.slashQuality : ''}`} */}
                      </p>
                      <p
                        className={`text-slate-400 ${isFullscreen ? 'md:text-3xl lg:text-5xl' : 'md:text-xl lg:text-3xl'} w-full text-center text-base`}
                      >
                        {chord.chordQuality}
                      </p>
                    </div>
                    {chord.slashChord && (
                      <>
                        <p
                          className={`text-slate-600 ${isFullscreen ? 'md:text-4xl lg:text-6xl' : 'md:text-2xl lg:text-4xl'} w-full text-center text-lg`}
                        >
                          /
                        </p>
                        <div className="flex items-end justify-center">
                          <p
                            className={`${isFullscreen ? 'md:text-4xl lg:text-6xl' : 'md:text-2xl lg:text-4xl'} w-full text-center text-lg`}
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
            className={` ${eventConfig.showChords && 'text-slate-200'} w-full text-justify text-3xl ${isFullscreen ? 'sm:text-3xl md:text-6xl lg:text-8xl' : 'md:text-5xl lg:text-6xl'}`}
          >
            {dataOfLyricSelected?.lyrics}
          </h1>
        </div>
      )}
    </div>
  );
};
