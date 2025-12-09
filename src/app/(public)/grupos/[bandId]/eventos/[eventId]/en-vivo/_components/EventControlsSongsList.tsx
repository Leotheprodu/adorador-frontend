import { useState, useEffect } from 'react';
import { songTypes } from '@global/config/constants';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import { $event, $eventSelectedSongId } from '@stores/event';
import { useStore } from '@nanostores/react';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventGateway';
import { UpdatingSongList } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/updatingElements/UpdatingSongList';
import { AddSongEventButton } from './addSongToEvent/AddSongEventButton';
import { Spinner } from "@heroui/react";

import { OfflineView } from './offlineView/OfflineView';

export const EventControlsSongsList = ({
  refetch,
  params,
  isLoading,
  checkAdminEvent,
  isEventManager = false,
  isBandMemberOnly = false,
}: {
  refetch: () => void;
  params: { bandId: string; eventId: string };
  isLoading: boolean;
  checkAdminEvent: boolean;
  isEventManager?: boolean;
  isBandMemberOnly?: boolean;
}) => {
  const eventData = useStore($event);
  const { songs } = eventData;
  const { sendMessage } = useEventGateway();
  const selectedSongId = useStore($eventSelectedSongId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClickSong = (id: number) => {
    sendMessage({ type: 'eventSelectedSong', data: id });
    sendMessage({
      type: 'lyricSelected',
      data: {
        position: 0,
        action: 'backward',
      },
    });
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col">
      {checkAdminEvent ? (
        // Vista de ADMINISTRADOR: Puede cambiar canciones Y modificar la lista
        (<div className="w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <h4 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-center text-lg font-bold text-transparent">
              Canciones
            </h4>
            <OfflineView />
            <UpdatingSongList
              songs={[...songs]}
              params={params}
              refetch={refetch}
              isAdminEvent={checkAdminEvent}
            />
            <AddSongEventButton
              params={params}
              refetch={refetch}
              isAdminEvent={checkAdminEvent}
            />
          </div>
          <div className="flex h-[12rem] w-full flex-col gap-2 overflow-y-auto rounded-xl bg-white/70 p-3 text-slate-800 shadow-inner backdrop-blur-sm dark:bg-black dark:text-white sm:h-[14rem]">
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <Spinner color="secondary" />
              </div>
            )}
            {!isLoading &&
              songs.map((data) => (
                <button
                  disabled={selectedSongId === data.song.id}
                  onClick={() => handleClickSong(data.song.id)}
                  className={`flex min-h-[3.5rem] items-center rounded-xl border-2 p-3 shadow-sm transition-all duration-200 active:scale-95 ${
                    selectedSongId === data.song.id
                      ? 'border-brand-purple-300 bg-gradient-to-r from-brand-purple-100 to-brand-blue-100 shadow-md ring-2 ring-brand-purple-200 dark:bg-gradient-to-r dark:from-brand-purple-900 dark:to-brand-blue-900 dark:ring-brand-purple-700'
                      : 'dark:hover:gradient-to-r border-transparent bg-white hover:border-brand-purple-200 hover:bg-gradient-to-r hover:from-brand-purple-50 hover:to-brand-blue-50 dark:bg-gray-800 dark:text-white dark:hover:border-brand-purple-600 dark:hover:from-brand-purple-900 dark:hover:to-brand-blue-900 dark:hover:shadow-md'
                  } disabled:active:scale-100`}
                  key={data.song.id}
                >
                  <div className="flex w-full items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        selectedSongId === data.song.id
                          ? 'bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 text-white shadow-md'
                          : 'bg-slate-200 text-slate-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {data.order}
                    </span>
                    <p className="flex-1 text-left text-sm font-medium sm:text-base">
                      <span className="font-semibold">{data.song.title}</span>
                      <span className="text-slate-500 dark:text-slate-200">
                        {' '}
                        · {songTypes[data.song.songType].es}
                      </span>
                      {data.song.key !== null && (
                        <span className="text-brand-purple-600 dark:text-purple-200">
                          {' '}
                          · {handleTranspose(data.song.key, data.transpose)}
                        </span>
                      )}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>)
      ) : isEventManager ? (
        // Vista de EVENT MANAGER: Puede cambiar canciones pero NO modificar la lista
        (<div className="w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <h4 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-center text-lg font-bold text-transparent">
              Canciones
            </h4>
            <OfflineView />
            <UpdatingSongList
              songs={[...songs]}
              params={params}
              refetch={refetch}
              isAdminEvent={false}
            />
            <AddSongEventButton
              params={params}
              refetch={refetch}
              isAdminEvent={false}
            />
          </div>
          <div className="flex h-[12rem] w-full flex-col gap-2 overflow-y-auto rounded-xl bg-white/70 p-3 text-slate-800 shadow-inner backdrop-blur-sm sm:h-[14rem]">
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <Spinner color="secondary" />
              </div>
            )}
            {!isLoading &&
              songs.map((data) => (
                <button
                  disabled={selectedSongId === data.song.id}
                  onClick={() => handleClickSong(data.song.id)}
                  className={`flex min-h-[3.5rem] items-center rounded-xl border-2 p-3 shadow-sm transition-all duration-200 active:scale-95 ${
                    selectedSongId === data.song.id
                      ? 'border-brand-purple-300 bg-gradient-to-r from-brand-purple-100 to-brand-blue-100 shadow-md ring-2 ring-brand-purple-200'
                      : 'border-transparent bg-white hover:border-brand-purple-200 hover:bg-gradient-to-r hover:from-brand-purple-50 hover:to-brand-blue-50 hover:shadow-md'
                  } disabled:active:scale-100`}
                  key={data.song.id}
                >
                  <div className="flex w-full items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        selectedSongId === data.song.id
                          ? 'bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 text-white shadow-md'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {data.order}
                    </span>
                    <p className="flex-1 text-left text-sm font-medium sm:text-base">
                      <span className="font-semibold">{data.song.title}</span>
                      <span className="text-slate-500">
                        {' '}
                        · {songTypes[data.song.songType].es}
                      </span>
                      {data.song.key !== null && (
                        <span className="text-brand-purple-600">
                          {' '}
                          · {handleTranspose(data.song.key, data.transpose)}
                        </span>
                      )}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>)
      ) : isBandMemberOnly ? (
        // Vista de MIEMBRO DEL GRUPO: Puede VER canciones pero NO cambiarlas
        (<div className="w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <h4 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-center text-lg font-bold text-transparent">
              Canciones
            </h4>
            <OfflineView />
          </div>
          <div className="flex h-[12rem] w-full flex-col gap-2 overflow-y-auto rounded-xl bg-white/70 p-3 text-slate-800 shadow-inner backdrop-blur-sm sm:h-[14rem]">
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <Spinner color="secondary" />
              </div>
            )}
            {!isLoading &&
              songs.map((data) => (
                <div
                  className={`flex min-h-[3.5rem] cursor-default items-center rounded-xl border-2 p-3 shadow-sm ${
                    selectedSongId === data.song.id
                      ? 'border-brand-purple-300 bg-gradient-to-r from-brand-purple-100 to-brand-blue-100 shadow-md'
                      : 'border-transparent bg-white'
                  }`}
                  key={data.song.id}
                >
                  <div className="flex w-full items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        selectedSongId === data.song.id
                          ? 'bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 text-white shadow-md'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {data.order}
                    </span>
                    <p className="flex-1 text-left text-sm font-medium sm:text-base">
                      <span className="font-semibold">{data.song.title}</span>
                      <span className="text-slate-500">
                        {' '}
                        · {songTypes[data.song.songType].es}
                      </span>
                      {data.song.key !== null && (
                        <span className="text-brand-purple-600">
                          {' '}
                          · {handleTranspose(data.song.key, data.transpose)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>)
      ) : (
        // Vista de ESPECTADOR: Solo mensaje informativo
        (<div className="w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <OfflineView />
          </div>
          <div className="flex h-[10rem] w-full items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 p-6 text-slate-600 shadow-sm">
            <div className="text-center">
              <div className="mb-2 text-4xl">🎵</div>
              <p className="font-medium text-slate-700">Vista de espectador</p>
              <p className="mt-1 text-sm text-slate-500">
                El administrador controla la presentación
              </p>
            </div>
          </div>
        </div>)
      )}
    </div>
  );
};
