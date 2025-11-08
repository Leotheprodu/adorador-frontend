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
import { CreditCardIcon } from '@global/icons/CreditCardIcon';

export const MoreDonationButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full">
      <Button
        onPress={onOpen}
        variant="bordered"
        className="flex w-full items-center justify-center gap-2 rounded-lg border-brand-purple-500 px-3 py-2 font-medium text-brand-purple-500 transition-all duration-200 hover:shadow-md hover:shadow-brand-purple-200/40"
        startContent={<CreditCardIcon width={20} height={20} />}
      >
        <span className="text-sm">Otros métodos de pago</span>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        classNames={{ backdrop: 'bg-black/60' }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-0.5 rounded-t-xl border-b border-brand-purple-100 bg-white/90 p-2">
                <span className="text-base font-bold tracking-wide text-brand-purple-700">
                  Métodos de pago
                </span>
                <span className="text-xs font-medium text-brand-purple-400">
                  Elige tu opción favorita
                </span>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-2 rounded-b-xl bg-white/90 px-2 py-3">
                <div className="mx-auto flex w-full max-w-xs flex-col gap-2">
                  <div className="flex flex-col gap-1 rounded-lg border border-brand-purple-100 bg-gradient-to-br from-brand-purple-50 to-white p-2 shadow-sm">
                    <h2 className="mb-0.5 text-center text-xs font-semibold uppercase tracking-wide text-brand-purple-700">
                      Sinpe Móvil
                    </h2>
                    <div className="xs:flex-row flex flex-col items-center justify-center gap-1">
                      <InputSecureTextToCopy value={'63017707'} />
                      <InputSecureTextToCopy value={'63017717'} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border border-brand-purple-100 bg-gradient-to-br from-brand-purple-50 to-white p-2 shadow-sm">
                    <h2 className="mb-0.5 text-center text-xs font-semibold uppercase tracking-wide text-brand-purple-700">
                      Cuentas IBAN
                    </h2>
                    <div className="flex flex-col gap-1">
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
                  <div className="flex flex-col gap-1 rounded-lg border border-brand-purple-100 bg-gradient-to-br from-brand-purple-50 to-white p-2 shadow-sm">
                    <h2 className="mb-0.5 text-center text-xs font-semibold uppercase tracking-wide text-brand-purple-700">
                      Titular
                    </h2>
                    <InputSecureTextToCopy
                      value={'Yehudy Leonardo Serrano Alfaro'}
                      label="Nombre del titular"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-center rounded-b-xl border-t border-brand-purple-100 bg-white/90 p-2">
                <Button
                  radius="full"
                  className="bg-brand-purple-600 px-6 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-purple-700"
                  onPress={onClose}
                >
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
