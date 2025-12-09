import { AddSongIcon } from '@global/icons/AddSongIcon';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import { AddSongEventBySavedSongs } from './AddSongEventBySavedSongs';
import { AddNewSongtoChurchAndEvent } from './AddNewSongtoChurchAndEvent';
import { useState, useMemo, memo } from 'react';

export const AddSongEventButton = memo(
  ({
    params,
    refetch,
    isAdminEvent,
    eventSongs,
  }: {
    params: { bandId: string; eventId: string };
    refetch: () => void;
    isAdminEvent?: boolean;
    eventSongs?: { order: number; transpose: number; song: { id: number } }[];
  }) => {
    const [isOpenPopover, setIsOpenPopover] = useState(false);
    const [isModalCatalogOpen, setIsModalCatalogOpen] = useState(false);
    const [isModalNewSongOpen, setIsModalNewSongOpen] = useState(false);
    const hasPermission = isAdminEvent !== undefined ? isAdminEvent : true;

    // Memoizar eventSongs para evitar que cambie la referencia en cada render
    const memoizedEventSongs = useMemo(() => eventSongs, [eventSongs]);

    const handleOpenCatalog = () => {
      setIsModalCatalogOpen(true);
      setIsOpenPopover(false);
    };

    const handleOpenNewSong = () => {
      setIsModalNewSongOpen(true);
      setIsOpenPopover(false);
    };

    return (
      <>
        <Tooltip
          content={
            !hasPermission
              ? 'Solo los administradores de la banda pueden agregar canciones'
              : 'Agregar canción al evento'
          }
        >
          <div className="inline-block">
            <Popover
              isOpen={hasPermission ? isOpenPopover : false}
              onOpenChange={(open) => hasPermission && setIsOpenPopover(open)}
              classNames={{
                content:
                  'p-1 bg-white/95 dark:bg-black/80 backdrop-blur-sm shadow-lg',
              }}
            >
              <PopoverTrigger>
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  size="sm"
                  isDisabled={!hasPermission}
                  className={`transition-all duration-200 ${
                    hasPermission
                      ? 'hover:bg-brand-purple-300 hover:shadow-md dark:hover:bg-brand-purple-900'
                      : 'cursor-not-allowed opacity-50'
                  }`}
                  aria-label="Agregar canción al evento"
                >
                  <AddSongIcon className="text-brand-purple-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex min-w-[280px] flex-col gap-1 p-1 dark:border-1 dark:border-brand-purple-600 dark:bg-gray-900/80">
                  <button
                    onClick={handleOpenCatalog}
                    className="group rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-brand-purple-50 hover:to-brand-blue-50 hover:shadow-sm dark:hover:bg-gradient-to-r dark:hover:from-brand-purple-900 dark:hover:to-brand-blue-900"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-left text-sm font-semibold text-transparent dark:bg-gradient-to-r dark:from-brand-purple-100 dark:to-brand-blue-100">
                        📚 Catálogo de Canciones
                      </div>
                      <div className="text-left text-xs text-slate-600 dark:text-slate-300">
                        Agrega canciones desde tu biblioteca guardada
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={handleOpenNewSong}
                    className="group rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-brand-purple-50 hover:to-brand-blue-50 hover:shadow-sm dark:hover:bg-gradient-to-r dark:hover:from-brand-purple-900 dark:hover:to-brand-blue-900"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-left text-sm font-semibold text-transparent dark:bg-gradient-to-r dark:from-brand-purple-100 dark:to-brand-blue-100">
                        ✨ Nueva Canción
                      </div>
                      <div className="text-left text-xs text-slate-600 dark:text-slate-300">
                        Crea y agrega una nueva canción
                      </div>
                    </div>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </Tooltip>

        {/* Modales renderizados fuera del Popover */}
        <AddSongEventBySavedSongs
          params={params}
          refetch={refetch}
          eventSongs={memoizedEventSongs}
          isOpen={isModalCatalogOpen}
          onClose={() => setIsModalCatalogOpen(false)}
        />
        <AddNewSongtoChurchAndEvent
          params={params}
          refetch={refetch}
          eventSongs={memoizedEventSongs}
          isOpen={isModalNewSongOpen}
          onClose={() => setIsModalNewSongOpen(false)}
        />
      </>
    );
  },
);

AddSongEventButton.displayName = 'AddSongEventButton';
