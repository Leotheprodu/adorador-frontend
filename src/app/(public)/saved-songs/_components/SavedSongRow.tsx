import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { MenuButtonIcon } from '@global/icons/MenuButtonIcon';
import {
  TrashIcon,
  PlayIcon,
  XMarkIcon,
  MusicNoteIcon,
  CopyIcon,
} from '@global/icons';
import { songTypes } from '@global/config/constants';
import Link from 'next/link';
import { $SelectedSong } from '@stores/player';
import { useStore } from '@nanostores/react';
import { SavedSongItem } from '../_interfaces/savedSongsInterfaces';
import { deleteSavedSongService } from '@app/(public)/feed/_services/officialSongsService';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export const SavedSongRow = ({
  savedItem,
  refetch,
  onCopy,
}: {
  savedItem: SavedSongItem;
  refetch?: () => void;
  onCopy?: () => void;
}) => {
  const selectedSong = useStore($SelectedSong);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();
  const { song } = savedItem; // Destructure the nested song object

  // We use the ID of the song (savedItem.songId) to unsave it
  const { mutate: deleteMutate, isPending: isDeleting } =
    deleteSavedSongService(savedItem.songId);

  const handleDelete = () => {
    deleteMutate(undefined, {
      onSuccess: () => {
        toast.success('Canción eliminada de guardados');
        queryClient.invalidateQueries({
          queryKey: ['SavedSongs'],
        });
        refetch && refetch();
        onOpenChange();
      },
      onError: () => {
        toast.error('Error al eliminar canción');
      },
    });
  };

  const isSelected = selectedSong?.id === song.id;

  return (
    <>
      <tr
        className={`group border-b border-slate-100 transition-colors duration-150 hover:bg-brand-purple-50/50 dark:border-slate-800 dark:hover:bg-gray-900 ${
          isSelected
            ? 'bg-brand-purple-100/30 dark:bg-brand-purple-950/40'
            : 'bg-white dark:bg-gray-950'
        }`}
      >
        {/* Título */}
        <td className="px-3 py-3 sm:px-4 sm:py-3.5">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-slate-800 transition-colors group-hover:text-brand-purple-700 dark:text-slate-100 dark:group-hover:text-brand-purple-300">
              {song.title}
            </span>
            <div className="flex flex-wrap gap-1.5 sm:hidden">
              <span className="rounded bg-brand-purple-100 px-1.5 py-0.5 text-xs text-brand-purple-700 dark:bg-brand-purple-900 dark:text-brand-purple-200">
                {songTypes[song.songType]?.es || song.songType}
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {song.artist}
              </span>
              {song.key && (
                <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                  {song.key}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Artista - Desktop */}
        <td className="hidden px-4 py-3.5 sm:table-cell">
          <span className="text-sm text-slate-600">{song.artist}</span>
        </td>

        {/* Tonalidad - Desktop */}
        <td className="hidden px-4 py-3.5 sm:table-cell">
          {song.key ? (
            <span className="inline-flex rounded-lg bg-blue-100 px-2.5 py-1 font-mono text-xs font-semibold text-blue-700">
              {song.key}
            </span>
          ) : (
            <span className="text-xs italic text-slate-400">-</span>
          )}
        </td>

        {/* Tipo - Desktop */}
        <td className="hidden px-4 py-3.5 sm:table-cell">
          <span className="inline-flex rounded-lg bg-gradient-to-r from-brand-purple-100 to-brand-blue-100 px-2.5 py-1 text-xs font-medium text-brand-purple-700">
            {songTypes[song.songType]?.es || song.songType}
          </span>
        </td>

        {/* Acciones */}
        <td className="px-3 py-3 text-right sm:px-4 sm:py-3.5">
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="min-w-0 rounded-lg p-1.5 transition-all hover:bg-brand-purple-100 active:scale-95"
                aria-label="Menú"
              >
                <MenuButtonIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              classNames={{
                base: 'p-2 min-w-[200px]',
                list: 'gap-1',
              }}
            >
              <DropdownItem
                as={Link}
                href={`/grupos/${song.bandId}/canciones/${song.id}`}
                key="ir"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-100 to-brand-blue-100">
                    <MusicNoteIcon className="h-4 w-4 text-brand-purple-700" />
                  </div>
                }
                classNames={{
                  base: 'rounded-lg px-3 py-2.5 data-[hover=true]:bg-gradient-to-r data-[hover=true]:from-brand-purple-50 data-[hover=true]:to-brand-blue-50 dark:data-[hover=true]:from-brand-purple-900/40 dark:data-[hover=true]:to-brand-blue-900/40',
                  title:
                    'text-sm font-medium text-slate-700 dark:text-gray-200',
                }}
              >
                Ir a canción
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  if (!song.youtubeLink) return;
                  $SelectedSong.set({
                    id: song.id,
                    name: song.title,
                    youtubeLink: song.youtubeLink,
                    tempo: song.tempo,
                    startTime: song.startTime,
                    key: song.key,
                    bandId: String(song.bandId),
                    hasSyncedLyrics: true,
                    hasSyncedChords: true,
                  });
                }}
                key="escuchar"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-green-100">
                    <PlayIcon className="h-4 w-4 text-emerald-700" />
                  </div>
                }
                classNames={{
                  base: 'rounded-lg px-3 py-2.5 data-[hover=true]:bg-gradient-to-r data-[hover=true]:from-emerald-50 data-[hover=true]:to-green-50 dark:data-[hover=true]:from-emerald-900/40 dark:data-[hover=true]:to-green-900/40',
                  title:
                    'text-sm font-medium text-slate-700 dark:text-gray-200',
                }}
              >
                Escuchar
              </DropdownItem>
              <DropdownItem
                key="copy"
                onClick={onCopy}
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                    <CopyIcon className="h-4 w-4 text-blue-700" />
                  </div>
                }
                classNames={{
                  base: 'rounded-lg px-3 py-2.5 data-[hover=true]:bg-gradient-to-r data-[hover=true]:from-blue-50 data-[hover=true]:to-indigo-50 dark:data-[hover=true]:from-blue-900/40 dark:data-[hover=true]:to-indigo-900/40',
                  title:
                    'text-sm font-medium text-slate-700 dark:text-gray-200',
                }}
              >
                Copiar canción
              </DropdownItem>
              <DropdownItem
                key="delete"
                onClick={onOpen}
                className="text-danger"
                color="danger"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-100 to-rose-100">
                    <TrashIcon className="h-4 w-4 text-red-700" />
                  </div>
                }
                classNames={{
                  base: 'rounded-lg px-3 py-2.5 data-[hover=true]:bg-gradient-to-r data-[hover=true]:from-red-50 data-[hover=true]:to-rose-50',
                  title: 'text-sm font-medium text-red-700',
                }}
              >
                Quitar de guardados
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar acción
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas quitar "
                  <strong>{song.title}</strong>" de tus guardados?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isDeleting}
                >
                  Quitar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
