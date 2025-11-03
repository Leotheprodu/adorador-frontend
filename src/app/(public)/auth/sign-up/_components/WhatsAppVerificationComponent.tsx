'use client';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { CopyIcon } from '@global/icons/CopyIcon';
import { useState } from 'react';
import toast from 'react-hot-toast';

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
    // TODO: Configurar el número real de tu bot de WhatsApp
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
            <h2 className="text-2xl font-bold text-success">
              ¡Registro Exitoso!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Último paso: verificar tu WhatsApp
            </p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="text-center">
            <div className="mb-4 text-6xl">📱</div>
            <p className="mb-4 text-gray-700">
              Para activar tu cuenta, envía el siguiente mensaje a nuestro bot
              de WhatsApp:
            </p>
          </div>

          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-600">
              Código de verificación:
            </p>
            <div className="break-all rounded border border-gray-200 bg-white p-3 font-mono text-sm font-bold text-blue-600">
              {tokenOnlyMessage}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              ☝️ Este es el código exacto que se copiará y enviará
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="bordered"
                startContent={<CopyIcon className="h-4 w-4" />}
                onPress={copyToClipboard}
                className={copied ? 'border-success text-success' : ''}
              >
                {copied ? 'Copiado ✓' : 'Copiar código'}
              </Button>
            </div>
          </div>

          <div className="space-y-3 text-center">
            <Button
              color="success"
              size="lg"
              className="w-full font-semibold"
              onPress={openWhatsApp}
            >
              � Enviar código por WhatsApp
            </Button>

            <div className="space-y-1 text-xs text-gray-500">
              <p>
                • Se enviará solo el código:{' '}
                <code className="text-blue-600">{tokenOnlyMessage}</code>
              </p>
              <p>• Tu cuenta se activará automáticamente</p>
              <p>
                • Número registrado:{' '}
                <span className="font-mono text-primary">{userPhone}</span>
              </p>
            </div>
          </div>

          <div className="border-t pt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes WhatsApp instalado?
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Copia el mensaje y envíalo manualmente al número del bot
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
