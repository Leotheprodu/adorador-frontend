import { Metadata } from 'next';
import { LoginForm } from '@auth/login/_components/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Inicia sesión en la plataforma',
};

export default function Login() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <LoginForm />
    </div>
  );
}
