import { useStore } from '@nanostores/react';
import { Button } from '@nextui-org/react';
import { $lyricSelected, $selectedSongLyricLength } from '@stores/event';

export const EventControlsLyricsButtons = () => {
  const lyricSelected = useStore($lyricSelected);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  return (
    <div className="flex flex-col items-center gap-7">
      <Button
        disabled={lyricSelected.position === 0}
        onClick={() => {
          if (lyricSelected.position > 0)
            $lyricSelected.set({
              position: lyricSelected.position - 1,
              action: 'backward',
            });
        }}
        className="w-20"
      >
        Subir
      </Button>
      <Button
        className="w-20"
        disabled={
          lyricSelected.position === selectedSongLyricLength + 2 ||
          selectedSongLyricLength === 0
        }
        onClick={() => {
          if (lyricSelected.position <= selectedSongLyricLength + 1)
            $lyricSelected.set({
              position: lyricSelected.position + 1,
              action: 'forward',
            });
        }}
      >
        Bajar
      </Button>
    </div>
  );
};
