import { Metadata } from 'next';
import { PasswordRecoveryForm } from './_components/PasswordRecoveryForm';

export const metadata: Metadata = {
  title: ' Recuperar contraseña',
  description: 'Recupera tu contraseña',
};

export default function PasswordRecovery() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <PasswordRecoveryForm />
    </div>
  );
}
