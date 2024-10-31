import { backgroundImages } from '@global/config/constants';
import { ArrowDownIcon } from '@global/icons/ArrowDownIcon';
import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@global/icons/ArrowRightIcon';
import { ArrowUpIcon } from '@global/icons/ArrowUpIcon';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { useStore } from '@nanostores/react';
import {
  $backgroundImage,
  $lyricSelected,
  $selectedSongLyricLength,
} from '@stores/event';
import { useEffect } from 'react';

export const EventControlsLyricsButtons = () => {
  const lyricSelected = useStore($lyricSelected);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const backgroundImage = useStore($backgroundImage);

  useEffect(() => {
    if (getLocalStorage('backgroundImage')) {
      $backgroundImage.set(getLocalStorage('backgroundImage'));
    }
  }, []);
  return (
    <div className="h-full w-full">
      <h3 className="mb-3 text-center font-bold text-slate-800">
        Panel de botones
      </h3>
      <div className="flex h-[10rem] gap-2 rounded-md bg-slate-100 p-2">
        <div className="flex flex-col items-center justify-center gap-7 rounded-md bg-white p-2">
          <h3 className="text-xs">Letras</h3>
          <button
            disabled={lyricSelected.position === 0}
            onClick={() => {
              if (lyricSelected.position > 0)
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
        <div className="flex flex-col items-center gap-7 rounded-md bg-white p-2">
          <h3 className="text-xs">Fondo</h3>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                if (backgroundImage > 1) {
                  $backgroundImage.set(backgroundImage - 1);
                  setLocalStorage('backgroundImage', backgroundImage - 1);
                }
              }}
              className="w-15 h-15 cursor-pointer rounded-full bg-slate-100 p-2 duration-200 transition-background hover:bg-slate-200 active:scale-95"
            >
              <ArrowLeftIcon className="[font-size:1rem]" />
            </button>
            <button
              onClick={() => {
                if (backgroundImage < backgroundImages.length) {
                  $backgroundImage.set(backgroundImage + 1);
                  setLocalStorage('backgroundImage', backgroundImage + 1);
                }
              }}
              className="w-15 h-15 cursor-pointer rounded-full bg-slate-100 p-2 duration-200 transition-background hover:bg-slate-200 active:scale-95"
            >
              <ArrowRightIcon className="[font-size:1rem]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
