'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';
// Iconos simplificados con emojis

interface WhatsAppResetComponentProps {
  resetToken: string;
  phone: string;
  whatsappMessage: string;
}

export const WhatsAppResetComponent = ({
  phone,
  whatsappMessage,
}: WhatsAppResetComponentProps) => {
  const [tokenOnlyMessage, setTokenOnlyMessage] = useState('');

  useEffect(() => {
    // Extraer solo el token del mensaje completo para el botón de WhatsApp
    const tokenMatch = whatsappMessage.match(
      /resetpass-adorador:([a-zA-Z0-9]+)/,
    );
    if (tokenMatch) {
      setTokenOnlyMessage(`resetpass-adorador:${tokenMatch[1]}`);
    }
  }, [whatsappMessage]);

  const openWhatsApp = () => {
    // URL para abrir WhatsApp con un mensaje predefinido
    const botNumber =
      process.env.NEXT_PUBLIC_WHATSAPP_BOT_NUMBER || '+50663017707'; // Número de tu bot
    const encodedMessage = encodeURIComponent(tokenOnlyMessage);
    const whatsappUrl = `https://wa.me/${botNumber.replace('+', '')}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto">
            <h2 className="text-2xl font-bold text-warning">
              Token de Reset Generado
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Envía el mensaje por WhatsApp para restablecer tu contraseña
            </p>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              📱 Número registrado:
            </p>
            <div className="flex items-center gap-2">
              <span className="text-success">📱</span>
              <span className="font-mono text-sm">{phone}</span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              💬 Instrucciones:
            </p>
            <p className="text-sm text-gray-600">{whatsappMessage}</p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              🤖 Mensaje a enviar:
            </p>
            <div className="break-all rounded border bg-white p-2 font-mono text-sm">
              {tokenOnlyMessage}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={openWhatsApp}
              className="w-full bg-green-500 text-white hover:bg-green-600"
            >
              💬 Enviar por WhatsApp
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                El bot te responderá con un enlace para restablecer tu
                contraseña
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="w-full">
        <CardBody>
          <div className="space-y-2 text-center">
            <h3 className="font-semibold text-gray-800">¿Qué pasa después?</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>1. 📱 Envía el mensaje al bot de WhatsApp</p>
              <p>2. 🤖 El bot te enviará un enlace especial</p>
              <p>3. 🔗 Haz clic en el enlace para crear tu nueva contraseña</p>
              <p>4. ✅ ¡Listo! Ya puedes iniciar sesión</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
