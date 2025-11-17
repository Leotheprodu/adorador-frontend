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
import { appName, Server1API } from '@global/config/constants';
import { BandsProps } from '@bands/_interfaces/bandsInterface';
import { PrimaryButton } from '@global/components/buttons';
import { updateUserFromToken } from '@global/utils/updateUserFromToken';

interface CreateBandResponse {
  band: BandsProps;
  accessToken: string;
  refreshToken: string;
}

export const GruposCTASection = () => {
  const user = useStore($user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [bandName, setBandName] = useState('');

  const {
    data: response,
    mutate: createBand,
    status: createBandStatus,
  } = PostData<CreateBandResponse, { name: string }>({
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
    const handleSuccess = async () => {
      if (createBandStatus === 'success' && response) {
        toast.success('Grupo creado exitosamente');

        // Guardar los nuevos tokens que vienen del backend
        if (typeof window !== 'undefined') {
          const tokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutos
          };
          localStorage.setItem('auth_tokens', JSON.stringify(tokens));
        }

        // Actualizar el store del usuario con los datos del nuevo token
        updateUserFromToken();

        // Redirigir a la página del grupo
        router.push(`/grupos/${response.band.id}`);
      }
    };

    handleSuccess();

    if (createBandStatus === 'error') {
      toast.error('Error al crear el grupo');
    }
  }, [createBandStatus, response, router]);

  // Usuario NO logueado
  if (!user.isLoggedIn) {
    return (
      <div className="mt-12 rounded-2xl border border-brand-purple-200 bg-gray-50 p-8 text-center shadow-lg dark:bg-gray-900">
        <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-400">
          ¿Quieres que tu grupo aparezca aquí?
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Únete a {appName} y comienza a gestionar tu ministerio de alabanza de
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
      <div className="mt-12 rounded-2xl border border-success-200 bg-gray-50 p-8 text-center shadow-lg dark:border-success-50 dark:bg-gray-900">
        <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-400">
          ¿Listo para crear un nuevo grupo?
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
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
