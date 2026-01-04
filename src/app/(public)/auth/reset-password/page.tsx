import { Metadata } from 'next';
import { ResetPasswordForm } from './_components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
  description: 'Restablece tu contraseña',
};

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
      <ResetPasswordForm />
    </div>
  );
}
