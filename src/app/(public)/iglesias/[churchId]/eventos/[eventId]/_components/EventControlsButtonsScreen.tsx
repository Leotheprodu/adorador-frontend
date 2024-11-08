import { backgroundImages } from '@global/config/constants';
import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@global/icons/ArrowRightIcon';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { useStore } from '@nanostores/react';
import { Checkbox } from '@nextui-org/react';
import { $eventConfig } from '@stores/event';
import { useEffect } from 'react';
export const EventControlsButtonsScreen = () => {
  const eventConfig = useStore($eventConfig);
  useEffect(() => {
    if (getLocalStorage('eventConfig')) {
      $eventConfig.set(getLocalStorage('eventConfig'));
    }
  }, []);
  return (
    <div className="flex flex-col gap-2 rounded-md bg-white p-2">
      <h3 className="text-center text-xs">Pantalla</h3>
      <div className="flex items-center justify-center gap-2">
        <h4 className="text-sm">Fondo</h4>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              if (eventConfig.backgroundImage > 1) {
                $eventConfig.set({
                  ...eventConfig,
                  backgroundImage: eventConfig.backgroundImage - 1,
                });
                setLocalStorage('eventConfig', {
                  ...eventConfig,
                  backgroundImage: eventConfig.backgroundImage - 1,
                });
              }
            }}
            className="w-15 h-15 cursor-pointer rounded-full bg-slate-100 p-2 duration-200 transition-background hover:bg-slate-200 active:scale-95"
          >
            <ArrowLeftIcon className="[font-size:1rem]" />
          </button>
          <button
            onClick={() => {
              if (eventConfig.backgroundImage < backgroundImages.length) {
                $eventConfig.set({
                  ...eventConfig,
                  backgroundImage: eventConfig.backgroundImage + 1,
                });
                setLocalStorage('eventConfig', {
                  ...eventConfig,
                  backgroundImage: eventConfig.backgroundImage + 1,
                });
              }
            }}
            className="w-15 h-15 cursor-pointer rounded-full bg-slate-100 p-2 duration-200 transition-background hover:bg-slate-200 active:scale-95"
          >
            <ArrowRightIcon className="[font-size:1rem]" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Checkbox
          color="default"
          size="sm"
          isSelected={eventConfig.showChords}
          aria-label="Mostrar acordes"
          onValueChange={() => {
            $eventConfig.set({
              ...eventConfig,
              showChords: !eventConfig.showChords,
            });
            setLocalStorage('eventConfig', {
              ...eventConfig,
              showChords: !eventConfig.showChords,
            });
          }}
        >
          Acordes
        </Checkbox>
      </div>
    </div>
  );
};
