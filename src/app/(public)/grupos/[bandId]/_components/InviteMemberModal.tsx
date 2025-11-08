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
  Spinner,
  User,
  Chip,
} from '@nextui-org/react';
import {
  useSearchUsers,
  useInviteUser,
} from '@app/(public)/grupos/_hooks/useInviteUser';
import { UsersIcon, SearchIcon } from '@global/icons';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  bandId: number;
}

export const InviteMemberModal = ({
  isOpen,
  onClose,
  bandId,
}: InviteMemberModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchUsers, searchResults, isSearching, clearResults } =
    useSearchUsers(bandId);
  const { inviteUser, isInviting } = useInviteUser(bandId);

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      searchUsers(searchQuery);
    }
  };

  const handleInvite = async (userId: number) => {
    const success = await inviteUser(userId);
    if (success) {
      setSearchQuery('');
      clearResults();
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    clearResults();
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 shadow-md">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-xl font-bold text-transparent">
                Invitar nuevo miembro
              </h3>
              <p className="text-xs font-normal text-slate-500">
                Busca y agrega personas a tu grupo
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input
                label="Buscar usuario"
                placeholder="Nombre, email o teléfono..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                onKeyDown={handleKeyPress}
                autoFocus
                className="flex-1"
                startContent={<SearchIcon className="h-4 w-4 text-slate-400" />}
              />
              <Button
                onPress={handleSearch}
                isLoading={isSearching}
                className="mt-auto bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Buscar
              </Button>
            </div>

            {isSearching && (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                <p className="mb-2 text-sm text-gray-600">
                  {searchResults.length}{' '}
                  {searchResults.length === 1
                    ? 'resultado encontrado'
                    : 'resultados encontrados'}
                </p>
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-brand-purple-200 hover:bg-slate-50 hover:shadow-md"
                  >
                    <User
                      name={user.name}
                      description={user.email || user.phone}
                      avatarProps={{
                        name: user.name.charAt(0).toUpperCase(),
                        size: 'sm',
                      }}
                    />
                    {user.hasPendingInvitation ? (
                      <Chip size="sm" color="warning" variant="flat">
                        Invitación pendiente
                      </Chip>
                    ) : (
                      <Button
                        size="sm"
                        onPress={() => handleInvite(user.id)}
                        isLoading={isInviting}
                        className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                      >
                        Invitar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isSearching &&
              searchQuery.length >= 2 &&
              searchResults.length === 0 &&
              searchResults.length !== undefined && (
                <div className="py-8 text-center">
                  <p className="mb-2 text-gray-500">
                    No se encontraron usuarios
                  </p>
                  <p className="text-sm text-gray-400">
                    Intenta con otro nombre, email o teléfono
                  </p>
                </div>
              )}
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-slate-100 bg-slate-50">
          <Button variant="flat" onPress={handleClose} className="font-medium">
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
