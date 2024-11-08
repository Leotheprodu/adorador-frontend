import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { EditIcon } from '@global/icons/EditIcon';
import { EventSongsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { UpdateElementCard } from '@iglesias/[churchId]/eventos/[eventId]/_components/updatingElements/_components/UpdateElementCard';
import { eventUpdateSongs } from './_services/updatingEventSongsService';
import toast from 'react-hot-toast';

export const UpdatingSongList = ({
  songs,
  params,
  refetch,
}: {
  songs: EventSongsProps[];
  params: { churchId: string; eventId: string };
  refetch: () => void;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [songOrder, setSongOrder] = useState<EventSongsProps[]>([]);
  const { mutate, status, isPending } = eventUpdateSongs({ params });

  useEffect(() => {
    setSongOrder([...songs]);
  }, [songs]);

  useEffect(() => {
    if (status === 'success') {
      toast.success('Canciones actualizadas correctamente');
      refetch();
      onOpenChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
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

  const handleSaveChanges = () => {
    const updatedSongs = songOrder.map((song) => ({
      songId: song.song.id,
      transpose: song.transpose,
      order: song.order,
    }));
    mutate({ songDetails: updatedSongs });
  };

  return (
    <>
      <button
        className="rounded-full p-2 duration-200 hover:bg-slate-300"
        onClick={onOpen}
      >
        <EditIcon className="text-primary-500" />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar canciones del evento
              </ModalHeader>
              <ModalBody>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="songOrder">
                    {(provided) => (
                      <div
                        className="flex h-[10rem] w-full flex-col gap-2 overflow-y-auto rounded-lg bg-slate-100 p-2 text-slate-800"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {songOrder.map((data, index) => (
                          <UpdateElementCard
                            key={data.song.id}
                            data={data}
                            index={index}
                            songOrder={songOrder}
                            setSongOrder={setSongOrder}
                            params={params}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  isDisabled={isPending}
                  onPress={onClose}
                >
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  isLoading={isPending}
                  onPress={handleSaveChanges}
                >
                  Guardar cambios
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
