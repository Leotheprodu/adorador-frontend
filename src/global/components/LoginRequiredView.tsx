import { Button } from "@heroui/react";
import Link from 'next/link';
import { LockClosedIcon } from '@global/icons';

export const LoginRequiredView = () => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-divider bg-content1 p-8 shadow-lg dark:shadow-2xl">
                    {/* Icono */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100 dark:from-brand-purple-900/30 dark:to-brand-blue-900/30">
                            <LockClosedIcon className="h-10 w-10 text-brand-purple-600 dark:text-brand-purple-400" />
                        </div>
                    </div>

                    {/* Título y mensaje */}
                    <div className="mb-6 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                            Inicia Sesión
                        </h2>
                        <p className="text-foreground-600">
                            Para acceder a esta página necesitas iniciar sesión con tu cuenta.
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col gap-3">
                        <Button
                            as={Link}
                            href="/auth/login"
                            className="w-full bg-gradient-to-r from-brand-purple-600 to-brand-pink-600 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                            size="lg"
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            as={Link}
                            href="/"
                            variant="bordered"
                            className="w-full border-divider font-medium text-foreground-700 hover:bg-content2 dark:hover:bg-content3"
                            size="lg"
                        >
                            Volver a Inicio
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
