import { Metadata } from 'next';
import { LoginForm } from '@auth/login/_components/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Inicia sesión en la plataforma',
};

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
      <LoginForm />
    </div>
  );
}
