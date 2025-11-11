import { EventSongsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import { TransposeChanger } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/updatingElements/components/TransposeChanger';
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
  params: { bandId: string; eventId: string };
  songsToDelete: number[];
  setSongsToDelete: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const isMarkedForDeletion = songsToDelete.includes(data.song.id);

  return (
    <Draggable draggableId={data.song.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative flex items-center justify-between gap-2 rounded-lg border-2 p-2 transition-all duration-200 ${
            snapshot.isDragging
              ? 'z-50 scale-105 border-brand-purple-400 bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 shadow-2xl'
              : isMarkedForDeletion
                ? 'border-red-300 bg-red-50 opacity-60'
                : 'border-slate-200 bg-white shadow-sm hover:border-brand-purple-300 hover:shadow-md'
          }`}
        >
          {/* Drag Handle Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5 opacity-40 transition-opacity duration-200 group-hover:opacity-100">
              <div className="h-0.5 w-0.5 rounded-full bg-slate-400"></div>
              <div className="h-0.5 w-0.5 rounded-full bg-slate-400"></div>
              <div className="h-0.5 w-0.5 rounded-full bg-slate-400"></div>
            </div>

            {/* Song Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isMarkedForDeletion
                      ? 'bg-red-200 text-red-700'
                      : 'bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-brand-purple-700'
                  }`}
                >
                  {data.order}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-semibold ${isMarkedForDeletion ? 'text-red-600 line-through' : 'text-slate-800'}`}
                  >
                    {data.song.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5">
                      {songTypes[data.song.songType].es}
                    </span>
                    {data.song.key !== null && (
                      <span className="rounded-full bg-brand-purple-100 px-1.5 py-0.5 font-semibold text-brand-purple-700">
                        {handleTranspose(data.song.key, data.transpose)}
                      </span>
                    )}
                    {isMarkedForDeletion && (
                      <span className="font-semibold text-red-600">✕</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <TransposeChanger
              data={data}
              songOrder={songOrder}
              setSongOrder={setSongOrder}
              index={index}
            />
            <Link
              className="rounded-full p-1.5 transition-all duration-200 hover:scale-110 hover:bg-brand-blue-100 active:scale-95"
              href={`/grupos/${params.bandId}/canciones/${data.song.id}`}
              title="Editar canción"
            >
              <EditIcon className="h-4 w-4 text-brand-blue-600" />
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
              className={`rounded-full p-1.5 transition-all duration-200 hover:scale-110 active:scale-95 ${
                isMarkedForDeletion
                  ? 'bg-red-100 hover:bg-red-200'
                  : 'hover:bg-red-100'
              }`}
              title={
                isMarkedForDeletion ? 'Restaurar canción' : 'Eliminar canción'
              }
            >
              <DeleteMusicIcon
                className={`h-4 w-4 ${isMarkedForDeletion ? 'text-red-700' : 'text-red-500'}`}
              />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};
