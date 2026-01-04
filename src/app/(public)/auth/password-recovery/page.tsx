import { Metadata } from 'next';
import { PasswordRecoveryForm } from './_components/PasswordRecoveryForm';

export const metadata: Metadata = {
  title: ' Recuperar contraseña',
  description: 'Recupera tu contraseña',
};

export default function PasswordRecovery() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
      <PasswordRecoveryForm />
    </div>
  );
}
