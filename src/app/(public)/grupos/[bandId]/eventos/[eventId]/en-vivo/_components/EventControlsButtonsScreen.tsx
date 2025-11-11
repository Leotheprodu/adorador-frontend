import { backgroundImages } from '@global/config/constants';
import { GearIcon } from '@global/icons';
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
    <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-white to-brand-purple-50/30 p-3 shadow-sm">
      <h3 className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-brand-purple-700">
        <GearIcon className="h-4 w-4" /> Pantalla
      </h3>
      <div className="flex items-center justify-center gap-2">
        <h4 className="text-sm font-medium text-slate-700">
          Letra:{' '}
          <span className="text-brand-purple-600">
            {eventConfig.lyricsScale.toFixed(2)}
          </span>
        </h4>
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={eventConfig.lyricsScale <= 0.5}
            onClick={() => {
              if (eventConfig.lyricsScale > 0.5) {
                $eventConfig.set({
                  ...eventConfig,
                  lyricsScale: Math.max(0.5, eventConfig.lyricsScale - 0.25),
                });
                setLocalStorage('eventConfig', {
                  ...eventConfig,
                  lyricsScale: Math.max(0.5, eventConfig.lyricsScale - 0.25),
                });
              }
            }}
            className="w-15 h-15 cursor-pointer rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 p-2 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <ArrowLeftIcon className="[font-size:1rem]" />
          </button>
          <button
            disabled={eventConfig.lyricsScale >= 1.5}
            onClick={() => {
              if (eventConfig.lyricsScale < 1.5) {
                $eventConfig.set({
                  ...eventConfig,
                  lyricsScale: Math.min(1.5, eventConfig.lyricsScale + 0.25),
                });
                setLocalStorage('eventConfig', {
                  ...eventConfig,
                  lyricsScale: Math.min(1.5, eventConfig.lyricsScale + 0.25),
                });
              }
            }}
            className="w-15 h-15 cursor-pointer rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 p-2 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <ArrowRightIcon className="[font-size:1rem]" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <h4 className="text-sm font-medium text-slate-700">Fondo</h4>
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
            className="w-15 h-15 cursor-pointer rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 p-2 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95"
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
            className="w-15 h-15 cursor-pointer rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 p-2 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95"
          >
            <ArrowRightIcon className="[font-size:1rem]" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Checkbox
          color="secondary"
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
          <p className="text-xs font-medium">Estructura</p>
        </Checkbox>
        <Checkbox
          color="secondary"
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
          <p className="text-xs font-medium">Acordes</p>
        </Checkbox>
        {eventConfig.showChords && (
          <Checkbox
            color="secondary"
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
            <p className="text-xs font-medium">Cifrados</p>
          </Checkbox>
        )}
      </div>
    </div>
  );
};
