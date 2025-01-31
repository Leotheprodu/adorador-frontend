import { Metadata } from 'next';
import { SignUpForm } from '@auth/sign-up/_components/SignUpForm';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Crea una cuenta en la plataforma',
};

export default function SignUp() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <SignUpForm />
    </div>
  );
}
