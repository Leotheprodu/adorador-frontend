'use client';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { AddSongEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/addSongToEvent/AddSongEventButton';
import { MusicNoteIcon } from '@global/icons';
import { SongCardWithControls } from './SongCardWithControls';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { eventUpdateSongs } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/updatingElements/services/updatingEventSongsService';

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

interface SongListDisplayProps {
  songs: Song[];
  params: { bandId: string; eventId: string };
  refetch: () => void;
  isAdminEvent: boolean;
}

export const SongListDisplay = ({
  songs,
  params,
  refetch,
  isAdminEvent,
}: SongListDisplayProps) => {
  const [songOrder, setSongOrder] = useState<Song[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const { mutate, isPending, status } = eventUpdateSongs({ params });

  useEffect(() => {
    setSongOrder([...songs]);
    setHasChanges(false);
  }, [songs]);

  useEffect(() => {
    if (status === 'error') {
      toast.error('Ha ocurrido un error actualizando las canciones');
    }
    if (status === 'success') {
      toast.success('Canciones actualizadas correctamente');
      setHasChanges(false);
      refetch();
    }
  }, [status, refetch]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedSongs = [...songOrder];
    const [removed] = updatedSongs.splice(result.source.index, 1);
    updatedSongs.splice(result.destination.index, 0, removed);

    // Update the order of the songs
    const reorderedSongs = updatedSongs.map((song, index) => ({
      ...song,
      order: index + 1,
    }));

    setSongOrder(reorderedSongs);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    const updatedSongs = songOrder.map((song) => ({
      songId: song.song.id,
      transpose: song.transpose,
      order: song.order,
    }));

    mutate({ songDetails: updatedSongs });
  };

  const handleCancelChanges = () => {
    setSongOrder([...songs]);
    setHasChanges(false);
    toast('Cambios descartados', { icon: '↩️' });
  };

  const handleSongOrderChange = (newSongOrder: Song[]) => {
    setSongOrder(newSongOrder);
    setHasChanges(true);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MusicNoteIcon className="h-5 w-5 text-brand-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Canciones del Evento
          </h3>
          <span className="rounded-full bg-brand-purple-100 px-2.5 py-0.5 text-xs font-semibold text-brand-purple-700">
            {songs.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && isAdminEvent && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="flat"
                onPress={handleCancelChanges}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                isLoading={isPending}
                onPress={handleSaveChanges}
                className="bg-gradient-to-r from-brand-purple-500 to-brand-blue-500 font-semibold text-white shadow-md hover:shadow-lg"
              >
                Guardar Cambios
              </Button>
            </div>
          )}
          {isAdminEvent && (
            <AddSongEventButton params={params} refetch={refetch} />
          )}
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <div className="text-5xl">🎵</div>
          <div>
            <p className="font-medium text-slate-700">
              No hay canciones en este evento
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {isAdminEvent
                ? 'Agrega canciones usando el botón +'
                : 'El administrador aún no ha agregado canciones'}
            </p>
          </div>
        </div>
      ) : isAdminEvent ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="songListDisplay">
            {(provided, snapshot) => (
              <div
                className={`grid gap-2 rounded-xl border-2 p-2 transition-all duration-200 ${
                  snapshot.isDraggingOver
                    ? 'border-brand-purple-400 bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 shadow-lg'
                    : 'border-transparent'
                }`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {songOrder.map((data, index) => (
                  <SongCardWithControls
                    key={data.song.id}
                    data={data}
                    index={index}
                    isAdminEvent={isAdminEvent}
                    songOrder={songOrder}
                    setSongOrder={handleSongOrderChange}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="grid gap-2">
          {songOrder.map((data, index) => (
            <SongCardWithControls
              key={data.song.id}
              data={data}
              index={index}
              isAdminEvent={isAdminEvent}
              songOrder={songOrder}
              setSongOrder={handleSongOrderChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
