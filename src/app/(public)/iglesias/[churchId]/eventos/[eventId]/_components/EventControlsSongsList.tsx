import { songTypes } from '@global/config/constants';
import { handleTranspose } from '@iglesias/[churchId]/eventos/[eventId]/_utils/handleTranspose';
import { $event, $eventSelectedSongId } from '@stores/event';
import { useStore } from '@nanostores/react';
import { useEventGateway } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useEventGateway';
import { UpdatingSongList } from '@iglesias/[churchId]/eventos/[eventId]/_components/updatingElements/UpdatingSongList';
import { AddSongEventButton } from './addSongToEvent/AddSongEventButton';
import { UpdateIcon } from '@global/icons/UpdateIcon';
import { Spinner } from '@nextui-org/react';

export const EventControlsSongsList = ({
  refetch,
  params,
  isLoading,
}: {
  refetch: () => void;
  params: { churchId: string; eventId: string };
  isLoading: boolean;
}) => {
  const eventData = useStore($event);
  const { songs } = eventData;
  const { sendMessage } = useEventGateway();
  const selectedSongId = useStore($eventSelectedSongId);

  const handleClickSong = (id: number) => {
    sendMessage({ type: 'eventSelectedSong', data: id });
  };

  return (
    <div className="col-start-1 col-end-3 row-start-3 flex h-full w-full flex-col md:col-end-2 md:row-start-1">
      <div className="w-full">
        <div className="mb-3 flex items-center justify-center gap-2">
          <h4 className="text-center font-bold text-slate-800">Canciones</h4>
          <button
            className="rounded-full p-2 duration-200 hover:bg-slate-300"
            onClick={() => {
              console.log('click');
              refetch();
            }}
          >
            <UpdateIcon className="text-primary-500" />
          </button>
          <UpdatingSongList
            songs={[...songs]}
            params={params}
            refetch={refetch}
          />
          <AddSongEventButton params={params} />
        </div>

        <div className="flex h-[10rem] w-full flex-col gap-2 overflow-y-auto rounded-lg bg-slate-100 p-2 text-slate-800">
          {isLoading && <Spinner />}
          {!isLoading &&
            songs.map((data) => (
              <button
                disabled={selectedSongId === data.song.id}
                onClick={() => handleClickSong(data.song.id)}
                className={`flex h-full rounded-sm p-1 duration-200 transition-background hover:bg-slate-200 active:scale-95 ${selectedSongId === data.song.id ? 'bg-slate-200 hover:bg-slate-300' : ''}`}
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
    </div>
  );
};
