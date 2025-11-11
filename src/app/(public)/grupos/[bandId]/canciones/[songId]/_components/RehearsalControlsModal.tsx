'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Checkbox,
} from '@nextui-org/react';
import { ArrowLeftIcon, ArrowRightIcon, GearIcon } from '@global/icons';
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $eventConfig, $chordPreferences } from '@stores/event';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';

interface RehearsalControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
}

export const RehearsalControlsModal = ({
  isOpen,
  onClose,
  songId,
}: RehearsalControlsModalProps) => {
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <GearIcon className="h-5 w-5 text-slate-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Controles de Ensayo
            </h3>
            <p className="text-xs font-normal text-slate-500">
              Ajusta la visualización para practicar
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6 py-6">
          {/* Transpose Control */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700">
                Transposición
              </h4>
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                {transpose > 0 ? '+' : ''}
                {transpose}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleTransposeChange(transpose - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleTransposeChange(0)}
                className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                Resetear
              </button>
              <button
                onClick={() => handleTransposeChange(transpose + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">
              Cambia la tonalidad sin modificar la canción
            </p>
          </div>

          {/* Lyrics Scale Control */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700">
                Tamaño de Letra
              </h4>
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
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
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-xl font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                -
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
                className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
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
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-xl font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">
              Opciones de Visualización
            </h4>

            <div className="space-y-3">
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
                <span className="text-sm text-slate-700">Mostrar Acordes</span>
              </Checkbox>

              {eventConfig.showChords && (
                <div className="ml-6">
                  <Checkbox
                    color="secondary"
                    size="sm"
                    isSelected={chordConfig.noteType === 'american'}
                    onValueChange={() => {
                      $chordPreferences.set({
                        ...chordConfig,
                        noteType:
                          chordConfig.noteType === 'american'
                            ? 'regular'
                            : 'american',
                      });
                      setLocalStorage('chordPreferences', {
                        ...chordConfig,
                        noteType:
                          chordConfig.noteType === 'american'
                            ? 'regular'
                            : 'american',
                      });
                    }}
                  >
                    <span className="text-xs text-slate-600">
                      Notación Americana (A, B, C...)
                    </span>
                  </Checkbox>
                </div>
              )}
            </div>
          </div>

          {/* Info footer */}
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-600">
              Los cambios se sincronizan automáticamente con eventos activos
            </p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
