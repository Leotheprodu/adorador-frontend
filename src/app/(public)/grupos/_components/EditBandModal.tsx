'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useUpdateBand } from '../_hooks/useUpdateBand';
import { useRouter } from 'next/navigation';
import { EditIcon } from '@global/icons';

interface EditBandModalProps {
  isOpen: boolean;
  onClose: () => void;
  bandId: number;
  currentName: string;
}

export const EditBandModal = ({
  isOpen,
  onClose,
  bandId,
  currentName,
}: EditBandModalProps) => {
  const [name, setName] = useState(currentName);
  const { updateBand, isUpdating } = useUpdateBand(bandId);
  const router = useRouter();

  useEffect(() => {
    setName(currentName);
  }, [currentName, isOpen]);

  const handleUpdate = async () => {
    const success = await updateBand(name);
    if (success) {
      onClose();
      router.refresh();
    }
  };

  const handleClose = () => {
    setName(currentName);
    onClose();
  };

  const isNameChanged = name.trim() !== currentName && name.trim() !== '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isDismissable={!isUpdating}
      hideCloseButton={isUpdating}
      size="md"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <EditIcon className="h-5 w-5 text-brand-purple-600" /> Editar Grupo
          </h3>
          <p className="text-sm font-normal text-slate-600">
            Cambia el nombre del grupo
          </p>
        </ModalHeader>
        <ModalBody>
          <Input
            label="Nombre del Grupo"
            type="text"
            placeholder="Ingresa el nuevo nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isDisabled={isUpdating}
            variant="bordered"
            isRequired
            autoFocus
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={handleClose}
            isDisabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleUpdate}
            isLoading={isUpdating}
            isDisabled={!isNameChanged}
          >
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
