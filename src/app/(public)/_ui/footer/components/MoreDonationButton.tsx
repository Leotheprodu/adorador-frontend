"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

export const MoreDonationButton = () => {
  const [lastCopied, setLastCopied] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const copyToClipboard = (number: string) => {
    if (number === lastCopied) {
      return; // No hacer nada si es el mismo número
    }
    navigator.clipboard
      .writeText(number)
      .then(() => {
        toast.success(`${number} copiado al portapapeles`);
        setLastCopied(number);
      })
      .catch((err) => {
        console.error("Error al copiar el número", err);
        toast.error("Error al copiar el número");
      });
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary" variant="bordered">
        Otros métodos de pago
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Otros métodos de pago
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col justify-center items-center gap-6">
                  <div className="flex flex-col justify-center items-center gap-4 bg-slate-100 rounded-lg p-4 w-full">
                    <div className="flex flex-col justify-center items-center gap-4">
                      <h2 className="font-bold uppercase">Sinpe Móvil</h2>
                      <small className="text-slate-500">
                        (toca para copiar)
                      </small>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                      <Input
                        value={"63017707"}
                        className="text-xl font-bold"
                        onClick={() => {
                          copyToClipboard("63017707");
                        }}
                      />

                      <Input
                        value={"63017717"}
                        className="text-xl font-bold"
                        onClick={() => {
                          copyToClipboard("63017717");
                        }}
                      />
                    </div>
                    <p>Yehudy Leonardo Serrano Alfaro</p>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-4 bg-slate-100 rounded-lg p-4 w-full">
                    <div className="flex flex-col justify-center items-center gap-4">
                      <h2 className="font-bold uppercase">
                        Cuenta Bancaria (IBAN)
                      </h2>
                      <small className="text-slate-500">
                        (toca para copiar)
                      </small>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                      <p className="text-center">Wink Colones</p>
                      <Input
                        value={"CR42081400011023655943"}
                        className="text-xl font-bold"
                        onClick={() => {
                          copyToClipboard("CR42081400011023655943");
                        }}
                      />
                    </div>
                    <p>Yehudy Leonardo Serrano Alfaro</p>
                  </div>
                </div>
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
