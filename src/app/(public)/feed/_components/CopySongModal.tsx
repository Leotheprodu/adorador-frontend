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
} from '@nextui-org/react';
import { CopySongDto } from '../_interfaces/feedInterface';

interface CopySongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CopySongDto) => void;
  isLoading?: boolean;
  userBands: Array<{ id: number; name: string }>;
  songTitle: string;
  currentKey?: string | null;
  currentTempo?: number | null;
  suggestedKey?: string;
  suggestedTempo?: number | null;
}

export const CopySongModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  userBands,
  songTitle,
  currentKey,
  currentTempo,
  suggestedKey,
  suggestedTempo,
}: CopySongModalProps) => {
  const [targetBandId, setTargetBandId] = useState('');

  const handleSubmit = () => {
    const data: CopySongDto = {
      targetBandId: parseInt(targetBandId),
    };

    // Si hay tono sugerido (transpuesto), usarlo
    if (suggestedKey) {
      data.newKey = suggestedKey;
    }

    // Si hay tempo sugerido, usarlo
    if (suggestedTempo) {
      data.newTempo = suggestedTempo;
    }

    onSubmit(data);
  };

  const handleClose = () => {
    setTargetBandId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Copiar canción a mi banda
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <p className="text-small text-foreground-600">
              Vas a copiar: <span className="font-semibold">{songTitle}</span>
            </p>
            {currentKey && (
              <p className="mt-2 text-small text-foreground-500">
                Tono original: <span className="font-medium">{currentKey}</span>
                {suggestedKey && suggestedKey !== currentKey && (
                  <span className="ml-2 text-primary">
                    → Nuevo tono:{' '}
                    <span className="font-bold">{suggestedKey}</span>
                  </span>
                )}
              </p>
            )}
            {currentTempo && (
              <p className="text-small text-foreground-500">
                BPM: {suggestedTempo || currentTempo}
              </p>
            )}
          </div>

          <Select
            label="Banda destino"
            placeholder="Selecciona una banda"
            selectedKeys={targetBandId ? [targetBandId] : []}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys).join('');
              setTargetBandId(selectedValue);
            }}
            isRequired
          >
            {userBands.map((band) => (
              <SelectItem key={band.id.toString()}>{band.name}</SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            isDisabled={!targetBandId}
          >
            Copiar Canción
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
