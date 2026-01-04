import { Metadata } from 'next';
import { SignUpForm } from '@auth/sign-up/_components/SignUpForm';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Crea una cuenta en la plataforma',
};

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950 sm:px-6">
      <SignUpForm />
    </div>
  );
}
