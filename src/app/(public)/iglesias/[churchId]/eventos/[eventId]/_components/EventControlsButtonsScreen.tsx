import { backgroundImages } from '@global/config/constants';
import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@global/icons/ArrowRightIcon';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { useStore } from '@nanostores/react';
import { Checkbox } from '@nextui-org/react';
import { $backgroundImage, $eventConfig } from '@stores/event';
import { useEffect } from 'react';
export const EventControlsButtonsScreen = () => {
  const backgroundImage = useStore($backgroundImage);
  const eventConfig = useStore($eventConfig);
  useEffect(() => {
    if (getLocalStorage('backgroundImage')) {
      $backgroundImage.set(getLocalStorage('backgroundImage'));
    }
  }, []);
  return (
    <div className="flex flex-col gap-2 rounded-md bg-white p-2">
      <h3 className="text-center text-xs">Pantalla</h3>
      <div className="flex items-center justify-center gap-2">
        <h4 className="text-xs">Fondo</h4>
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
      <div className="flex items-center gap-2">
        <h4 className="text-xs">Acordes</h4>
        <div className="flex w-full items-center justify-center">
          <Checkbox
            color="default"
            type="checkbox"
            name="showChords"
            checked={eventConfig.showChords}
            onChange={() =>
              $eventConfig.set({
                ...eventConfig,
                showChords: !eventConfig.showChords,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
