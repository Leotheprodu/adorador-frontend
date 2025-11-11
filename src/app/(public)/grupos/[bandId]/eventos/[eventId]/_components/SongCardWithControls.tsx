'use client';
import { songTypes } from '@global/config/constants';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import { MusicNoteIcon } from '@global/icons';
import { Draggable } from '@hello-pangea/dnd';
import { ArrowsUpDownIconIcon } from '@global/icons/ArrowsUpDownIcon';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';

interface Song {
  order: number;
  transpose: number;
  song: {
    id: number;
    title: string;
    songType: 'worship' | 'praise';
    key: string | null;
  };
}

interface SongCardWithControlsProps {
  data: Song;
  index: number;
  isAdminEvent: boolean;
  songOrder: Song[];
  setSongOrder: (songs: Song[]) => void;
}

export const SongCardWithControls = ({
  data,
  index,
  isAdminEvent,
  songOrder,
  setSongOrder,
}: SongCardWithControlsProps) => {
  const handleTransposeUp = () => {
    if (data.transpose >= 6) return;
    const updatedSongs = [...songOrder];
    updatedSongs[index].transpose += 1;
    setSongOrder(updatedSongs);
  };

  const handleTransposeDown = () => {
    if (data.transpose <= -6) return;
    const updatedSongs = [...songOrder];
    updatedSongs[index].transpose -= 1;
    setSongOrder(updatedSongs);
  };

  // Si no es admin, mostrar sin drag & drop
  if (!isAdminEvent) {
    return (
      <div className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-brand-purple-200 hover:shadow-md">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-sm font-bold text-brand-purple-700">
          {data.order}
        </span>
        <div className="flex-1">
          <p className="font-semibold text-slate-900">{data.song.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              {songTypes[data.song.songType].es}
            </span>
            {data.song.key !== null && (
              <span className="rounded-full bg-brand-purple-100 px-2 py-0.5 font-medium text-brand-purple-700">
                Tono: {handleTranspose(data.song.key, data.transpose)}
              </span>
            )}
          </div>
        </div>
        <div className="text-slate-300 transition-colors duration-200 group-hover:text-brand-purple-400">
          <MusicNoteIcon className="h-5 w-5" />
        </div>
      </div>
    );
  }

  // Con drag & drop para admins
  return (
    <Draggable draggableId={data.song.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200 ${
            snapshot.isDragging
              ? 'z-50 scale-105 border-brand-purple-400 bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 shadow-2xl'
              : 'border-slate-200 bg-white shadow-sm hover:border-brand-purple-300 hover:shadow-md'
          }`}
        >
          {/* Drag Handle */}
          <div
            {...provided.dragHandleProps}
            className="cursor-grab active:cursor-grabbing"
          >
            <div className="flex flex-col gap-0.5 opacity-40 transition-opacity duration-200 group-hover:opacity-100">
              <div className="h-1 w-1 rounded-full bg-slate-400"></div>
              <div className="h-1 w-1 rounded-full bg-slate-400"></div>
              <div className="h-1 w-1 rounded-full bg-slate-400"></div>
            </div>
          </div>

          {/* Número de orden */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-sm font-bold text-brand-purple-700">
            {data.order}
          </span>

          {/* Información de la canción */}
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{data.song.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                {songTypes[data.song.songType].es}
              </span>
              {data.song.key !== null && (
                <span className="rounded-full bg-brand-purple-100 px-2 py-0.5 font-medium text-brand-purple-700">
                  Tono: {handleTranspose(data.song.key, data.transpose)}
                </span>
              )}
            </div>
          </div>

          {/* Controles de transposición */}
          {data.song.key !== null && (
            <Popover placement="top">
              <PopoverTrigger>
                <button
                  className="flex items-center justify-center rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-brand-purple-100 active:scale-95"
                  title="Cambiar tonalidad"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowsUpDownIconIcon className="h-5 w-5 text-brand-purple-600" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="w-full p-3">
                  {/* Header */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-500 to-brand-blue-500">
                      <ArrowsUpDownIconIcon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Cambiar Tonalidad
                      </h4>
                    </div>
                  </div>

                  {/* Current Key Info */}
                  <div className="mb-2 rounded-lg bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 p-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-600">
                        Actual:
                      </span>
                      <span className="rounded-full bg-brand-purple-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                        {handleTranspose(data.song.key, data.transpose)}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      {data.transpose === 0 ? (
                        <span>✓ Tonalidad original</span>
                      ) : (
                        <span>
                          🎵 Transpuesta {Math.abs(data.transpose)}{' '}
                          {Math.abs(data.transpose) === 1
                            ? 'semitono'
                            : 'semitonos'}{' '}
                          {data.transpose > 0 ? '↑' : '↓'}
                          <span className="text-brand-purple-600">
                            {' '}
                            (original: {data.song.key})
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex w-full items-center gap-2">
                    <Button
                      isDisabled={data.transpose === 6}
                      variant="flat"
                      size="sm"
                      className={`flex-1 text-xs font-semibold transition-all duration-200 ${
                        data.transpose === 6
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 hover:shadow-md'
                      }`}
                      onPress={handleTransposeUp}
                    >
                      ↑ Subir
                    </Button>
                    <Button
                      isDisabled={data.transpose === -6}
                      variant="flat"
                      size="sm"
                      className={`flex-1 text-xs font-semibold transition-all duration-200 ${
                        data.transpose === -6
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:scale-105 hover:shadow-md'
                      }`}
                      onPress={handleTransposeDown}
                    >
                      ↓ Bajar
                    </Button>
                  </div>

                  {/* Helper Text */}
                  {(data.transpose === 6 || data.transpose === -6) && (
                    <p className="mt-1.5 text-center text-[10px] text-orange-600">
                      ⚠️ Límite alcanzado
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Icono decorativo */}
          <div className="text-slate-300 transition-colors duration-200 group-hover:text-brand-purple-400">
            <MusicNoteIcon className="h-5 w-5" />
          </div>
        </div>
      )}
    </Draggable>
  );
};
