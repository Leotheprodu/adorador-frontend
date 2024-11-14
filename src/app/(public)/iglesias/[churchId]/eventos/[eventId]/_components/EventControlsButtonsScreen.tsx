import { backgroundImages } from '@global/config/constants';
import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@global/icons/ArrowRightIcon';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { useStore } from '@nanostores/react';
import { Checkbox } from '@nextui-org/react';
import { $chordPreferences, $eventConfig } from '@stores/event';
import { useEffect } from 'react';
export const EventControlsButtonsScreen = () => {
  const eventConfig = useStore($eventConfig);
  const chordConfig = useStore($chordPreferences);
  useEffect(() => {
    if (getLocalStorage('eventConfig')) {
      $eventConfig.set(getLocalStorage('eventConfig'));
    }
  }, []);
  useEffect(() => {
    if (getLocalStorage('chordPreferences')) {
      $chordPreferences.set(getLocalStorage('chordPreferences'));
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
      <div className="flex flex-wrap items-center gap-1">
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
          <p className="text-xs">Acordes</p>
        </Checkbox>
        <Checkbox
          color="default"
          size="sm"
          isSelected={eventConfig.showKey}
          aria-label="Mostrar Tonalidad"
          onValueChange={() => {
            $eventConfig.set({
              ...eventConfig,
              showKey: !eventConfig.showKey,
            });
            setLocalStorage('eventConfig', {
              ...eventConfig,
              showKey: !eventConfig.showKey,
            });
          }}
        >
          <p className="text-xs">Tonalidad</p>
        </Checkbox>
        <Checkbox
          color="default"
          size="sm"
          isSelected={eventConfig.showStructure}
          aria-label="Mostrar estructura"
          onValueChange={() => {
            $eventConfig.set({
              ...eventConfig,
              showStructure: !eventConfig.showStructure,
            });
            setLocalStorage('eventConfig', {
              ...eventConfig,
              showStructure: !eventConfig.showStructure,
            });
          }}
        >
          <p className="text-xs">Estructura</p>
        </Checkbox>
        <Checkbox
          color="default"
          size="sm"
          isSelected={chordConfig.noteType === 'american'}
          aria-label="Cifrados"
          onValueChange={() => {
            $chordPreferences.set({
              ...chordConfig,
              noteType:
                chordConfig.noteType === 'american' ? 'regular' : 'american',
            });
            setLocalStorage('chordPreferences', {
              ...chordConfig,
              noteType:
                chordConfig.noteType === 'american' ? 'regular' : 'american',
            });
          }}
        >
          <p className="text-xs">Acordes cifrados</p>
        </Checkbox>
      </div>
    </div>
  );
};
