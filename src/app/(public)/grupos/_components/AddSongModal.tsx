import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/react';
import { MusicNoteIcon } from '@global/icons';
import { FormAddNewSong } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/addSongToEvent/FormAddNewSong';
import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';

interface AddSongModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    form: SongPropsWithoutId;
    setForm: (form: SongPropsWithoutId) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAddSong: () => void;
    handleClear: () => void;
    isSubmitting: boolean;
    isSuccess: boolean;
}

export const AddSongModal = ({
    isOpen,
    onOpenChange,
    onClose,
    form,
    setForm,
    handleChange,
    handleAddSong,
    handleClear,
    isSubmitting,
    isSuccess,
}: AddSongModalProps) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-2 bg-brand-purple-50 pb-4 dark:bg-gray-950">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 shadow-md">
                                    <MusicNoteIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-xl font-bold text-transparent">
                                        Nueva Canción
                                    </h2>
                                    <p className="text-xs font-normal text-slate-500">
                                        Agrega una canción al repertorio del grupo
                                    </p>
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <FormAddNewSong
                                form={form}
                                setForm={setForm}
                                handleChange={handleChange}
                            />
                        </ModalBody>
                        <ModalFooter className="gap-2 bg-slate-50 dark:bg-gray-950">
                            <Button variant="flat" onPress={onClose} className="font-medium">
                                Cancelar
                            </Button>
                            <Button
                                variant="flat"
                                color="warning"
                                onPress={handleClear}
                                className="font-medium"
                            >
                                Limpiar
                            </Button>
                            <Button
                                isLoading={isSubmitting}
                                disabled={isSuccess}
                                onPress={handleAddSong}
                                className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            >
                                Crear
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
