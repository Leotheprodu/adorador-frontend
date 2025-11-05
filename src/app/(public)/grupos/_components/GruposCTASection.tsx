'use client';

import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { BandsProps } from '@bands/_interfaces/bandsInterface';
import { PrimaryButton } from '@global/components/buttons';

export const GruposCTASection = () => {
  const user = useStore($user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [bandName, setBandName] = useState('');

  const {
    data: newBand,
    mutate: createBand,
    status: createBandStatus,
  } = PostData<BandsProps, { name: string }>({
    key: 'CreateBand',
    url: `${Server1API}/bands`,
    method: 'POST',
  });

  const handleCreateBand = () => {
    if (bandName.trim() === '') {
      toast.error('El nombre del grupo es obligatorio');
      return;
    }

    createBand({ name: bandName });
  };

  useEffect(() => {
    if (createBandStatus === 'success' && newBand) {
      toast.success('Grupo creado exitosamente');
      router.push(`/grupos/${newBand.id}`);
    }
    if (createBandStatus === 'error') {
      toast.error('Error al crear el grupo');
    }
  }, [createBandStatus, newBand, router]);

  // Usuario NO logueado
  if (!user.isLoggedIn) {
    return (
      <div className="border-brand-purple-200 bg-gradient-light mt-12 rounded-2xl border p-8 text-center shadow-lg">
        <h3 className="mb-3 text-2xl font-bold text-gray-900">
          ¿Quieres que tu grupo aparezca aquí?
        </h3>
        <p className="mb-6 text-gray-600">
          Únete a Adorador y comienza a gestionar tu ministerio de alabanza de
          manera profesional
        </p>
        <PrimaryButton
          href="/auth/login"
          endContent={<span className="text-lg">→</span>}
        >
          Registrar mi grupo
        </PrimaryButton>
      </div>
    );
  }

  // Usuario LOGUEADO
  return (
    <>
      <div className="bg-gradient-light mt-12 rounded-2xl border border-success-200 p-8 text-center shadow-lg">
        <h3 className="mb-3 text-2xl font-bold text-gray-900">
          ¿Listo para crear un nuevo grupo?
        </h3>
        <p className="mb-6 text-gray-600">
          Crea tu grupo de alabanza y comienza a organizarte mejor
        </p>
        <PrimaryButton onPress={onOpen}>+ Crear nuevo grupo</PrimaryButton>
      </div>

      {/* Modal para crear grupo */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear nuevo grupo de alabanza
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre del grupo"
                  placeholder="Ej: Adoradores de la Luz"
                  variant="bordered"
                  value={bandName}
                  onChange={(e) => setBandName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateBand();
                    }
                  }}
                  description="Este será el nombre visible de tu grupo de alabanza"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="warning"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setBandName('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setBandName('')}
                >
                  Limpiar
                </Button>
                <Button
                  isLoading={createBandStatus === 'pending'}
                  disabled={
                    createBandStatus === 'success' || bandName.trim() === ''
                  }
                  color="primary"
                  onPress={handleCreateBand}
                >
                  Crear grupo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
