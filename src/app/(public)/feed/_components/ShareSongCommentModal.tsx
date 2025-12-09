'use client';

import { useState } from 'react';
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
} from "@heroui/react";
import { getBandsOfUser } from '@bands/_services/bandsService';
import { getSongsOfBandForFeed } from '../_services/feedService';

interface ShareSongCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (songId: number, description: string) => void;
  isSharing?: boolean;
}

export const ShareSongCommentModal = ({
  isOpen,
  onClose,
  onShare,
  isSharing,
}: ShareSongCommentModalProps) => {
  const [selectedBandId, setSelectedBandId] = useState<number | null>(null);
  const [selectedSongId, setSelectedSongId] = useState<string>('');
  const [description, setDescription] = useState('');

  // Obtener bandas del usuario
  const { data: bands, isLoading: isLoadingBands } = getBandsOfUser(isOpen);

  // Obtener canciones de la banda seleccionada
  const { data: songsData, isLoading: isLoadingSongs } = getSongsOfBandForFeed(
    selectedBandId || 0,
    !!selectedBandId,
  );

  const handleShare = () => {
    if (!selectedSongId) return;
    onShare(Number(selectedSongId), description);
  };

  const handleClose = () => {
    setSelectedBandId(null);
    setSelectedSongId('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          🎵 Compartir Canción en Respuesta
        </ModalHeader>
        <ModalBody>
          <p className="text-small text-foreground-500">
            Selecciona una canción de tus bandas para compartir como respuesta a
            esta solicitud.
          </p>

          {/* Selector de Banda */}
          <Select
            label="Selecciona tu banda"
            placeholder="Elige una banda"
            selectedKeys={
              selectedBandId
                ? new Set([selectedBandId.toString()])
                : new Set([])
            }
            onSelectionChange={(keys) => {
              const bandId = Array.from(keys)[0] as string;
              setSelectedBandId(Number(bandId));
              setSelectedSongId(''); // Reset song selection
            }}
            isLoading={isLoadingBands}
          >
            {bands?.map((band) => (
              <SelectItem key={band.id.toString()}>
                {band.name}
              </SelectItem>
            )) ?? []}
          </Select>

          {/* Selector de Canción */}
          {selectedBandId && (
            <Select
              label="Selecciona la canción"
              placeholder="Elige una canción"
              selectedKeys={
                selectedSongId ? new Set([selectedSongId]) : new Set([])
              }
              onSelectionChange={(keys) => {
                const songId = Array.from(keys)[0] as string;
                setSelectedSongId(songId);
              }}
              isLoading={isLoadingSongs}
              isDisabled={!selectedBandId}
              items={songsData ?? []}
            >
              {(song) => (
                <SelectItem
                  key={song.id.toString()}
                  textValue={`${song.title}${song.artist ? ` - ${song.artist}` : ''}`}
                >
                  {song.title}
                  {song.artist && ` - ${song.artist}`}
                </SelectItem>
              )}
            </Select>
          )}

          {/* Descripción opcional */}
          <Textarea
            label="Mensaje (opcional)"
            placeholder="Agrega un mensaje personalizado..."
            value={description}
            onValueChange={setDescription}
            minRows={2}
            maxRows={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            color="success"
            onPress={handleShare}
            isLoading={isSharing}
            isDisabled={!selectedSongId}
          >
            Compartir Canción
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
