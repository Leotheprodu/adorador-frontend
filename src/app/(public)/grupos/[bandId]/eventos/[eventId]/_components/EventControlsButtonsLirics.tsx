import { ArrowDownIcon } from '@global/icons/ArrowDownIcon';
import { ArrowUpIcon } from '@global/icons/ArrowUpIcon';
import { useStore } from '@nanostores/react';
import { $lyricSelected, $selectedSongLyricLength } from '@stores/event';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventGateway';

export const EventControlsButtonsLirics = () => {
  const lyricSelected = useStore($lyricSelected);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const { sendMessage } = useEventGateway();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 rounded-md border border-slate-200 bg-white p-1 opacity-60 shadow-sm hover:opacity-100">
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
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-1 duration-200 transition-background hover:bg-slate-200 active:scale-95"
      >
        <ArrowUpIcon />
      </button>
      <button
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-1 duration-200 transition-background hover:bg-slate-200 active:scale-95"
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
        <ArrowDownIcon className="" />
      </button>
    </div>
  );
};
