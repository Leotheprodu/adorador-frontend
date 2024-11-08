import { EventSongsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { handleTranspose } from '@iglesias/[churchId]/eventos/[eventId]/_utils/handleTranspose';
import { TransposeChanger } from '@iglesias/[churchId]/eventos/[eventId]/_components/updatingElements/_components/TransposeChanger';
import { songTypes } from '@global/config/constants';
import { Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';
import { EditIcon } from '@global/icons/EditIcon';
import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';

export const UpdateElementCard = ({
  data,
  index,
  songOrder,
  setSongOrder,
  params,
  songsToDelete,
  setSongsToDelete,
}: {
  data: EventSongsProps;
  index: number;
  songOrder: EventSongsProps[];
  setSongOrder: React.Dispatch<React.SetStateAction<EventSongsProps[]>>;
  params: { churchId: string; eventId: string };
  songsToDelete: number[];
  setSongsToDelete: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  return (
    <Draggable draggableId={data.song.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${songsToDelete && songsToDelete.length > 0 && songsToDelete.includes(data.song.id) && 'text-danger-500'} flex h-full items-center justify-start gap-1 rounded-sm p-1 duration-200 transition-background hover:bg-slate-200`}
        >
          <p className="">
            {data.order}) <span className="">{data.song.title}</span> -{' '}
            {songTypes[data.song.songType].es}
            {data.song.key !== null &&
              ` - ${handleTranspose(data.song.key, data.transpose)}`}
            <span className="text-xs">
              {songsToDelete &&
                songsToDelete.length > 0 &&
                songsToDelete.includes(data.song.id) &&
                ' (eliminado)'}
            </span>
          </p>

          <TransposeChanger
            data={data}
            songOrder={songOrder}
            setSongOrder={setSongOrder}
            index={index}
          />
          <Link
            className="rounded-full p-1 duration-200 hover:bg-slate-300"
            href={`/iglesias/${params.churchId}/canciones/${data.song.id}`}
          >
            <EditIcon className="text-primary-500" />
          </Link>
          <button
            onClick={() => {
              const isInDeleteList = songsToDelete.includes(data.song.id);
              if (isInDeleteList) {
                const listWithoutElement = songsToDelete.filter(
                  (ids) => ids !== data.song.id,
                );
                setSongsToDelete(listWithoutElement);
              } else {
                setSongsToDelete([...songsToDelete, data.song.id]);
              }
            }}
            className="rounded-full p-1 duration-200 hover:bg-slate-300"
          >
            <DeleteMusicIcon className="text-danger-500" />
          </button>
        </div>
      )}
    </Draggable>
  );
};
