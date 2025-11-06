import { Metadata } from 'next';
import { LoginForm } from '@auth/login/_components/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Inicia sesión en la plataforma',
};

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 px-4 py-12 sm:px-6">
      <LoginForm />
    </div>
  );
}
