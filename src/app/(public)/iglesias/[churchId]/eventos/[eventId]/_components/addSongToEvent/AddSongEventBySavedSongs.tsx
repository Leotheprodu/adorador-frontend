import { getSongsOfChurch } from '@iglesias/[churchId]/canciones/_services/songsOfChurchService';
import { useStore } from '@nanostores/react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { $event } from '@stores/event';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { addSongsToEventService } from './services/AddSongsToEventService';

export const AddSongEventBySavedSongs = ({
  params,
  setIsOpenPopover,
  refetch,
}: {
  params: { churchId: string; eventId: string };
  setIsOpenPopover: (open: boolean) => void;
  refetch: () => void;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const eventSongs = useStore($event).songs;
  const { churchId } = params;
  const { data } = getSongsOfChurch({ churchId });
  const [selectedSongs, setSelectedSongs] = useState<
    { songId: number; order: number; transpose: number }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredSongs = data?.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.key?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const { status, mutate } = addSongsToEventService({ params });
  useEffect(() => {
    if (!isOpen) {
      setIsOpenPopover(true);
    }
  }, [isOpen, setIsOpenPopover]);

  useEffect(() => {
    if (status === 'success') {
      toast.success('Canciones agregadas al evento');
      refetch();
      setIsOpenPopover(false);
      onOpenChange();
    }
    if (status === 'error') {
      toast.error('Error al agregar canciones al evento');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  const handleSelectSong = (index: number) => {
    const songId = data ? data[index].id : null;
    const eventSongsLength = eventSongs.length;
    if (songId) {
      const isSelected = selectedSongs.some((song) => song.songId === songId);
      const isAlreadyInEvent = eventSongs.some(
        (song) => song.song.id === songId,
      );
      if (isAlreadyInEvent) {
        toast.error('La canción ya está en el evento');
        return;
      }
      if (isSelected) {
        setSelectedSongs(
          selectedSongs.filter((song) => song.songId !== songId),
        );
      } else {
        const newOrder = eventSongsLength + selectedSongs.length + 1;
        setSelectedSongs([
          ...selectedSongs,
          { songId, transpose: 0, order: newOrder },
        ]);
      }
    }
  };

  const handleAddSongToEvent = () => {
    mutate({ songDetails: selectedSongs });
  };

  return (
    <>
      <button
        onClick={() => {
          onOpen();
          setIsOpenPopover(false);
        }}
        className="rounded-xl px-1 py-2 duration-200 hover:bg-slate-200"
      >
        <div className="px-1 py-2">
          <div className="text-left text-small font-bold">
            Agregar desde catálogo
          </div>
          <div className="text-left text-tiny">
            Agrega canción al evento, desde el catálogo guardado de la iglesia.
          </div>
        </div>
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar canciones al evento (
                {selectedSongs && '+' + selectedSongs.length})
              </ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  placeholder="Buscar canciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4 w-full rounded-xl border-1 border-slate-300 px-2 py-1"
                />
                <ul className="flex h-[17rem] w-full flex-col justify-center gap-2 overflow-y-auto rounded-xl px-1 py-2">
                  {filteredSongs?.map((song, index) => (
                    <li
                      key={song.id}
                      className={`cursor-pointer rounded-xl px-1 py-2 duration-200 hover:bg-slate-200 ${selectedSongs.some((track) => track.songId === song.id) && 'bg-slate-200 hover:bg-slate-300'}`}
                      onClick={() => handleSelectSong(index)}
                    >
                      <p>
                        {song.title} {song.artist && '-' + song.artist}
                        {song.key && '-' + song.key}
                      </p>
                    </li>
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleAddSongToEvent}>
                  Agregar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
