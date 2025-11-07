'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { useDeleteBand } from '../_hooks/useDeleteBand';
import { useRouter } from 'next/navigation';

interface DeleteBandModalProps {
  isOpen: boolean;
  onClose: () => void;
  bandId: number;
  bandName: string;
}

export const DeleteBandModal = ({
  isOpen,
  onClose,
  bandId,
  bandName,
}: DeleteBandModalProps) => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const { deleteBand, isDeleting } = useDeleteBand(bandId);
  const router = useRouter();

  const handleDelete = async () => {
    const success = await deleteBand(password, confirmation);
    if (success) {
      onClose();
      router.refresh();
    }
  };

  const handleClose = () => {
    setPassword('');
    setConfirmation('');
    onClose();
  };

  const confirmationText = 'estoy seguro que esto es irreversible';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isDismissable={!isDeleting}
      hideCloseButton={isDeleting}
      size="md"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-red-600">⚠️ Eliminar Grupo</h3>
          <p className="text-sm font-normal text-slate-600">
            Esta acción es irreversible
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
              <p className="mb-2 text-sm font-semibold text-red-800">
                Vas a eliminar: <span className="font-bold">{bandName}</span>
              </p>
              <p className="text-xs text-red-600">
                Se eliminarán todas las canciones, letras, acordes, eventos y
                membresías asociadas a este grupo.
              </p>
            </div>

            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDisabled={isDeleting}
              variant="bordered"
              isRequired
            />

            <div>
              <Input
                label="Confirmación"
                type="text"
                placeholder={`Escribe: ${confirmationText}`}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                isDisabled={isDeleting}
                variant="bordered"
                isRequired
              />
              <p className="mt-1 text-xs text-slate-500">
                Escribe exactamente:{' '}
                <span className="font-mono font-semibold">
                  {confirmationText}
                </span>
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={handleClose}
            isDisabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isDeleting}
            isDisabled={
              !password ||
              !confirmation ||
              confirmation.toLowerCase() !== confirmationText
            }
          >
            Eliminar Grupo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
