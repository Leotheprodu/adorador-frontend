import { Metadata } from 'next';
import { VerifyWhatsApp } from './_components/VerifyEmail';

export const metadata: Metadata = {
  title: 'Verificar WhatsApp',
  description: 'Verifica tu número de WhatsApp para poder iniciar sesión',
};

export default function VerifyWhatsAppPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <VerifyWhatsApp />
    </div>
  );
}
