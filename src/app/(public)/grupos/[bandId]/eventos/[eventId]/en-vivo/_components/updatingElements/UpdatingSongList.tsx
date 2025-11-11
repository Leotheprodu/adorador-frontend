import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { EditIcon } from '@global/icons/EditIcon';
import { EventSongsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { UpdateElementCard } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/updatingElements/components/UpdateElementCard';
import {
  eventDeleteSongs,
  eventUpdateSongs,
} from './services/updatingEventSongsService';
import toast from 'react-hot-toast';

export const UpdatingSongList = ({
  songs,
  params,
  refetch,
  isAdminEvent,
}: {
  songs: EventSongsProps[];
  params: { bandId: string; eventId: string };
  refetch: () => void;
  isAdminEvent?: boolean;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [songOrder, setSongOrder] = useState<EventSongsProps[]>([]);
  const [songsToDelete, setSongsToDelete] = useState<number[]>([]);
  const { mutate, status, isPending } = eventUpdateSongs({ params });
  const {
    mutate: mutateDeleteSongs,
    isPending: isPendingDeleteSongs,
    status: statusDeleteSongs,
  } = eventDeleteSongs({ params });

  useEffect(() => {
    setSongOrder([...songs]);
  }, [songs]);

  useEffect(() => {
    if (status === 'error') {
      toast.error('Ha ocurrido un actualizando las canciones');
    }
    if (statusDeleteSongs === 'error') {
      toast.error('Ha ocurrido un error eliminando las canciones');
    }

    if (status === 'success' || statusDeleteSongs === 'success') {
      toast.success('Canciones actualizadas correctamente');
      // Resetear estados antes de cerrar
      setSongOrder([...songs]);
      setSongsToDelete([]);
      // Hacer refetch y cerrar el modal
      refetch();
      // Usar setTimeout para asegurar que el modal se cierre después del refetch
      setTimeout(() => {
        onOpenChange();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, statusDeleteSongs]);
  const handleDragEnd = (result) => {
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
  };

  // Resetear el estado al abrir el modal
  const handleOpen = () => {
    setSongOrder([...songs]); // Resetear a las canciones originales
    setSongsToDelete([]); // Limpiar canciones marcadas para eliminar
    onOpen();
  };

  // Manejar el cierre del modal - resetear cambios solo si no fue un guardado exitoso
  const handleModalClose = () => {
    // Resetear estados al cerrar
    setSongOrder([...songs]);
    setSongsToDelete([]);
  };

  // Manejar el cambio de estado del modal (abierto/cerrado)
  const handleModalChange = () => {
    // Si el modal se está cerrando y no fue por un guardado exitoso, resetear
    if (isOpen && status !== 'success' && statusDeleteSongs !== 'success') {
      handleModalClose();
    }
    onOpenChange();
  };

  // Cancelar sin guardar
  const handleCancel = () => {
    handleModalClose(); // Resetear cambios
    onOpenChange(); // Cerrar modal
  };

  const handleSaveChanges = () => {
    const updatedSongs = songOrder.map((song) => ({
      songId: song.song.id,
      transpose: song.transpose,
      order: song.order,
    }));

    if (songsToDelete.length > 0 && updatedSongs.length > 0) {
      const newOrderofUpdatedSongs = updatedSongs.filter(
        (song) => !songsToDelete.includes(song.songId),
      );
      //fix the new order of the songs
      const newOrder = newOrderofUpdatedSongs.map((song, index) => ({
        ...song,
        order: index + 1,
      }));

      mutateDeleteSongs({ songIds: songsToDelete });
      mutate({ songDetails: newOrder });
    } else if (updatedSongs.length > 0) {
      mutate({ songDetails: updatedSongs });
    }
  };

  const hasPermission = isAdminEvent !== undefined ? isAdminEvent : true;

  return (
    <>
      <Tooltip
        content={
          !hasPermission
            ? 'Solo los administradores de la banda pueden editar canciones'
            : 'Editar canciones del evento'
        }
      >
        <div className="inline-block">
          <Button
            isIconOnly
            radius="full"
            variant="light"
            size="sm"
            onClick={hasPermission ? handleOpen : undefined}
            isDisabled={!hasPermission}
            className={`group relative overflow-hidden shadow-sm transition-all duration-300 ${
              hasPermission
                ? 'hover:scale-105 hover:shadow-lg active:scale-95'
                : 'cursor-not-allowed opacity-50'
            }`}
            aria-label="Editar canciones del evento"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-100 via-brand-pink-50 to-brand-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <EditIcon className="relative z-10 text-brand-purple-600 transition-colors duration-300 group-hover:text-brand-purple-700" />
          </Button>
        </div>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleModalChange}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          base: 'bg-white max-h-[85vh]',
          header: 'border-b border-brand-purple-100 py-3',
          body: 'py-3',
          footer: 'border-t border-brand-purple-100 py-3',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 shadow-sm">
                    <EditIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-lg font-bold text-transparent">
                      Editar Canciones
                    </h3>
                    <p className="text-[10px] font-normal text-slate-500">
                      Arrastra • Ajusta el tono • Elimina
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-2">
                  {/* Songs List */}
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="songOrder">
                      {(provided, snapshot) => (
                        <div
                          className={`relative flex max-h-[50vh] w-full flex-col gap-2 overflow-y-auto rounded-xl border-2 p-2 transition-all duration-200 ${
                            snapshot.isDraggingOver
                              ? 'border-brand-purple-400 bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 shadow-lg'
                              : 'border-brand-purple-100 bg-white shadow-sm'
                          }`}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {songOrder.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                              <div className="text-3xl">🎵</div>
                              <p className="text-xs text-slate-500">
                                No hay canciones en este evento
                              </p>
                            </div>
                          ) : (
                            songOrder.map((data, index) => (
                              <UpdateElementCard
                                key={data.song.id}
                                data={data}
                                index={index}
                                songOrder={songOrder}
                                setSongOrder={setSongOrder}
                                params={params}
                                songsToDelete={songsToDelete}
                                setSongsToDelete={setSongsToDelete}
                              />
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {/* Delete Counter */}
                  {songsToDelete.length > 0 && (
                    <div className="rounded-lg bg-red-50 p-2 shadow-sm">
                      <p className="text-xs font-semibold text-red-600">
                        🗑️ {songsToDelete.length}{' '}
                        {songsToDelete.length === 1 ? 'canción' : 'canciones'}{' '}
                        marcada{songsToDelete.length === 1 ? '' : 's'} para
                        eliminar
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button
                  color="danger"
                  variant="light"
                  isDisabled={isPending || isPendingDeleteSongs}
                  onPress={handleCancel}
                  className="font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={isPending || isPendingDeleteSongs}
                  onPress={handleSaveChanges}
                  className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  {isPending || isPendingDeleteSongs
                    ? 'Guardando...'
                    : 'Guardar Cambios'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
