'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { getSongsOfBandForFeed } from '../_services/feedService';

interface ShareSongInCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { sharedSongId: number; content?: string }) => void;
  isLoading?: boolean;
  userBandId: number;
  isReply?: boolean; // Si es respuesta puede tener texto adicional
  placeholder?: string;
}

export const ShareSongInCommentModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  userBandId,
  isReply = false,
  placeholder = isReply ? 'Mensaje adicional (opcional)' : undefined,
}: ShareSongInCommentModalProps) => {
  const [selectedSongId, setSelectedSongId] = useState('');
  const [comment, setComment] = useState('');

  const songsQuery = getSongsOfBandForFeed(userBandId, isOpen);

  const handleSubmit = () => {
    if (!selectedSongId) return;

    const data: { sharedSongId: number; content?: string } = {
      sharedSongId: parseInt(selectedSongId),
    };

    // Solo agregar contenido si es respuesta y hay texto
    if (isReply && comment.trim()) {
      data.content = comment.trim();
    }

    onSubmit(data);
  };

  const handleClose = () => {
    setSelectedSongId('');
    setComment('');
    onClose();
  };

  // Resetear formulario cuando se abra el modal
  useEffect(() => {
    if (isOpen) {
      setSelectedSongId('');
      setComment('');
    }
  }, [isOpen]);

  const selectedSong = songsQuery.data?.find(
    (song) => song.id.toString() === selectedSongId,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      backdrop="blur"
      size="md"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Compartir Canción</h3>
          <p className="text-sm text-default-500">
            {isReply
              ? 'Selecciona una canción para compartir en tu respuesta'
              : 'Selecciona una canción de tu banda para compartir'}
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Selector de canción */}
            <Select
              label="Canción"
              placeholder="Selecciona una canción"
              selectedKeys={selectedSongId ? [selectedSongId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setSelectedSongId(selected ? selected.toString() : '');
              }}
              isLoading={songsQuery.isLoading}
              isDisabled={isLoading}
            >
              {(songsQuery.data || []).map((song) => (
                <SelectItem key={song.id.toString()} value={song.id.toString()}>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{song.title}</span>
                    {song.artist && (
                      <span className="text-xs text-default-500">
                        {song.artist}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </Select>

            {/* Preview de canción seleccionada */}
            {selectedSong && (
              <div className="rounded-lg bg-content2 p-3">
                <p className="mb-1 text-sm text-default-500">
                  Canción seleccionada:
                </p>
                <p className="font-medium">{selectedSong.title}</p>
                {selectedSong.artist && (
                  <p className="text-sm text-default-500">
                    {selectedSong.artist}
                  </p>
                )}
              </div>
            )}

            {/* Campo de texto adicional para respuestas */}
            {isReply && (
              <Textarea
                label="Mensaje adicional"
                placeholder={placeholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                minRows={2}
                maxRows={4}
                isDisabled={isLoading}
              />
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!selectedSongId}
          >
            Compartir Canción
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
