'use client';
import { Button } from '@heroui/react';
import { useIsLoggedInHandle } from '@auth/login/_hooks/useIsLoggedInHandle';
import { LoggedUser } from '@auth/login/_interfaces/LoginInterface';
import { AuthCard } from '../../_components/ui/AuthCard';
import { AuthHeader } from '../../_components/ui/AuthHeader';

export const IsLoggedInHandle = ({ user }: { user: LoggedUser }) => {
  const { handleLogout, isPending } = useIsLoggedInHandle({ user });

  // Si el usuario está activo, mostrar opción para cerrar sesión
  if (user.status === 'active') {
    return (
      <AuthCard>
        <AuthHeader
          title={`¡Hola, ${user.name}!`}
          subtitle="Tu sesión está activa"
        />

        <div className="space-y-6 px-8 py-8">
          <div className="rounded-xl bg-emerald-50 p-5 ring-1 ring-emerald-200/50 dark:bg-emerald-950/30 dark:ring-emerald-800">
            <p className="text-center text-sm text-slate-700 dark:text-emerald-200">
              Ya has iniciado sesión. Puedes continuar usando la aplicación o
              cerrar sesión si lo prefieres.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">
              ¿Quieres cerrar sesión?
            </p>

            <Button
              isLoading={isPending}
              onClick={handleLogout}
              className="w-full bg-red-600 py-6 text-base font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </AuthCard>
    );
  }

  // Si el usuario no está activo, mostrar mensaje de cuenta inactiva
  return (
    <AuthCard>
      <AuthHeader title="Cuenta Inactiva" subtitle={`Hola, ${user.name}`} />

      <div className="space-y-6 px-8 py-8">
        <div className="rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200/50 dark:bg-amber-950/30 dark:ring-amber-800">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-amber-200">
            Tu cuenta no está activa todavía. Para activarla, revisa tu bandeja
            de correo electrónico{' '}
            <span className="font-mono font-semibold text-amber-700 dark:text-amber-100">
              {user.email}
            </span>{' '}
            y busca el correo de confirmación.
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-amber-300/80">
            Si ya confirmaste tu correo, contáctanos para ayudarte.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">
            ¿Quieres cerrar sesión?
          </p>

          <Button
            isLoading={isPending}
            onClick={handleLogout}
            className="w-full bg-red-600 py-6 text-base font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-red-700 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </AuthCard>
  );
};
