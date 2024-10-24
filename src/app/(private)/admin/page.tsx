import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Página de administrador',
};

export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-16 p-8 pb-20 sm:p-20">
      <h1>Página de administrador</h1>
    </div>
  );
}
