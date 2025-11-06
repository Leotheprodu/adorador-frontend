'use client';
import { Button, Link } from '@nextui-org/react';
import { IsLoggedInHandle } from '@auth/login/_components/IsLoggedInHandle';
import { InputPhoneLoginForm } from '@auth/login/_components/InputPhoneLoginForm';
import { InputPasswordLoginForm } from '@auth/login/_components/InputPasswordLoginForm';
import { useLoginForm } from '@auth/login/_hooks/useLoginForm';
import { findHrefFromLinks } from '@global/utils/findHrefFromLinks';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';

export const LoginForm = () => {
  const {
    handleOnChange,
    handleOnClear,
    handleLogin,
    isInvalidPass,
    phone,
    password,
    isPending,
  } = useLoginForm({ phone: '', password: '' });
  const user = useStore($user);
  return (
    <>
      {user.isLoggedIn && <IsLoggedInHandle user={user} />}
      {!user.isLoggedIn && (
        <div className="w-full max-w-md">
          {/* Card principal con glassmorphism */}
          <div className="overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-sm">
            {/* Header con gradiente */}
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-purple-600 via-brand-pink-500 to-brand-blue-600 px-8 py-12 text-center">
              {/* Patrón decorativo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
                <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="mb-4 text-5xl">🎵</div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  Bienvenido
                </h1>
                <p className="mt-2 text-sm text-white/90 sm:text-base">
                  Inicia sesión para acceder a tus herramientas
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div className="px-8 py-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <InputPhoneLoginForm
                    handle={{ handleOnClear, phone, handleOnChange }}
                  />
                  <InputPasswordLoginForm
                    handle={{
                      handleOnChange,
                      isInvalidPass,
                      password,
                    }}
                  />
                </div>

                <Button
                  isLoading={isPending}
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 py-6 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Iniciar Sesión
                </Button>
              </form>

              {/* Links adicionales */}
              <div className="mt-6 space-y-3">
                <div className="text-center">
                  <Link
                    href="/auth/password-recovery"
                    className="text-sm font-medium text-brand-purple-600 transition-colors hover:text-brand-purple-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">o</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    ¿No tienes cuenta?{' '}
                    <Link
                      href={findHrefFromLinks('Crear cuenta')}
                      className="font-semibold text-brand-purple-600 transition-colors hover:text-brand-purple-700 hover:underline"
                    >
                      Regístrate gratis
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Al iniciar sesión, aceptas nuestros{' '}
              <span className="font-medium text-slate-700">
                Términos de Servicio
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
