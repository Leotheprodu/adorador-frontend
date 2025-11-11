import { ArrowsUpDownIconIcon } from '@global/icons/ArrowsUpDownIcon';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';

import { EventSongsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';

export const TransposeChanger = ({
  data,
  songOrder,
  setSongOrder,
  index,
}: {
  data: EventSongsProps;
  songOrder: EventSongsProps[];
  setSongOrder: React.Dispatch<React.SetStateAction<EventSongsProps[]>>;
  index: number;
}) => {
  return (
    <Popover placement="top">
      <PopoverTrigger>
        <button
          className="flex items-center justify-center rounded-full p-1.5 transition-all duration-200 hover:scale-110 hover:bg-brand-purple-100 active:scale-95"
          title="Cambiar tonalidad"
        >
          <ArrowsUpDownIconIcon className="h-4 w-4 text-brand-purple-600" />
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
                {data.song.key !== null &&
                  `${handleTranspose(data.song.key, data.transpose)}`}
              </span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              {data.transpose === 0 ? (
                <span>✓ Tonalidad original</span>
              ) : (
                <span>
                  🎵 Transpuesta {Math.abs(data.transpose)}{' '}
                  {Math.abs(data.transpose) === 1 ? 'semitono' : 'semitonos'}{' '}
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
              onPress={() => {
                const updatedSongs = [...songOrder];
                updatedSongs[index].transpose += 1;
                setSongOrder(updatedSongs);
              }}
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
              onPress={() => {
                const updatedSongs = [...songOrder];
                updatedSongs[index].transpose -= 1;
                setSongOrder(updatedSongs);
              }}
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
  );
};
