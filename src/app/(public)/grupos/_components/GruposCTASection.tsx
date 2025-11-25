'use client';

import { appName } from '@global/config/constants';
import { PrimaryButton } from '@global/components/buttons';
import { useGruposCTA } from '../_hooks/useGruposCTA';
import { CreateBandModal } from './CreateBandModal';

export const GruposCTASection = () => {
  const {
    isLoggedIn,
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
    bandName,
    setBandName,
    handleCreateBand,
    handleClear,
    isCreating,
    isSuccess,
  } = useGruposCTA();

  // Usuario NO logueado
  if (!isLoggedIn) {
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
      <CreateBandModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        bandName={bandName}
        setBandName={setBandName}
        handleCreateBand={handleCreateBand}
        handleClear={handleClear}
        isCreating={isCreating}
        isSuccess={isSuccess}
      />
    </>
  );
};
