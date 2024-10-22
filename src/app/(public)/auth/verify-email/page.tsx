import { Metadata } from 'next';
import { VerifyEmail } from './_components/VerifyEmail';

export const metadata: Metadata = {
  title: 'Verificar Correo Electrónico',
  description: 'Verifica tu correo electrónico para poder iniciar sesión',
};

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <VerifyEmail />
    </div>
  );
}
