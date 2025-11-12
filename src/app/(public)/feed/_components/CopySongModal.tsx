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
  Input,
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
}: CopySongModalProps) => {
  const [targetBandId, setTargetBandId] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newTempo, setNewTempo] = useState('');

  const handleSubmit = () => {
    const data: CopySongDto = {
      targetBandId: parseInt(targetBandId),
    };

    if (newKey.trim()) {
      data.newKey = newKey.trim();
    }

    if (newTempo.trim()) {
      data.newTempo = parseInt(newTempo);
    }

    onSubmit(data);
  };

  const handleClose = () => {
    setTargetBandId('');
    setNewKey('');
    setNewTempo('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Copiar canción a mi banda
        </ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <p className="text-small text-default-600">
              Vas a copiar: <span className="font-semibold">{songTitle}</span>
            </p>
            {currentKey && (
              <p className="text-small text-default-500">
                Tono actual: {currentKey}
              </p>
            )}
            {currentTempo && (
              <p className="text-small text-default-500">
                BPM actual: {currentTempo}
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

          <Input
            label="Nuevo tono (opcional)"
            placeholder={currentKey || 'Ej: C, D, Em'}
            value={newKey}
            onValueChange={setNewKey}
            description="Deja vacío para mantener el tono original"
          />

          <Input
            label="Nuevo BPM (opcional)"
            placeholder={currentTempo?.toString() || 'Ej: 120'}
            type="number"
            value={newTempo}
            onValueChange={setNewTempo}
            description="Deja vacío para mantener el tempo original"
          />
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
