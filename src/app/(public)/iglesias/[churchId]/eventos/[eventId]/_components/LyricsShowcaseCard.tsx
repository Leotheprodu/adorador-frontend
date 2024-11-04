import {
  $eventConfig,
  $selectedSongData,
  lyricSelectedProps,
} from '@stores/event';
import { useStore } from '@nanostores/react';
import { useDataOfLyricSelected } from '../_hooks/useDataOfLyricSelected';
import { getNoteByType } from '../_utils/getNoteByType';
export const LyricsShowcaseCard = ({
  lyricsShowcaseCardProps,
}: {
  lyricsShowcaseCardProps: {
    isFullscreen: boolean;
    lyricSelected: lyricSelectedProps;
  };
}) => {
  const { isFullscreen, lyricSelected } = lyricsShowcaseCardProps;
  const eventConfig = useStore($eventConfig);
  const { dataOfLyricSelected } = useDataOfLyricSelected({ lyricSelected });
  const selectedSongData = useStore($selectedSongData);
  return (
    <div className="relative flex w-full flex-col items-center">
      {lyricSelected?.position > 0 && (
        <div className="flex flex-col items-center">
          <div className="grid w-full grid-cols-5 gap-1">
            {eventConfig.showChords &&
              dataOfLyricSelected?.chords.map((chord) => (
                <div
                  key={chord.id}
                  style={{
                    gridColumnStart: chord.position,
                    gridColumnEnd: chord.position + 1,
                  }}
                  className={`col-span-1 w-10`}
                >
                  <h2
                    className={`${isFullscreen ? 'md:text-4xl lg:text-6xl' : 'md:text-2xl lg:text-4xl'} w-full text-center text-lg`}
                  >
                    {`${getNoteByType(chord.rootNote, selectedSongData?.transpose)}${chord.chordQuality}${chord.slashChord ? '/' + getNoteByType(chord.slashChord, selectedSongData?.transpose) + chord.slashQuality : ''}`}
                  </h2>
                </div>
              ))}
          </div>
          <h1
            className={`w-full text-justify text-2xl ${isFullscreen ? 'sm:text-2xl md:text-5xl lg:text-7xl' : 'md:text-4xl lg:text-5xl'}`}
          >
            {dataOfLyricSelected?.lyrics}
          </h1>
        </div>
      )}
    </div>
  );
};
