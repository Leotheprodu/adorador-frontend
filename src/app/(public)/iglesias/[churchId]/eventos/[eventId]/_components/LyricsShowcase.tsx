import { useEffect, useState } from 'react';
import {
  EventSongsProps,
  LyricsProps,
} from '../../_interfaces/eventsInterface';
import { lyricSelectedProps } from '@stores/event';
export const LyricsShowcase = ({
  lyricsShowcaseProps,
}: {
  lyricsShowcaseProps: {
    isFullscreen: boolean;
    selectedSongData: EventSongsProps | undefined;
    lyricSelected: lyricSelectedProps;
  };
}) => {
  const { isFullscreen, selectedSongData, lyricSelected } = lyricsShowcaseProps;
  const [dataOfLyricSelected, setDataOfLyricSelected] = useState<LyricsProps>();
  useEffect(() => {
    if (
      selectedSongData &&
      lyricSelected.index <= selectedSongData?.song.lyrics.length
    ) {
      setDataOfLyricSelected(
        selectedSongData?.song.lyrics[lyricSelected.index - 1],
      );
    } else {
      setDataOfLyricSelected(undefined);
    }
  }, [lyricSelected, selectedSongData]);
  return (
    <div className="flex flex-col items-center">
      {lyricSelected.index > 0 && (
        <div className="flex flex-col items-center">
          {dataOfLyricSelected?.lyrics === '' && (
            <h1 className="text-center text-3xl">
              ({dataOfLyricSelected?.structure.title})
            </h1>
          )}
          <div className="grid w-full grid-cols-5 gap-4">
            {dataOfLyricSelected?.chords.map((chord) => (
              <div
                key={chord.id}
                style={{
                  gridColumnStart: chord.position,
                  gridColumnEnd: chord.position + 1,
                }}
                className={`col-span-1 w-10`}
              >
                <h2
                  className={`text-lg md:text-xl lg:text-2xl ${isFullscreen ? 'lg:text-6xl' : ''}`}
                >{`${chord.rootNote}${chord.chordQuality}${chord.slashChord ? '/' + chord.slashChord + chord.slashQuality : ''}`}</h2>
              </div>
            ))}
          </div>
          <h1
            className={`text-xl md:text-2xl lg:text-4xl ${isFullscreen ? 'lg:text-7xl' : ''}`}
          >
            {dataOfLyricSelected?.lyrics}
          </h1>
        </div>
      )}
    </div>
  );
};
