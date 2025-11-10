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
import { TrashIcon, MusicNoteIcon, EditIcon } from '@global/icons';
import { songTypes } from '@global/config/constants';
import Link from 'next/link';
import { $SelectedSong } from '@stores/player';
import { useStore } from '@nanostores/react';
import { useDeleteSong } from '../_hooks/useDeleteSong';
import { useEditSong } from '../_hooks/useEditSong';
import { FormAddNewSong } from '@bands/[bandId]/eventos/[eventId]/_components/addSongToEvent/FormAddNewSong';

export const SongTableRow = ({
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

  // Preparar datos para edición (convertir SongPropsWithCount a SongPropsWithoutId)
  const songDataForEdit = {
    title: song.title,
    artist: song.artist,
    songType: song.songType,
    youtubeLink: song.youtubeLink,
    key: song.key,
    tempo: song.tempo,
  };

  const {
    form,
    setForm,
    isOpen: isEditOpen,
    onOpenChange: onEditOpenChange,
    handleChange,
    handleUpdateSong,
    handleOpenModal,
    statusUpdateSong,
  } = useEditSong({
    bandId,
    songId: song.id.toString(),
    refetch: refetch || (() => {}),
    songData: songDataForEdit,
  });

  const isSelected = selectedSong?.id === song.id;

  return (
    <>
      <tr
        className={`group border-b border-slate-100 transition-colors duration-150 hover:bg-brand-purple-50/50 ${
          isSelected ? 'bg-brand-purple-100/30' : ''
        }`}
      >
        {/* Título - Mobile y Desktop */}
        <td className="px-3 py-3 sm:px-4 sm:py-3.5">
          <Link
            href={`/grupos/${bandId}/canciones/${song.id}`}
            className="flex flex-col gap-1"
          >
            <span className="font-medium text-slate-800 transition-colors group-hover:text-brand-purple-700">
              {song.title}
            </span>
            {/* Badges móvil - solo visible en mobile */}
            <div className="flex flex-wrap gap-1.5 sm:hidden">
              <span className="rounded bg-brand-purple-100 px-1.5 py-0.5 text-xs text-brand-purple-700">
                {songTypes[song.songType].es}
              </span>
              {song.artist && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                  {song.artist}
                </span>
              )}
              {song.key && (
                <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-blue-700">
                  {song.key}
                </span>
              )}
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                {song._count.events} eventos
              </span>
              {song._count.lyrics === 0 && (
                <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
                  Sin letra
                </span>
              )}
            </div>
          </Link>
        </td>

        {/* Artista - Solo Desktop */}
        <td className="hidden px-4 py-3.5 sm:table-cell">
          {song.artist ? (
            <span className="text-sm text-slate-600">{song.artist}</span>
          ) : (
            <span className="text-xs italic text-slate-400">Sin artista</span>
          )}
        </td>

        {/* Tonalidad - Solo Desktop */}
        <td className="hidden px-4 py-3.5 sm:table-cell">
          {song.key ? (
            <span className="inline-flex rounded-lg bg-blue-100 px-2.5 py-1 font-mono text-xs font-semibold text-blue-700">
              {song.key}
            </span>
          ) : (
            <span className="text-xs italic text-slate-400">-</span>
          )}
        </td>

        {/* Tipo - Solo Desktop */}
        <td className="hidden px-4 py-3.5 sm:table-cell">
          <span className="inline-flex rounded-lg bg-gradient-to-r from-brand-purple-100 to-brand-blue-100 px-2.5 py-1 text-xs font-medium text-brand-purple-700">
            {songTypes[song.songType].es}
          </span>
        </td>

        {/* Eventos - Solo Desktop */}
        <td className="hidden px-4 py-3.5 text-center text-sm text-slate-600 sm:table-cell">
          {song._count.events}
        </td>

        {/* Estado Letra - Solo Desktop */}
        <td className="hidden px-4 py-3.5 sm:table-cell">
          {song._count.lyrics === 0 ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-100 to-orange-100 px-2.5 py-1 text-xs font-medium text-red-700">
              ⚠️ Sin letra
            </span>
          ) : (
            <span className="text-sm text-emerald-600">✓</span>
          )}
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
                startContent={<MusicNoteIcon className="h-5 w-5" />}
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
                key="editar"
                onClick={handleOpenModal}
                startContent={<EditIcon className="h-5 w-5" />}
              >
                Editar canción
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={onOpen}
                startContent={<TrashIcon className="h-4 w-4" />}
              >
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>

      {/* Modal de confirmación */}
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

      {/* Modal de edición */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar canción
              </ModalHeader>
              <ModalBody>
                <FormAddNewSong
                  form={form}
                  setForm={setForm}
                  handleChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  isLoading={statusUpdateSong === 'pending'}
                  disabled={statusUpdateSong === 'success'}
                  color="primary"
                  onPress={handleUpdateSong}
                >
                  Actualizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
