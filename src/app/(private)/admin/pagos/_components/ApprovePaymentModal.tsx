'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { AdminPayment } from '../../_interfaces/adminPaymentInterface';

interface ApprovePaymentModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    payment: AdminPayment | null;
    onConfirm: () => void;
    isLoading: boolean;
}

export const ApprovePaymentModal = ({
    isOpen,
    onOpenChange,
    payment,
    onConfirm,
    isLoading,
}: ApprovePaymentModalProps) => {
    if (!payment) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Aprobar Pago
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                ¿Estás seguro de que deseas aprobar este pago?
                            </p>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p><strong>Usuario:</strong> {payment.paidByUser?.name || 'Sin usuario'}</p>
                                <p><strong>Plan:</strong> {payment.subscription.plan.name}</p>
                                <p><strong>Banda:</strong> {payment.subscription.band.name}</p>
                                <p><strong>Monto:</strong> {payment.currency} {payment.amount}</p>
                                <p><strong>Método:</strong> {payment.method.replace('_', ' ')}</p>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Esta acción activará la suscripción para la banda.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="default"
                                variant="light"
                                onPress={onClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                color="success"
                                onPress={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                isLoading={isLoading}
                            >
                                Aprobar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
