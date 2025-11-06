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
      className={`group relative overflow-hidden rounded-xl border-2 bg-gradient-to-br from-white to-brand-purple-50/30 p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-xl ${
        selectedSong?.id === song.id
          ? 'border-brand-purple-400 ring-2 ring-brand-purple-200'
          : 'border-transparent hover:border-brand-purple-200'
      }`}
    >
      {/* Efecto decorativo en hover */}
      <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-brand-purple-200 to-brand-blue-200 opacity-0 blur-2xl transition-opacity duration-200 group-hover:opacity-100"></div>

      <div className="relative z-10">
        {/* Header con título y menú */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <Link
            href={`/grupos/${bandId}/canciones/${song.id}`}
            className="flex-1"
          >
            <h3 className="font-semibold text-slate-800 transition-colors duration-200 group-hover:text-brand-purple-700">
              {song.title}
            </h3>
          </Link>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="min-w-0 rounded-lg p-1.5 transition-all duration-200 hover:bg-brand-purple-100 active:scale-95"
                aria-label="Menú de opciones"
              >
                <MenuButtonIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disabledKeys={song._count.lyrics > 0 ? ['delete'] : []}
            >
              <DropdownItem
                as={Link}
                href={`/grupos/${bandId}/canciones/${song.id}`}
                key="Ir"
                startContent={<span className="text-lg">🎵</span>}
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
                startContent={<span className="text-lg">▶️</span>}
              >
                Escuchar
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={onOpen}
                startContent={<span className="text-lg">🗑️</span>}
              >
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Badges informativos */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-brand-purple-100 to-brand-blue-100 px-2.5 py-1 text-xs font-medium text-brand-purple-700 shadow-sm">
            {songTypes[song.songType].es}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
            📅 {song._count.events}
          </span>
          {song._count.lyrics === 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-100 to-orange-100 px-2.5 py-1 text-xs font-medium text-red-700 shadow-sm">
              ⚠️ Sin Letra
            </span>
          )}
        </div>
      </div>

      {/* Modal de confirmación mejorado */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 bg-gradient-to-r from-red-50 to-orange-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-xl shadow-md">
                    ⚠️
                  </div>
                  <div>
                    <h2 className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-xl font-bold text-transparent">
                      Confirmar Eliminación
                    </h2>
                    <p className="text-xs font-normal text-slate-500">
                      Esta acción es permanente
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                <p className="text-slate-700">
                  ¿Estás seguro de que deseas eliminar la canción{' '}
                  <strong className="text-brand-purple-700">
                    &quot;{song.title}&quot;
                  </strong>
                  ?
                </p>
                <div className="mt-2 rounded-lg bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-700">
                    ⚠️ Esta acción no se puede deshacer
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="gap-2 bg-slate-50">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={statusDeleteSong === 'pending'}
                  disabled={statusDeleteSong === 'success'}
                  color="danger"
                  onPress={handleDeleteSong}
                  className="bg-gradient-to-r from-red-600 to-orange-600 font-semibold text-white shadow-md"
                >
                  Eliminar Canción
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
