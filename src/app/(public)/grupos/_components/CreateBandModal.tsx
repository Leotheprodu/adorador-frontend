import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Input,
} from '@nextui-org/react';

interface CreateBandModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    bandName: string;
    setBandName: (name: string) => void;
    handleCreateBand: () => void;
    handleClear: () => void;
    isCreating: boolean;
    isSuccess: boolean;
}

export const CreateBandModal = ({
    isOpen,
    onOpenChange,
    onClose,
    bandName,
    setBandName,
    handleCreateBand,
    handleClear,
    isCreating,
    isSuccess,
}: CreateBandModalProps) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {() => (
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
                                    handleClear();
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button color="danger" variant="light" onPress={handleClear}>
                                Limpiar
                            </Button>
                            <Button
                                isLoading={isCreating}
                                disabled={isSuccess || bandName.trim() === ''}
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
    );
};
