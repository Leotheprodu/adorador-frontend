'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@nextui-org/react';
import { AdminPayment } from '../../_interfaces/adminPaymentInterface';
import { useState } from 'react';

interface RejectPaymentModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    payment: AdminPayment | null;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
}

export const RejectPaymentModal = ({
    isOpen,
    onOpenChange,
    payment,
    onConfirm,
    isLoading,
}: RejectPaymentModalProps) => {
    const [reason, setReason] = useState('');

    if (!payment) return null;

    const handleConfirm = () => {
        onConfirm(reason);
        setReason('');
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Rechazar Pago
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                ¿Estás seguro de que deseas rechazar este pago?
                            </p>
                            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <p><strong>Usuario:</strong> {payment.paidByUser?.name || 'Sin usuario'}</p>
                                <p><strong>Plan:</strong> {payment.plan.name}</p>
                                <p><strong>Banda:</strong> {payment.subscription.band.name}</p>
                                <p><strong>Monto:</strong> {payment.currency} {payment.amount}</p>
                            </div>
                            <Textarea
                                label="Razón del rechazo (opcional)"
                                placeholder="Explica por qué se rechaza este pago..."
                                value={reason}
                                onValueChange={setReason}
                                className="mt-4"
                                minRows={3}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="default"
                                variant="light"
                                onPress={() => {
                                    onClose();
                                    setReason('');
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                color="danger"
                                onPress={() => {
                                    handleConfirm();
                                    onClose();
                                }}
                                isLoading={isLoading}
                            >
                                Rechazar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
