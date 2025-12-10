'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { SongVideoLyrics } from '../../_interfaces/songsInterface';

interface EditVideoLyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: SongVideoLyrics | null;
  onSave: (
    videoId: number,
    data: Partial<{
      title?: string;
      videoType?: 'instrumental' | 'full';
      description?: string;
      priority?: number;
      usesVideoLyrics?: boolean;
    }>,
  ) => void;
  isLoading?: boolean;
}

export const EditVideoLyricsModal = ({
  isOpen,
  onClose,
  video,
  onSave,
  isLoading,
}: EditVideoLyricsModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    videoType: 'instrumental' as 'instrumental' | 'full',
    description: '',
    priority: '999',
    usesVideoLyrics: true,
  });

  // Reset form when video changes
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        videoType: video.videoType,
        description: video.description || '',
        priority: video.priority.toString(),
        usesVideoLyrics: video.usesVideoLyrics,
      });
    }
  }, [video]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return;

    onSave(video.id, {
      title: formData.title || undefined,
      videoType: formData.videoType,
      description: formData.description || undefined,
      priority: parseInt(formData.priority),
      usesVideoLyrics: formData.usesVideoLyrics,
    });
  };

  if (!video) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            Editar Video con Lyrics
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
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
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
