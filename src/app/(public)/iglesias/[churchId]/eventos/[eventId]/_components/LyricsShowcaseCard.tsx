import { useEffect, useState } from 'react';
import {
  EventSongsProps,
  LyricsProps,
} from '../../_interfaces/eventsInterface';
import { $eventConfig, lyricSelectedProps } from '@stores/event';
import { structureLib } from '@global/config/constants';
import { useStore } from '@nanostores/react';
export const LyricsShowcaseCard = ({
  lyricsShowcaseCardProps,
}: {
  lyricsShowcaseCardProps: {
    isFullscreen: boolean;
    selectedSongData: EventSongsProps | undefined;
    lyricSelected: lyricSelectedProps;
  };
}) => {
  const { isFullscreen, selectedSongData, lyricSelected } =
    lyricsShowcaseCardProps;
  const [dataOfLyricSelected, setDataOfLyricSelected] = useState<LyricsProps>();
  const eventConfig = useStore($eventConfig);
  useEffect(() => {
    if (
      selectedSongData &&
      lyricSelected.position <= selectedSongData?.song.lyrics.length
    ) {
      setDataOfLyricSelected(
        selectedSongData?.song.lyrics.find(
          (lyric) => lyric.position === lyricSelected.position,
        ),
      );
    } else {
      setDataOfLyricSelected(undefined);
    }
  }, [lyricSelected, selectedSongData]);
  return (
    <div className="relative flex flex-col items-center">
      {lyricSelected.position > 0 && (
        <div className="flex flex-col items-center">
          {dataOfLyricSelected !== undefined &&
            dataOfLyricSelected.structure.title && (
              <h3
                className={`absolute left-10 top-1/2 text-center ${isFullscreen ? 'text-3xl' : 'text-xl'}uppercase`}
              >
                {structureLib[dataOfLyricSelected.structure.title].es}
              </h3>
            )}
          <div className="grid w-full grid-cols-5 gap-4">
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
