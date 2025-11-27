'use client';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Divider } from '@nextui-org/react';
import type { SubscriptionPlan } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';
import { PaymentMethod } from '@bands/[bandId]/suscripcion/_interfaces/payment.interface';
import { useCreatePayment } from '../_hooks/usePaymentData';

interface PlanUpgradeCardProps {
    plans: SubscriptionPlan[];
    currentPlanId?: number;
    bandId: string;
    bandName?: string;
}

import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';

import { adminWhatsApp } from '@global/config/constants';

export const PlanUpgradeCard = ({
    plans,
    currentPlanId,
    bandId,
    bandName = 'Mi Banda',
}: PlanUpgradeCardProps) => {
    const user = useStore($user);
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const [selectedMethod, setSelectedMethod] = useState<string>('');

    const { handleCreatePayment, isPending } = useCreatePayment(bandId);

    // Helper to get billing period from durationDays
    const getBillingPeriod = (durationDays: number | null): string => {
        if (durationDays === null || durationDays === 30) return 'mes';
        if (durationDays === 365) return 'año';
        return `${durationDays} días`;
    };

    // Filtrar planes disponibles (excluir Trial y plan actual)
    const availablePlans = plans.filter(
        (plan) => plan.name !== 'Trial' && plan.id !== currentPlanId,
    );

    const selectedPlan = plans.find((p) => p.id === Number(selectedPlanId));

    const handleRequestUpgrade = () => {
        if (!selectedPlan || !selectedMethod) return;

        const methodLabels: Record<PaymentMethod, string> = {
            [PaymentMethod.BANK_TRANSFER]: 'Transferencia Bancaria',
            [PaymentMethod.PAYPAL]: 'PayPal',
            [PaymentMethod.SINPE_MOVIL]: 'Sinpe Movil',

        };

        // 1. Crear pago PENDING en la base de datos
        // Nota: El backend calcula el monto basado en el planId, no enviamos amount
        // Nota: proofUrl debe ser una URL válida o string vacío si es pendiente
        handleCreatePayment({
            planId: selectedPlan.id,
            method: selectedMethod as PaymentMethod,
            proofUrl: 'https://pending.payment', // Placeholder URL válido
        });

        // 2. Abrir WhatsApp con mensaje simplificado
        const message = `Hola, soy ${user.name || 'Usuario'}
Quiero el plan: ${selectedPlan.name}
Para la banda: ${bandName}
Monto: $${selectedPlan.price}
Pago vía: ${methodLabels[selectedMethod as PaymentMethod]}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${adminWhatsApp.replace('+', '')}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        // 3. Reset form
        setSelectedPlanId('');
        setSelectedMethod('');
    };

    const isFormValid = selectedPlanId && selectedMethod;

    return (
        <Card className="w-full">
            <CardHeader>
                <h3 className="text-lg font-semibold">Actualizar Plan</h3>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
                {/* Plan Selection */}
                <Select
                    label="Selecciona un plan"
                    placeholder="Elige el plan que deseas"
                    selectedKeys={selectedPlanId ? new Set([selectedPlanId]) : new Set()}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    isRequired
                >
                    {availablePlans.map((plan) => (
                        <SelectItem
                            key={plan.id.toString()}
                            value={plan.id.toString()}
                            textValue={`${plan.name} - $${plan.price}/${getBillingPeriod(plan.durationDays)}`}
                        >
                            {plan.name} - ${plan.price}/{getBillingPeriod(plan.durationDays)}
                        </SelectItem>
                    ))}
                </Select>

                {/* Payment Method Selection */}
                <Select
                    label="Método de pago"
                    placeholder="¿Cómo vas a pagar?"
                    selectedKeys={selectedMethod ? new Set([selectedMethod]) : new Set()}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    isRequired
                >
                    <SelectItem key={PaymentMethod.BANK_TRANSFER} value={PaymentMethod.BANK_TRANSFER} textValue="Transferencia Bancaria">
                        Transferencia Bancaria
                    </SelectItem>
                    <SelectItem key={PaymentMethod.SINPE_MOVIL} value={PaymentMethod.SINPE_MOVIL} textValue="Sinpe Móvil">
                        Sinpe Móvil
                    </SelectItem>
                    <SelectItem key={PaymentMethod.PAYPAL} value={PaymentMethod.PAYPAL} textValue="Paypal">
                        Paypal
                    </SelectItem>

                </Select>

                {/* Selected Plan Summary */}
                {selectedPlan && (
                    <div className="rounded-lg bg-primary-50 p-4">
                        <p className="mb-2 text-sm font-semibold text-primary">
                            Plan seleccionado: {selectedPlan.name}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                            ${selectedPlan.price}
                            <span className="text-sm">
                                {"/" + getBillingPeriod(selectedPlan.durationDays)}
                            </span>
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-default-600">
                            <li>✓ {selectedPlan.maxMembers} miembros</li>
                            <li>✓ {selectedPlan.maxSongs} canciones</li>
                            <li>✓ {selectedPlan.maxEventsPerMonth} eventos/mes</li>
                            <li>✓ {selectedPlan.maxPeoplePerEvent} personas/evento</li>
                        </ul>
                    </div>
                )}

                {/* Request Upgrade Button */}
                <Button
                    color="success"
                    size="lg"
                    className="w-full"
                    isDisabled={!isFormValid}
                    isLoading={isPending}
                    onPress={handleRequestUpgrade}
                    startContent={
                        !isPending && (
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        )
                    }
                >
                    Solicitar Actualización
                </Button>

                <div className="rounded-lg bg-default-100 p-3">
                    <p className="text-xs text-default-600">
                        <strong>¿Qué sigue?</strong>
                    </p>
                    <ol className="mt-2 space-y-1 text-xs text-default-600">
                        <li>1️⃣ Tu solicitud quedará pendiente de aprobación</li>
                        <li>2️⃣ Te contactaremos por WhatsApp con instrucciones de pago</li>
                        <li>3️⃣ Envíanos el comprobante por WhatsApp</li>
                        <li>4️⃣ Aprobaremos tu pago y tu plan se actualizará automáticamente</li>
                    </ol>
                </div>
            </CardBody>
        </Card>
    );
};
