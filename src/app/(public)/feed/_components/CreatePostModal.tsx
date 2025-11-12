'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Select,
  SelectItem,
  Input,
} from '@nextui-org/react';
import { CreatePostDto, PostType } from '../_interfaces/feedInterface';
import { extractYouTubeId, isValidYouTubeId } from '@global/utils/formUtils';
import { useBandSongsWebSocket } from '@global/hooks/useBandSongsWebSocket';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostDto) => void;
  isLoading?: boolean;
  userBands: Array<{ id: number; name: string }>;
  bandSongs?: Array<{ id: number; title: string; artist: string | null }>;
  selectedBandId?: number;
  onBandChange?: (bandId: number) => void;
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  userBands,
  bandSongs = [],
  selectedBandId,
  onBandChange,
}: CreatePostModalProps) => {
  const [postType, setPostType] = useState<PostType>('SONG_SHARE');
  const [bandId, setBandId] = useState<string>(
    selectedBandId?.toString() || '',
  );

  // Conectar al WebSocket para actualizaciones en tiempo real de canciones
  useBandSongsWebSocket({
    bandId: selectedBandId,
    enabled: isOpen && !!selectedBandId,
  });
  const [content, setContent] = useState('');
  const [sharedSongId, setSharedSongId] = useState('');
  const [requestedSongTitle, setRequestedSongTitle] = useState('');
  const [requestedSongArtist, setRequestedSongArtist] = useState('');
  const [requestedYoutubeUrl, setRequestedYoutubeUrl] = useState('');

  const handleYouTubeChange = (value: string) => {
    const videoId = extractYouTubeId(value);
    setRequestedYoutubeUrl(videoId);
  };

  const handleSubmit = () => {
    let title = '';

    // Generar título según el tipo de post
    if (postType === 'SONG_SHARE' && sharedSongId) {
      // Para SONG_SHARE: usar el título de la canción seleccionada
      const selectedSong = bandSongs.find(
        (song) => song.id === parseInt(sharedSongId),
      );
      title = selectedSong ? selectedSong.title : 'Canción compartida';
    } else if (postType === 'SONG_REQUEST' && requestedSongTitle) {
      // Para SONG_REQUEST: usar el título solicitado
      title = requestedSongTitle;
    }

    const data: CreatePostDto = {
      type: postType,
      bandId: parseInt(bandId),
      title,
    };

    // El contenido va como descripción opcional
    if (content.trim()) {
      data.description = content.trim();
    }

    if (postType === 'SONG_SHARE' && sharedSongId) {
      data.sharedSongId = parseInt(sharedSongId);
    }

    if (postType === 'SONG_REQUEST') {
      data.requestedSongTitle = requestedSongTitle;
      if (requestedSongArtist.trim()) {
        data.requestedArtist = requestedSongArtist.trim();
      }
      if (requestedYoutubeUrl.trim()) {
        data.requestedYoutubeUrl = requestedYoutubeUrl.trim();
      }
    }

    onSubmit(data);
  };

  const handleClose = () => {
    setPostType('SONG_SHARE');
    setContent('');
    setSharedSongId('');
    setRequestedSongTitle('');
    setRequestedSongArtist('');
    setRequestedYoutubeUrl('');
    onClose();
  };

  const isValid = () => {
    if (!bandId) return false;

    if (postType === 'SONG_SHARE') {
      return !!sharedSongId;
    }

    if (postType === 'SONG_REQUEST') {
      return requestedSongTitle.trim().length > 0;
    }

    return false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Crear publicación
        </ModalHeader>
        <ModalBody>
          {/* Selector de tipo de post */}
          <div className="flex gap-2">
            <Button
              color={postType === 'SONG_SHARE' ? 'success' : 'default'}
              variant={postType === 'SONG_SHARE' ? 'solid' : 'flat'}
              onPress={() => setPostType('SONG_SHARE')}
              className="flex-1"
            >
              🎵 Compartir Canción
            </Button>
            <Button
              color={postType === 'SONG_REQUEST' ? 'warning' : 'default'}
              variant={postType === 'SONG_REQUEST' ? 'solid' : 'flat'}
              onPress={() => setPostType('SONG_REQUEST')}
              className="flex-1"
            >
              🙏 Solicitar Canción
            </Button>
          </div>

          {/* Selector de banda */}
          <Select
            label="Banda"
            placeholder="Selecciona una banda"
            selectedKeys={bandId ? [bandId] : []}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys).join('');
              setBandId(selectedValue);
              // Notificar al componente padre para que haga fetch de canciones
              if (selectedValue && onBandChange) {
                onBandChange(parseInt(selectedValue));
              }
            }}
            isRequired
          >
            {userBands.map((band) => (
              <SelectItem key={band.id.toString()}>{band.name}</SelectItem>
            ))}
          </Select>

          {/* Contenido opcional */}
          <Textarea
            label="Mensaje (opcional)"
            placeholder={
              postType === 'SONG_SHARE'
                ? 'Escribe algo sobre esta canción...'
                : 'Explica por qué necesitas esta canción...'
            }
            value={content}
            onValueChange={setContent}
            maxRows={4}
          />

          {/* Campos específicos según el tipo */}
          {postType === 'SONG_SHARE' && (
            <Select
              label="Canción a compartir"
              placeholder="Selecciona una canción"
              selectedKeys={sharedSongId ? [sharedSongId] : []}
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys).join('');
                setSharedSongId(selectedValue);
              }}
              isRequired
              description="Solo aparecen canciones de la banda seleccionada"
            >
              {bandSongs.map((song) => (
                <SelectItem key={song.id.toString()} textValue={song.title}>
                  <div className="flex flex-col">
                    <span className="font-semibold">{song.title}</span>
                    {song.artist && (
                      <span className="text-small text-default-500">
                        {song.artist}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </Select>
          )}

          {postType === 'SONG_REQUEST' && (
            <>
              <Input
                label="Título de la canción"
                placeholder="Ej: Aquí Estoy"
                value={requestedSongTitle}
                onValueChange={setRequestedSongTitle}
                isRequired
              />
              <Input
                label="Artista (opcional)"
                placeholder="Ej: Hillsong United"
                value={requestedSongArtist}
                onValueChange={setRequestedSongArtist}
              />
              <Input
                label="Link de YouTube (opcional)"
                placeholder="https://youtube.com/watch?v=... o dQw4w9WgXcQ"
                value={requestedYoutubeUrl}
                onValueChange={handleYouTubeChange}
                isClearable
                onClear={() => setRequestedYoutubeUrl('')}
                description={
                  requestedYoutubeUrl && isValidYouTubeId(requestedYoutubeUrl)
                    ? '✓ ID válido'
                    : 'Pega el link completo o solo el ID del video'
                }
                classNames={{
                  description:
                    requestedYoutubeUrl && isValidYouTubeId(requestedYoutubeUrl)
                      ? 'text-green-600 font-medium'
                      : 'text-default-500',
                }}
                startContent={<span className="text-sm">🎬</span>}
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!isValid()}
          >
            Publicar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
