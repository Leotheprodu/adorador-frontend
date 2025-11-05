'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

import { InputSecureTextToCopy } from '@ui/footer/components/InputSecureTextToCopy';

export const MoreDonationButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full">
      <Button
        onPress={onOpen}
        className="bg-gradient-primary hover:shadow-brand-purple-500/50 w-full font-semibold text-white transition-all duration-300 hover:shadow-lg"
      >
        Otros métodos de pago
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Métodos de pago para Donación
              </ModalHeader>

              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-slate-100 p-4">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <h2 className="font-bold uppercase">Sinpe Móvil</h2>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <InputSecureTextToCopy value={'63017707'} />
                      <InputSecureTextToCopy value={'63017717'} />
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-slate-100 p-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <h2 className="font-bold uppercase">Cuentas (IBAN)</h2>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-2">
                      <InputSecureTextToCopy
                        value={'CR42081400011023655943'}
                        label="Wink Colones"
                      />
                      <InputSecureTextToCopy
                        value={'CR67015101720010723281'}
                        label="Banco Nacional Colones"
                      />
                      <InputSecureTextToCopy
                        value={'CR07081400012023655957'}
                        label="Wink Dólares"
                      />
                      <InputSecureTextToCopy
                        value={'CR57015101720020052921'}
                        label="Banco Nacional Dólares"
                      />
                    </div>
                  </div>
                </div>
                <InputSecureTextToCopy
                  value={'Yehudy Leonardo Serrano Alfaro'}
                  label="Nombre del titular"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  ¡Listo!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
