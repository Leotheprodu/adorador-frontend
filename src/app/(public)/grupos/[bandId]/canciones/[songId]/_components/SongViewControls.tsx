'use client';
import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@global/icons/ArrowRightIcon';
import { Checkbox } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $eventConfig, $chordPreferences } from '@stores/event';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';

interface SongViewControlsProps {
  songId: string;
}

export const SongViewControls = ({ songId }: SongViewControlsProps) => {
  const eventConfig = useStore($eventConfig);
  const chordConfig = useStore($chordPreferences);

  // Estado local para la transposición específica de esta canción
  const [transpose, setTranspose] = useState(0);

  // Cargar configuración global al montar
  useEffect(() => {
    if (getLocalStorage('eventConfig')) {
      $eventConfig.set(getLocalStorage('eventConfig'));
    }
    if (getLocalStorage('chordPreferences')) {
      $chordPreferences.set(getLocalStorage('chordPreferences'));
    }
  }, []);

  // Cargar transposición específica de esta canción
  useEffect(() => {
    const storageKey = `songTranspose_${songId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setTranspose(parseInt(stored));
    } else {
      setTranspose(0);
    }
  }, [songId]);

  // Guardar transposición cuando cambie
  const handleTransposeChange = (newTranspose: number) => {
    setTranspose(newTranspose);
    const storageKey = `songTranspose_${songId}`;
    localStorage.setItem(storageKey, newTranspose.toString());
  };

  return (
    <div className="sticky top-4 z-20 mx-auto w-full max-w-md rounded-2xl bg-white/90 p-5 shadow-xl ring-1 ring-slate-200 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-brand-purple-700">
          🎛️ Controles de Ensayo
        </h3>
        <p className="text-xs text-slate-500">
          Ajusta la visualización para practicar
        </p>
      </div>

      {/* Transpose Control */}
      <div className="mb-4 rounded-xl bg-gradient-to-br from-brand-purple-50 to-brand-pink-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">
            🎹 Transposición
          </h4>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-purple-600 shadow-sm">
            {transpose > 0 ? '+' : ''}
            {transpose}
          </span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleTransposeChange(transpose - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleTransposeChange(0)}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
          >
            Resetear
          </button>
          <button
            onClick={() => handleTransposeChange(transpose + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-600">
          Cambia la tonalidad sin modificar la canción
        </p>
      </div>

      {/* Lyrics Scale Control */}
      <div className="mb-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-700">
            📏 Tamaño de Letra
          </h4>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600 shadow-sm">
            {eventConfig.lyricsScale}x
          </span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={eventConfig.lyricsScale <= 0.5}
            onClick={() => {
              if (eventConfig.lyricsScale > 0.5) {
                $eventConfig.set({
                  ...eventConfig,
                  lyricsScale: eventConfig.lyricsScale - 0.25,
                });
                setLocalStorage('eventConfig', {
                  ...eventConfig,
                  lyricsScale: eventConfig.lyricsScale - 0.25,
                });
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <span className="text-xl font-bold">-</span>
          </button>
          <button
            onClick={() => {
              $eventConfig.set({
                ...eventConfig,
                lyricsScale: 1,
              });
              setLocalStorage('eventConfig', {
                ...eventConfig,
                lyricsScale: 1,
              });
            }}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
          >
            Normal
          </button>
          <button
            disabled={eventConfig.lyricsScale >= 2}
            onClick={() => {
              if (eventConfig.lyricsScale < 2) {
                $eventConfig.set({
                  ...eventConfig,
                  lyricsScale: eventConfig.lyricsScale + 0.25,
                });
                setLocalStorage('eventConfig', {
                  ...eventConfig,
                  lyricsScale: eventConfig.lyricsScale + 0.25,
                });
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Checkbox
          color="secondary"
          size="md"
          isSelected={eventConfig.showChords}
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
          <span className="text-sm font-semibold text-slate-700">
            🎸 Mostrar Acordes
          </span>
        </Checkbox>

        {eventConfig.showChords && (
          <Checkbox
            color="secondary"
            size="md"
            isSelected={chordConfig.noteType === 'american'}
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
            <span className="text-sm font-semibold text-slate-700">
              🔤 Acordes Cifrados (A, B, C...)
            </span>
          </Checkbox>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        💡 Los cambios de acordes y letra se sincronizan con eventos
      </p>
    </div>
  );
};
