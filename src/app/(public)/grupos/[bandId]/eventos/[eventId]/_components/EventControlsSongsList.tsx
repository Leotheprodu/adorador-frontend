import { songTypes } from '@global/config/constants';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/_utils/handleTranspose';
import { $event, $eventSelectedSongId } from '@stores/event';
import { useStore } from '@nanostores/react';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventGateway';
import { UpdatingSongList } from '@bands/[bandId]/eventos/[eventId]/_components/updatingElements/UpdatingSongList';
import { AddSongEventButton } from './addSongToEvent/AddSongEventButton';
import { Spinner } from '@nextui-org/react';

import { OfflineView } from './offlineView/OfflineView';

export const EventControlsSongsList = ({
  refetch,
  params,
  isLoading,
  checkAdminEvent,
  isBandMemberOnly = false,
}: {
  refetch: () => void;
  params: { bandId: string; eventId: string };
  isLoading: boolean;
  checkAdminEvent: boolean;
  isBandMemberOnly?: boolean;
}) => {
  const eventData = useStore($event);
  const { songs } = eventData;
  const { sendMessage } = useEventGateway();
  const selectedSongId = useStore($eventSelectedSongId);

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

  return (
    <div className="flex h-full w-full flex-col">
      {checkAdminEvent ? (
        // Vista de ADMINISTRADOR: Puede cambiar canciones
        <div className="w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <h4 className="text-center font-bold text-slate-800">Canciones</h4>
            <OfflineView />
            <UpdatingSongList
              songs={[...songs]}
              params={params}
              refetch={refetch}
            />
            <AddSongEventButton params={params} refetch={refetch} />
          </div>

          <div className="flex h-[10rem] w-full flex-col gap-2 overflow-y-auto rounded-lg bg-slate-100 p-2 text-slate-800">
            {isLoading && <Spinner />}
            {!isLoading &&
              songs.map((data) => (
                <button
                  disabled={selectedSongId === data.song.id}
                  onClick={() => handleClickSong(data.song.id)}
                  className={`flex h-full rounded-sm p-1 duration-200 transition-background hover:bg-slate-200 active:scale-95 disabled:hover:bg-slate-100 disabled:active:scale-100 ${selectedSongId === data.song.id ? 'bg-slate-200 hover:bg-slate-300' : ''}`}
                  key={data.song.id}
                >
                  <p className="text-left">
                    {data.order}) <span className="">{data.song.title}</span> -{' '}
                    {songTypes[data.song.songType].es}
                    {data.song.key !== null &&
                      ` - ${handleTranspose(data.song.key, data.transpose)}`}
                  </p>
                </button>
              ))}
          </div>
        </div>
      ) : isBandMemberOnly ? (
        // Vista de MIEMBRO DEL GRUPO: Puede VER canciones pero NO cambiarlas
        <div className="w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <h4 className="text-center font-bold text-slate-800">Canciones</h4>
            <OfflineView />
          </div>
          <div className="flex h-[10rem] w-full flex-col gap-2 overflow-y-auto rounded-lg bg-slate-100 p-2 text-slate-800">
            {isLoading && <Spinner />}
            {!isLoading &&
              songs.map((data) => (
                <div
                  className={`flex h-full cursor-default rounded-sm p-1 ${selectedSongId === data.song.id ? 'bg-slate-200' : ''}`}
                  key={data.song.id}
                >
                  <p className="text-left">
                    {data.order}) <span className="">{data.song.title}</span> -{' '}
                    {songTypes[data.song.songType].es}
                    {data.song.key !== null &&
                      ` - ${handleTranspose(data.song.key, data.transpose)}`}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ) : (
        // Vista de ESPECTADOR: Solo mensaje informativo
        <div className="w-full">
          <div className="mb-3 flex items-center justify-center gap-2">
            <OfflineView />
          </div>
          <div className="flex h-[10rem] w-full items-center justify-center rounded-lg bg-slate-100 p-2 text-slate-600">
            <p className="text-center">
              Vista de espectador - El administrador del evento controla la
              presentación
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
