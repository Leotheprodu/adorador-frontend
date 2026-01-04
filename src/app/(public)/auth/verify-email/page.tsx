import { Metadata } from 'next';
import { VerifyWhatsApp } from './_components/VerifyEmail';

export const metadata: Metadata = {
  title: 'Verificar WhatsApp',
  description: 'Verifica tu número de WhatsApp para poder iniciar sesión',
};

export default function VerifyWhatsAppPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
      <VerifyWhatsApp />
    </div>
  );
}
