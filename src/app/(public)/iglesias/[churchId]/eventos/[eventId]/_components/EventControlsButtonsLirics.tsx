import { ArrowDownIcon } from '@global/icons/ArrowDownIcon';
import { ArrowUpIcon } from '@global/icons/ArrowUpIcon';
import { useStore } from '@nanostores/react';
import { $lyricSelected, $selectedSongLyricLength } from '@stores/event';
import { useEventGateway } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useEventGateway';

export const EventControlsButtonsLirics = () => {
  const lyricSelected = useStore($lyricSelected);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const { sendMessage } = useEventGateway();
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-white p-2">
      <h3 className="text-xs">Letras</h3>
      <button
        disabled={lyricSelected.position <= -1}
        onClick={() => {
          if (lyricSelected.position > -1)
            sendMessage({
              type: 'lyricSelected',
              data: {
                position:
                  lyricSelected.position <= 4
                    ? lyricSelected.position - 1
                    : lyricSelected.position - 4,
                action: 'backward',
              },
            });
        }}
        className="w-30 h-30 cursor-pointer rounded-full bg-slate-100 p-4 duration-200 transition-background hover:bg-slate-200 active:scale-95"
      >
        <ArrowUpIcon className="[font-size:2rem]" />
      </button>
      <button
        className="w-30 h-30 cursor-pointer rounded-full bg-slate-100 p-4 duration-200 transition-background hover:bg-slate-200 active:scale-95"
        disabled={
          lyricSelected.position === selectedSongLyricLength + 2 ||
          selectedSongLyricLength === 0
        }
        onClick={() => {
          if (
            lyricSelected.position <= selectedSongLyricLength + 1 &&
            selectedSongLyricLength > 4
          ) {
            sendMessage({
              type: 'lyricSelected',
              data: {
                position:
                  lyricSelected.position < selectedSongLyricLength - 4 &&
                  lyricSelected.position < 1
                    ? lyricSelected.position + 1
                    : lyricSelected.position + 4,
                action: 'forward',
              },
            });
          } else if (
            selectedSongLyricLength > 0 &&
            selectedSongLyricLength < 4
          ) {
            sendMessage({
              type: 'lyricSelected',
              data: {
                position: 1,
                action: 'forward',
              },
            });
          }
        }}
      >
        <ArrowDownIcon className="[font-size:2rem]" />
      </button>
    </div>
  );
};
