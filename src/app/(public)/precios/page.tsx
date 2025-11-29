import { Metadata } from 'next';
import { PricingPage } from './_components/PricingPage';
import { appName } from '@global/config/constants';

export const metadata: Metadata = {
    title: `Precios - ${appName}`,
    description:
        'Planes de suscripción para Zamr. Prueba gratis por 15 días sin tarjeta de crédito. Modo proyector profesional, sincronización perfecta, y biblioteca colaborativa para tu grupo de alabanza.',
    keywords:
        'zamr precios, planes de suscripción, grupo de alabanza, modo proyector, acordes y letras, gestión de canciones',
};

export default function PricingRoute() {
    return <PricingPage />;
}
