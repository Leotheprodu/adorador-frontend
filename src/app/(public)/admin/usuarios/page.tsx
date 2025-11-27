import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Usuarios',
  description: 'Página de administrador de usuarios',
};

export default function UsersAdminPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <h1>Página de administración de usuarios</h1>
    </div>
  );
}
