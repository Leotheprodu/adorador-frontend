import { Metadata } from 'next';
import { ResetPasswordForm } from './_components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
  description: 'Restablece tu contraseña',
};

export default function ResetPassword() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <ResetPasswordForm />
    </div>
  );
}
