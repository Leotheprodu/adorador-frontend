import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';

export const ButtonDeleteLyric = ({
  isPendingDeleteLyric,
  isPendingUpdateLyricsPositions,
  handleDeleteLyric,
  lyric,
}: {
  isPendingDeleteLyric: boolean;
  isPendingUpdateLyricsPositions: boolean;
  handleDeleteLyric: () => void;
  lyric: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <button
        disabled={isPendingDeleteLyric || isPendingUpdateLyricsPositions}
        onClick={onOpen}
        className="p-1"
      >
        <DeleteMusicIcon className="text-danger-500" />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Borrar Letra
              </ModalHeader>
              <ModalBody>
                <p>
                  Está apunto de borrar:{' '}
                  <span className="font-bold">{lyric}</span> de la canción.
                  ¿Está seguro de que desea continuar?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="danger" onPress={handleDeleteLyric}>
                  Borrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
