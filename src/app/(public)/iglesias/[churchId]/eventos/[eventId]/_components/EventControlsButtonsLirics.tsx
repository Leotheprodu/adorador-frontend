import { ArrowDownIcon } from '@global/icons/ArrowDownIcon';
import { ArrowUpIcon } from '@global/icons/ArrowUpIcon';
import { useStore } from '@nanostores/react';
import { $lyricSelected, $selectedSongLyricLength } from '@stores/event';

export const EventControlsButtonsLirics = () => {
  const lyricSelected = useStore($lyricSelected);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-white p-2">
      <h3 className="text-xs">Letras</h3>
      <button
        disabled={lyricSelected.position === -1}
        onClick={() => {
          if (lyricSelected.position > -1)
            $lyricSelected.set({
              position: lyricSelected.position - 1,
              action: 'backward',
            });
        }}
        className="w-15 h-15 cursor-pointer rounded-full bg-slate-100 p-2 duration-200 transition-background hover:bg-slate-200 active:scale-95"
      >
        <ArrowUpIcon className="[font-size:1rem]" />
      </button>
      <button
        className="w-15 h-15 cursor-pointer rounded-full bg-slate-100 p-2 duration-200 transition-background hover:bg-slate-200 active:scale-95"
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
        <ArrowDownIcon className="[font-size:1rem]" />
      </button>
    </div>
  );
};
