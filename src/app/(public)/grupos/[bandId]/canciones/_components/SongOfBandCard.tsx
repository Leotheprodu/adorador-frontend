import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Button,
} from '@nextui-org/react';
import { SongPropsWithCount } from '../_interfaces/songsInterface';
import { MenuButtonIcon } from '@global/icons/MenuButtonIcon';
import { songTypes } from '@global/config/constants';
import Link from 'next/link';
import { $SelectedSong } from '@stores/player';
import { useStore } from '@nanostores/react';
import { useDeleteSong } from '../_hooks/useDeleteSong';

export const SongOfBandCard = ({
  song,
  bandId,
  refetch,
}: {
  song: SongPropsWithCount;
  bandId: string;
  refetch?: () => void;
}) => {
  const selectedSong = useStore($SelectedSong);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { handleDeleteSong, statusDeleteSong } = useDeleteSong({
    bandId,
    songId: song.id.toString(),
    onSuccess: refetch,
    redirectOnDelete: false,
  });
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border-1 ${selectedSong?.id === song.id ? 'border-primary-500' : 'border-slate-100'} p-2`}
    >
      <div>
        <div className="flex gap-2">
          <h1>{song.title}</h1>
          <Dropdown>
            <DropdownTrigger>
              <button>
                <MenuButtonIcon />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              disabledKeys={song._count.lyrics > 0 ? ['delete'] : []}
            >
              <DropdownItem
                as={Link}
                href={`/grupos/${bandId}/canciones/${song.id}`}
                key="Ir"
              >
                Ir a canción
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  if (song.youtubeLink === null || song.youtubeLink === '') {
                    return;
                  }
                  $SelectedSong.set({
                    id: song.id,
                    name: song.title,
                    youtubeLink: song.youtubeLink,
                  });
                }}
                key="escuchar"
              >
                Escuchar
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={onOpen}
              >
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex flex-wrap gap-1">
          <small className="rounded-sm bg-slate-200 px-2 py-1">
            {songTypes[song.songType].es}
          </small>
          <small className="rounded-sm bg-slate-200 px-2 py-1">
            {song._count.events}{' '}
            {song._count.events === 1 ? 'evento' : 'eventos'}
          </small>
          {song._count.lyrics === 0 && (
            <small className="rounded-sm bg-danger-100 px-2 py-1">
              Sin Letra
            </small>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar eliminación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar la canción{' '}
                  <strong>&quot;{song.title}&quot;</strong>?
                </p>
                <p className="text-sm text-danger">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  isLoading={statusDeleteSong === 'pending'}
                  disabled={statusDeleteSong === 'success'}
                  color="danger"
                  onPress={handleDeleteSong}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
