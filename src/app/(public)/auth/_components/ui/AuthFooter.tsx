import { Link } from '@heroui/react';
import { findHrefFromLinks } from '@global/utils/findHrefFromLinks';

interface AuthFooterProps {
  mode: 'login' | 'signup' | 'recovery';
}

export const AuthFooter = ({ mode }: AuthFooterProps) => {
  const isLogin = mode === 'login';
  const isRecovery = mode === 'recovery';

  return (
    <>
      <div className="mt-6 space-y-3 px-8 pb-8">
        {isLogin && (
          <div className="text-center">
            <Link
              href="/auth/password-recovery"
              className="text-sm font-medium text-brand-purple-600 transition-colors hover:text-brand-purple-700 hover:underline dark:text-brand-purple-200 dark:hover:text-brand-pink-200"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        )}
        {isRecovery && (
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-brand-purple-600 transition-colors hover:text-brand-purple-700 hover:underline dark:text-brand-purple-200 dark:hover:text-brand-pink-200"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500 dark:bg-brand-purple-900 dark:text-brand-purple-200">
              o
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-brand-pink-200">
            {isLogin
              ? '¿No tienes cuenta? '
              : isRecovery
                ? '¿No tienes cuenta? '
                : '¿Ya tienes una cuenta? '}
            <Link
              href={
                isLogin || isRecovery
                  ? findHrefFromLinks('Crear cuenta')
                  : findHrefFromLinks('Login')
              }
              className="font-semibold text-brand-purple-600 transition-colors hover:text-brand-purple-700 hover:underline dark:text-white dark:hover:text-brand-pink-200"
            >
              {isLogin || isRecovery ? 'Regístrate gratis' : 'Inicia sesión'}
            </Link>
          </p>
        </div>
      </div>

      {/* Info adicional */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 dark:text-brand-purple-300">
          {isLogin || isRecovery
            ? 'Al continuar, aceptas nuestros '
            : 'Al crear una cuenta, aceptas nuestros '}
          <span className="font-medium text-slate-700 dark:text-white">
            Términos de Servicio
          </span>
          {!isLogin && !isRecovery && (
            <>
              {' y '}
              <span className="font-medium text-slate-700 dark:text-white">
                Política de Privacidad
              </span>
            </>
          )}
        </p>
      </div>
    </>
  );
};
