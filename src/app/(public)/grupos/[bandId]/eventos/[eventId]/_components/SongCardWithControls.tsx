import { MusicNoteIcon, EditIcon, TrashIcon, PlayIcon } from '@global/icons';
import { Draggable } from '@hello-pangea/dnd';
import { SongCardWithControlsProps } from '../_interfaces/songCardInterfaces';
import { SongCardContent } from './SongCardContent';
import { SongDragHandle } from './SongDragHandle';
import { TransposeControlPopover } from './TransposeControlPopover';
import Link from 'next/link';
import { $SelectedSong } from '@stores/player';
import { useStore } from '@nanostores/react';
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
  const selectedSong = useStore($SelectedSong);
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

  const handlePlaySong = () => {
    if (data.song.youtubeLink) {
      $SelectedSong.set({
        id: data.song.id,
        name: data.song.title,
        youtubeLink: data.song.youtubeLink,
      });
    }
  };

  const isSelected = selectedSong?.id === data.song.id;

  // Si no es admin, mostrar sin drag & drop ni botones
  if (!isAdminEvent) {
    return (
      <div
        className={`group flex items-center gap-3 rounded-lg border p-4 transition-all duration-300 hover:shadow-md dark:bg-black ${
          isSelected
            ? 'border-emerald-400 bg-emerald-50/50 shadow-md ring-1 ring-emerald-200 dark:border-emerald-600 dark:bg-emerald-950/20 dark:ring-emerald-800/30'
            : 'border-slate-200 bg-white shadow-sm hover:border-brand-purple-200 dark:border-slate-800'
        }`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
            isSelected
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg ring-2 ring-emerald-100 dark:ring-emerald-900/50'
              : 'bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-brand-purple-700'
          }`}
        >
          {data.order}
        </span>
        <SongCardContent data={data} />
        <div className="flex items-center gap-2">
          {data.song.youtubeLink && (
            <button
              onClick={handlePlaySong}
              className={`rounded-full p-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
                isSelected
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400'
                  : 'hover:bg-emerald-100 dark:hover:bg-emerald-900'
              }`}
              title="Reproducir canción"
            >
              <PlayIcon
                className={`h-5 w-5 ${isSelected ? 'text-emerald-700' : 'text-emerald-600 dark:text-emerald-400'}`}
              />
            </button>
          )}
          <div
            className={`transition-colors duration-200 ${
              isSelected
                ? 'text-emerald-500'
                : 'text-slate-300 group-hover:text-brand-purple-400'
            }`}
          >
            <MusicNoteIcon className="h-5 w-5" />
          </div>
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
            className={`group flex items-center gap-3 rounded-lg border-2 p-4 transition-all duration-300 ${
              snapshot.isDragging
                ? 'z-50 scale-105 border-brand-purple-400 bg-brand-purple-50 shadow-2xl dark:border-brand-purple-800 dark:bg-brand-purple-800'
                : isSelected
                  ? 'border-emerald-400 bg-emerald-50/50 shadow-lg ring-1 ring-emerald-200 dark:border-emerald-600 dark:bg-emerald-950/20 dark:ring-emerald-800/30'
                  : 'border-slate-200 bg-white shadow-sm hover:border-brand-purple-300 hover:shadow-md dark:border-gray-700 dark:bg-black dark:hover:border-brand-purple-400'
            }`}
          >
            {/* Drag Handle */}
            <SongDragHandle dragHandleProps={provided.dragHandleProps} />

            {/* Número de orden */}
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg ring-2 ring-emerald-100 dark:ring-emerald-900/50'
                  : 'bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 text-brand-purple-700'
              }`}
            >
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

            {/* Play Button */}
            {data.song.youtubeLink && (
              <button
                onClick={handlePlaySong}
                className={`rounded-full p-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400'
                    : 'hover:bg-emerald-100 dark:hover:bg-emerald-900'
                }`}
                title="Reproducir canción"
              >
                <PlayIcon
                  className={`h-4 w-4 ${isSelected ? 'text-emerald-700' : 'text-emerald-600 dark:text-emerald-400'}`}
                />
              </button>
            )}

            {/* Edit Button */}
            <Link
              href={`/grupos/${params.bandId}/canciones/${data.song.id}`}
              className="rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-brand-blue-100 active:scale-95 dark:hover:bg-brand-blue-900"
              title="Ir a canción"
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
