import { MusicNoteIcon, EditIcon, TrashIcon } from '@global/icons';
import { Draggable } from '@hello-pangea/dnd';
import { SongCardWithControlsProps } from '../_interfaces/songCardInterfaces';
import { SongCardContent } from './SongCardContent';
import { SongDragHandle } from './SongDragHandle';
import { TransposeControlPopover } from './TransposeControlPopover';
import Link from 'next/link';
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { eventDeleteSongs } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/updatingElements/services/updatingEventSongsService';
import toast from 'react-hot-toast';

export const SongCardWithControls = ({
  data,
  index,
  isAdminEvent,
  songOrder,
  setSongOrder,
  params,
  refetch,
}: SongCardWithControlsProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: mutateDeleteSongs, isPending: isPendingDeleteSongs } =
    eventDeleteSongs({ params });

  const handleDeleteSong = () => {
    mutateDeleteSongs(
      { songIds: [data.song.id] },
      {
        onSuccess: () => {
          toast.success('Canción eliminada correctamente');
          refetch();
          onOpenChange();
        },
        onError: () => {
          toast.error('Error al eliminar la canción');
        },
      },
    );
  };

  // Si no es admin, mostrar sin drag & drop ni botones
  if (!isAdminEvent) {
    return (
      <div className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-brand-purple-200 hover:shadow-md dark:bg-black">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-sm font-bold text-brand-purple-700">
          {data.order}
        </span>
        <SongCardContent data={data} />
        <div className="text-slate-300 transition-colors duration-200 group-hover:text-brand-purple-400">
          <MusicNoteIcon className="h-5 w-5" />
        </div>
      </div>
    );
  }

  // Con drag & drop y botones para admins
  return (
    <>
      <Draggable draggableId={data.song.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-200 ${
              snapshot.isDragging
                ? 'z-50 scale-105 border-brand-purple-400 bg-brand-purple-50 shadow-2xl dark:border-brand-purple-800 dark:bg-brand-purple-800'
                : 'border-slate-200 bg-white shadow-sm hover:border-brand-purple-300 hover:shadow-md dark:border-gray-700 dark:bg-black dark:hover:border-brand-purple-400'
            }`}
          >
            {/* Drag Handle */}
            <SongDragHandle dragHandleProps={provided.dragHandleProps} />

            {/* Número de orden */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-sm font-bold text-brand-purple-700">
              {data.order}
            </span>

            {/* Información de la canción */}
            <SongCardContent data={data} />

            {/* Controles de transposición */}
            <TransposeControlPopover
              data={data}
              index={index}
              songOrder={songOrder}
              setSongOrder={setSongOrder}
            />

            {/* Edit Button */}
            <Link
              href={`/grupos/${params.bandId}/canciones/${data.song.id}`}
              className="rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-brand-blue-100 active:scale-95 dark:hover:bg-brand-blue-900"
              title="Editar canción"
            >
              <EditIcon className="h-4 w-4 text-brand-blue-600 dark:text-brand-blue-400" />
            </Link>

            {/* Delete Button */}
            <button
              onClick={onOpen}
              className="rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-red-100 active:scale-95 dark:hover:bg-red-900"
              title="Eliminar canción"
            >
              <TrashIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
            </button>
          </div>
        )}
      </Draggable>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar canción del evento
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar &quot;{data.song.title}
                  &quot; de este evento?
                </p>
                <p className="text-sm text-slate-500">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isPendingDeleteSongs}
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteSong}
                  isLoading={isPendingDeleteSongs}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
