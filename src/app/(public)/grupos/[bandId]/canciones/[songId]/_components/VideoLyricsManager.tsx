'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
  Chip,
  Divider,
  Spinner,
  Checkbox,
} from '@heroui/react';
import { toast } from 'react-hot-toast';
import { useVideoLyrics } from '../_hooks/useVideoLyrics';
import { getVideoLyricsService } from '../_services/videoLyricsService';
import { SongVideoLyrics } from '../../_interfaces/songsInterface';
import { YouTubePlayer } from '@global/components/YouTubePlayer';
import { CheckIcon, TrashIcon } from '@global/icons';

interface VideoLyricsManagerProps {
  bandId: string;
  songId: string;
}

export const VideoLyricsManager = ({
  bandId,
  songId,
}: VideoLyricsManagerProps) => {
  const {
    isFormOpen,
    setIsFormOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSetPreferred,
    isLoading,
  } = useVideoLyrics({ bandId, songId });

  const { data: videoLyrics, isLoading: isLoadingList } = getVideoLyricsService(
    { bandId, songId },
  );

  // Form state
  const [formData, setFormData] = useState({
    youtubeId: '',
    title: '',
    videoType: 'instrumental' as 'instrumental' | 'full',
    description: '',
    priority: '999',
    usesVideoLyrics: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.youtubeId.trim()) {
      toast.error('URL o ID de YouTube es requerido');
      return;
    }

    handleCreate({
      youtubeId: formData.youtubeId,
      title: formData.title || undefined,
      videoType: formData.videoType,
      description: formData.description || undefined,
      priority: parseInt(formData.priority),
      usesVideoLyrics: formData.usesVideoLyrics,
    });

    // Reset form
    setFormData({
      youtubeId: '',
      title: '',
      videoType: 'instrumental',
      description: '',
      priority: '999',
      usesVideoLyrics: true,
    });
  };

  const handleDeleteConfirm = (videoId: number, title?: string) => {
    if (
      confirm(`¿Estás seguro de eliminar el video ${title || 'sin título'}?`)
    ) {
      handleDelete(videoId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Videos con Lyrics</h2>
          <p className="text-sm text-default-500">
            Gestiona los videos de YouTube con instrumental y letras
          </p>
        </div>
        <Button
          color="primary"
          onPress={() => setIsFormOpen(!isFormOpen)}
          isDisabled={isLoading}
        >
          {isFormOpen ? 'Cancelar' : 'Agregar Video'}
        </Button>
      </div>

      {/* Add Form */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Nuevo Video con Lyrics</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="YouTube URL o ID"
                placeholder="https://youtube.com/watch?v=... o dQw4w9WgXcQ"
                value={formData.youtubeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, youtubeId: value })
                }
                isRequired
                description="URL completa o solo el ID del video de YouTube"
              />

              <Input
                label="Título (opcional)"
                placeholder="ej: Como en el cielo - Instrumental"
                value={formData.title}
                onValueChange={(value) =>
                  setFormData({ ...formData, title: value })
                }
              />

              <Select
                label="Tipo de Video"
                selectedKeys={[formData.videoType]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    videoType: e.target.value as 'instrumental' | 'full',
                  })
                }
                description="Instrumental = sin voces, Canción completa = con voces"
              >
                <SelectItem key="instrumental">
                  Instrumental (sin voces)
                </SelectItem>
                <SelectItem key="full">Canción completa (con voces)</SelectItem>
              </Select>

              <Textarea
                label="Descripción (opcional)"
                placeholder="ej: Versión en español, tono original, buena calidad"
                value={formData.description}
                onValueChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                minRows={2}
              />

              <Input
                type="number"
                label="Prioridad"
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
                description="Número menor = mayor prioridad (ej: 1, 2, 3...)"
                min="1"
              />

              <Checkbox
                isSelected={formData.usesVideoLyrics}
                onValueChange={(value) =>
                  setFormData({ ...formData, usesVideoLyrics: value })
                }
              >
                Usar lyrics del video
              </Checkbox>
              <p className="text-xs text-default-500">
                {formData.usesVideoLyrics
                  ? 'Las lyrics están en el video de YouTube'
                  : 'Sincronizar con lyrics de la base de datos (próximamente)'}
              </p>

              <div className="flex gap-2">
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Agregar
                </Button>
                <Button
                  variant="flat"
                  onPress={() => setIsFormOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* List of Video Lyrics */}
      {isLoadingList ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : videoLyrics && videoLyrics.length > 0 ? (
        <div className="grid gap-4">
          {videoLyrics.map((video: SongVideoLyrics) => (
            <Card key={video.id}>
              <CardBody>
                <div className="flex gap-4">
                  {/* Video Preview */}
                  <div className="w-64 flex-shrink-0">
                    <YouTubePlayer
                      youtubeUrl={video.youtubeId}
                      uniqueId={`video-lyrics-${video.id}`}
                      title={video.title || 'Video sin título'}
                      showControls={true}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">
                          {video.title || 'Sin título'}
                        </h4>
                        {video.description && (
                          <p className="mt-1 text-sm text-default-600">
                            {video.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleSetPreferred(video.id)}
                          isDisabled={isLoading}
                        >
                          {video.isPreferred ? (
                            <CheckIcon className="h-5 w-5 text-warning" />
                          ) : null}
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() =>
                            handleDeleteConfirm(video.id, video.title)
                          }
                          isDisabled={isLoading}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Chip size="sm" variant="flat" color="primary">
                        Prioridad: {video.priority}
                      </Chip>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          video.videoType === 'instrumental'
                            ? 'secondary'
                            : 'success'
                        }
                      >
                        {video.videoType === 'instrumental'
                          ? 'Instrumental'
                          : 'Canción completa'}
                      </Chip>
                      {video.usesVideoLyrics ? (
                        <Chip size="sm" variant="flat" color="warning">
                          Lyrics del video
                        </Chip>
                      ) : (
                        <Chip size="sm" variant="flat" color="default">
                          Lyrics sincronizadas
                        </Chip>
                      )}
                      {video.isPreferred && (
                        <Chip size="sm" variant="flat" color="warning">
                          ⭐ Preferido
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="py-8 text-center">
            <p className="text-default-500">
              No hay videos con lyrics agregados aún.
            </p>
            <Button
              color="primary"
              variant="flat"
              className="mt-4"
              onPress={() => setIsFormOpen(true)}
            >
              Agregar primer video
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
