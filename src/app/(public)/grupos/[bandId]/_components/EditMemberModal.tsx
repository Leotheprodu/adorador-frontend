'use client';
import { useState, useMemo } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
} from "@heroui/react";
import {
  useUpdateMember,
  useRemoveMember,
} from '@app/(public)/grupos/_hooks/useManageMembers';
import { useBandMembers } from '@app/(public)/grupos/_hooks/useBandMembers';
import type { BandMember } from '@app/(public)/grupos/_hooks/useBandMembers';
import { CrownIcon, CalendarIcon } from '@global/icons';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: BandMember;
  bandId: number;
  isSelf?: boolean;
}

export const EditMemberModal = ({
  isOpen,
  onClose,
  member,
  bandId,
  isSelf = false,
}: EditMemberModalProps) => {
  // Inicializar estados directamente con los valores del member
  const [role, setRole] = useState(member.role);
  const [isAdmin, setIsAdmin] = useState(member.isAdmin);
  const [isEventManager, setIsEventManager] = useState(member.isEventManager);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { updateMember, isUpdating } = useUpdateMember(bandId, member.userId);
  const { removeMember, isRemoving } = useRemoveMember(bandId, member.userId);
  const { data: allMembers } = useBandMembers(bandId);

  // Contar cuántos admins hay en total
  const adminCount = useMemo(() => {
    return allMembers?.filter((m) => m.isAdmin).length || 0;
  }, [allMembers]);

  // Si soy el único admin, no puedo quitarme el permiso de admin
  const isLastAdmin = isSelf && member.isAdmin && adminCount === 1;

  const handleSave = async () => {
    const updateData = {
      role,
      isAdmin,
      isEventManager,
    };

    console.log('Actualizando miembro con:', updateData);

    const success = await updateMember(updateData);

    if (success) {
      onClose();
    }
  };

  const handleRemove = async () => {
    const success = await removeMember();
    if (success) {
      setShowConfirmDelete(false);
      onClose();
    }
  };

  const handleClose = () => {
    setShowConfirmDelete(false);
    setRole(member.role);
    setIsAdmin(member.isAdmin);
    setIsEventManager(member.isEventManager);
    onClose();
  };

  if (showConfirmDelete) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="sm">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold text-danger">
              Confirmar eliminación
            </h3>
          </ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro que deseas remover a{' '}
              <strong>{member.user.name}</strong> del grupo?
            </p>
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setShowConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleRemove}
              isLoading={isRemoving}
            >
              Sí, remover
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="dark:bg-gray-950">
          <h3 className="text-xl font-semibold">
            {isSelf ? 'Editar mi perfil en el grupo' : 'Editar miembro'}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm text-gray-500">Usuario</p>
              <p className="font-medium">{member.user.name}</p>
              <p className="text-xs text-gray-500">{member.user.phone}</p>
            </div>

            <Input
              label="Rol en el grupo"
              placeholder="Ej: Guitarrista, Vocalista, Tecladista..."
              value={role}
              onValueChange={setRole}
            />

            <div className="space-y-4">
              <Checkbox
                isSelected={isAdmin}
                onValueChange={setIsAdmin}
                isDisabled={isLastAdmin}
              >
                <div className="flex flex-col">
                  <p className="flex items-center gap-1.5 font-medium">
                    <CrownIcon className="h-4 w-4 text-yellow-500" />{' '}
                    Administrador
                  </p>
                  <p className="text-xs text-gray-500">
                    {isLastAdmin
                      ? 'Eres el único administrador. Asigna otro admin antes de quitarte este permiso.'
                      : 'Puede invitar, editar y remover miembros'}
                  </p>
                </div>
              </Checkbox>

              <Checkbox
                isSelected={isEventManager}
                onValueChange={setIsEventManager}
              >
                <div className="flex flex-col">
                  <p className="flex items-center gap-1.5 font-medium">
                    <CalendarIcon className="h-4 w-4 text-brand-purple-600" />{' '}
                    Encargado de eventos
                  </p>
                  <p className="text-xs text-gray-500">
                    Puede crear y gestionar eventos del grupo
                  </p>
                </div>
              </Checkbox>
            </div>

            {!isSelf && (
              <div className="border-t pt-4">
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => setShowConfirmDelete(true)}
                  className="w-full"
                >
                  Remover del grupo
                </Button>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={isUpdating}>
            Guardar cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
