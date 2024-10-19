import { Metadata } from 'next';
import { LoginPage } from './_components/LoginPage';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Inicia sesión en la plataforma',
};

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <LoginPage />
    </div>
  );
}
