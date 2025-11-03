'use client';
import React from 'react';
import { ResendVerification } from '@auth/sign-up/_components/ResendVerification';

export default function ResendVerificationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Verificación por WhatsApp
          </h1>
          <p className="text-gray-600">
            ¿Problemas con la verificación? Te ayudamos a resolverlo.
          </p>
        </div>

        <ResendVerification />

        <div className="mt-6 text-center">
          <a
            href="/auth/sign-in"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ¿Ya tienes tu cuenta verificada? Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}
