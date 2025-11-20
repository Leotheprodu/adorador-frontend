'use client';
import { Button } from '@nextui-org/react';
import { useIsLoggedInHandle } from '@auth/login/_hooks/useIsLoggedInHandle';
import { LoggedUser } from '@auth/login/_interfaces/LoginInterface';

export const IsLoggedInHandle = ({ user }: { user: LoggedUser }) => {
  const { handleLogout, isPending } = useIsLoggedInHandle({ user });

  // Si el usuario está activo, mostrar opción para cerrar sesión
  if (user.status === 'active') {
    return (
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-sm transition-colors duration-300 dark:bg-brand-purple-900/90 dark:ring-brand-purple-800">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 px-8 py-10 text-center transition-colors duration-300 dark:from-brand-purple-950 dark:via-brand-purple-900 dark:to-brand-blue-900">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl dark:bg-brand-purple-900"></div>
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl dark:bg-brand-purple-900"></div>
            </div>

            <div className="relative z-10">
              <div className="mb-3 text-6xl">👋</div>
              <h2 className="text-3xl font-bold text-white">
                ¡Hola, {user.name}!
              </h2>
              <p className="mt-2 text-sm text-white/90 dark:text-brand-purple-200">
                Tu sesión está activa
              </p>
            </div>
          </div>

          <div className="space-y-6 px-8 py-8">
            <div className="rounded-xl bg-emerald-50 p-5 ring-1 ring-emerald-200/50 dark:bg-brand-purple-950 dark:ring-brand-purple-800">
              <p className="text-center text-sm text-slate-700 dark:text-brand-purple-200">
                Ya has iniciado sesión. Puedes continuar usando la aplicación o
                cerrar sesión si lo prefieres.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-slate-700 dark:text-brand-pink-200">
                ¿Quieres cerrar sesión?
              </p>

              <Button
                isLoading={isPending}
                onClick={handleLogout}
                className="w-full border-2 border-transparent bg-gradient-to-r from-red-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 dark:border-brand-pink-400 dark:from-brand-pink-600 dark:to-brand-blue-500"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si el usuario no está activo, mostrar mensaje de cuenta inactiva
  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-sm">
        {/* Header con gradiente de advertencia */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 px-8 py-10 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-3 text-6xl">⚠️</div>
            <h2 className="text-3xl font-bold text-white">Cuenta Inactiva</h2>
            <p className="mt-2 text-sm text-white/90">Hola, {user.name}</p>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-6 px-8 py-8">
          <div className="rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200/50">
            <p className="text-sm leading-relaxed text-slate-700">
              Tu cuenta no está activa todavía. Para activarla, revisa tu
              bandeja de correo electrónico{' '}
              <span className="font-mono font-semibold text-amber-700">
                {user.email}
              </span>{' '}
              y busca el correo de confirmación.
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Si ya confirmaste tu correo, contáctanos para ayudarte.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-slate-700">
              ¿Quieres cerrar sesión?
            </p>

            <Button
              isLoading={isPending}
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
