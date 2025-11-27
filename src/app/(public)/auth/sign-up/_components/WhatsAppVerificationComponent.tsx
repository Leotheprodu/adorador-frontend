'use client';
import { CopyIcon } from '@global/icons/CopyIcon';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PrimaryButton, SecondaryButton } from '@global/components/buttons';
import { adminWhatsApp } from '@global/config/constants';

interface WhatsAppVerificationProps {
  verificationToken: string;
  whatsappMessage: string;
  userPhone: string;
}

export const WhatsAppVerificationComponent = ({
  verificationToken,
  whatsappMessage,
  userPhone,
}: WhatsAppVerificationProps) => {
  const [copied, setCopied] = useState(false);

  // Extraer solo la parte importante del mensaje: "registro-adorador:TOKEN"
  const extractTokenMessage = (fullMessage: string) => {
    // Buscar el patrón "registro-adorador:" seguido del token
    const match = fullMessage.match(/registro-adorador:[a-f0-9]+/);
    return match ? match[0] : `registro-adorador:${verificationToken}`;
  };

  const tokenOnlyMessage = extractTokenMessage(whatsappMessage);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tokenOnlyMessage);
      setCopied(true);
      toast.success('¡Código copiado! Pégalo en WhatsApp');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
      toast.error('Error al copiar el mensaje');
    }
  };

  const openWhatsApp = () => {
    // URL para abrir WhatsApp con un mensaje predefinido
    const encodedMessage = encodeURIComponent(tokenOnlyMessage);
    const whatsappUrl = `https://wa.me/${adminWhatsApp.replace('+', '')}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Card principal mejorado */}
      <div className="overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-sm">
        {/* Header con gradiente de éxito */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 px-8 py-10 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-3 text-6xl">✅</div>
            <h2 className="text-3xl font-bold text-white">
              ¡Registro Exitoso!
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Solo un paso más para activar tu cuenta
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-6 px-8 py-8">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-5xl">📱</span>
              <span className="text-5xl">➡️</span>
              <span className="text-5xl">💬</span>
            </div>
            <p className="text-base font-medium text-slate-700">
              Envía este código a nuestro bot de WhatsApp
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-5 ring-1 ring-blue-200/50">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                <span className="text-sm font-bold">1</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Código de verificación
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border-2 border-blue-300 bg-white p-4 shadow-sm">
              <p className="break-all font-mono text-base font-bold text-blue-600">
                {tokenOnlyMessage}
              </p>
            </div>

            <SecondaryButton
              onClick={copyToClipboard}
              startContent={<CopyIcon className="h-4 w-4" />}
              className="mt-3 w-full"
            >
              {copied ? '✓ Copiado' : 'Copiar código'}
            </SecondaryButton>
          </div>

          <div className="space-y-3">
            <PrimaryButton
              onClick={openWhatsApp}
              startContent={<span className="text-xl">💬</span>}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
            >
              Enviar por WhatsApp
            </PrimaryButton>

            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
              <p className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Tu cuenta se activará automáticamente</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  Número registrado:{' '}
                  <span className="font-mono font-semibold text-slate-800">
                    {userPhone}
                  </span>
                </span>
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 text-center">
            <p className="text-sm font-medium text-slate-600">
              ¿Problemas con WhatsApp?
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Copia el código y envíalo manualmente al bot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
