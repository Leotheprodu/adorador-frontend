'use client';
import { LightBulbIcon } from '@global/icons';
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $eventConfig, $chordPreferences } from '@stores/event';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { SongViewControlsProps } from '../_interfaces/lyricsInterfaces';
import { InlineTransposeControls } from './lyrics/InlineTransposeControls';
import { InlineDisplayToggles } from './lyrics/InlineDisplayToggles';

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

  const handleLyricsScaleChange = (newScale: number) => {
    $eventConfig.set({
      ...eventConfig,
      lyricsScale: newScale,
    });
    setLocalStorage('eventConfig', {
      ...eventConfig,
      lyricsScale: newScale,
    });
  };

  const handleShowChordsChange = (value: boolean) => {
    $eventConfig.set({
      ...eventConfig,
      showChords: value,
    });
    setLocalStorage('eventConfig', {
      ...eventConfig,
      showChords: value,
    });
  };

  const handleNoteTypeChange = (value: 'regular' | 'american') => {
    $chordPreferences.set({
      ...chordConfig,
      noteType: value,
    });
    setLocalStorage('chordPreferences', {
      ...chordConfig,
      noteType: value,
    });
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
      <InlineTransposeControls
        transpose={transpose}
        onTransposeChange={handleTransposeChange}
      />

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
            onClick={() => handleLyricsScaleChange(eventConfig.lyricsScale - 0.25)}
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold leading-none text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            -
          </button>
          <button
            onClick={() => handleLyricsScaleChange(1)}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
          >
            Normal
          </button>
          <button
            disabled={eventConfig.lyricsScale >= 2}
            onClick={() => handleLyricsScaleChange(eventConfig.lyricsScale + 0.25)}
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold leading-none text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Checkboxes */}
      <InlineDisplayToggles
        showChords={eventConfig.showChords}
        onShowChordsChange={handleShowChordsChange}
        noteType={chordConfig.noteType}
        onNoteTypeChange={handleNoteTypeChange}
      />

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <LightBulbIcon className="h-4 w-4" />
        Los cambios de acordes y letra se sincronizan con eventos
      </p>
    </div>
  );
};
