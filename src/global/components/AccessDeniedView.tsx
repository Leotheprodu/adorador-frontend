import { Button } from "@heroui/react";
import Link from 'next/link';
import { LockClosedIcon } from '@global/icons';

export const AccessDeniedView = () => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-divider bg-content1 p-8 shadow-lg dark:shadow-2xl">
                    {/* Icono */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink-100 to-brand-purple-100 dark:from-brand-pink-900/30 dark:to-brand-purple-900/30">
                            <LockClosedIcon className="h-10 w-10 text-brand-purple-600 dark:text-brand-purple-400" />
                        </div>
                    </div>

                    {/* Título y mensaje */}
                    <div className="mb-6 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                            Acceso Restringido
                        </h2>
                        <p className="text-foreground-600">
                            Lo sentimos, no tienes los permisos necesarios para acceder a esta
                            página.
                        </p>
                    </div>

                    {/* Botón */}
                    <Button
                        as={Link}
                        href="/"
                        className="w-full bg-gradient-to-r from-brand-purple-600 to-brand-pink-600 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                        size="lg"
                    >
                        Ir a Inicio
                    </Button>
                </div>
            </div>
        </div>
    );
};
