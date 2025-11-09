import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

// Extender interfaces para soporte de navegadores
interface DocumentWithFullscreen extends Document {
  webkitFullscreenEnabled?: boolean;
  mozFullScreenEnabled?: boolean;
  msFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface ElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: (options?: {
    navigationUI?: string;
  }) => Promise<void>;
  webkitEnterFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

// Detectar si estamos en iOS
const isIOS = () => {
  // Verificar que estamos en el cliente antes de acceder a navigator
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

export const useFullscreen = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // En iOS siempre será soportado con webkitRequestFullscreen
    // En otros navegadores verificar hasFullscreenSupport
    setIsSupported(true);

    // Agregar listeners para todos los navegadores
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'msfullscreenchange',
      'webkitendfullscreen',
      'webkitbeginfullscreen',
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleFullscreenChange);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, []);

  const activateFullscreen = async () => {
    if (!divRef.current) {
      console.warn('Elemento no disponible');
      return;
    }

    try {
      const element = divRef.current as ElementWithFullscreen;

      // Para iOS Safari, usar webkitRequestFullscreen con opciones específicas
      if (isIOS() && element.webkitRequestFullscreen) {
        try {
          // iOS requiere que se llame con navigationUI: 'hide' para mejor experiencia
          await element.webkitRequestFullscreen({ navigationUI: 'hide' });
          return;
        } catch {
          console.log('Método iOS moderno falló, intentando alternativa');
        }
      }

      // Intentar diferentes métodos según el navegador
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Error activating fullscreen:', error);
      // En iOS, si falla, sugerir rotación del dispositivo
      if (isIOS()) {
        toast.error(
          'Para una mejor experiencia, rota tu dispositivo a modo horizontal.',
          {
            duration: 4000,
            position: 'bottom-center',
          },
        );
      }
    }
  };

  const exitFullscreen = async () => {
    try {
      const doc = document as DocumentWithFullscreen;

      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  const handleFullscreenChange = () => {
    const doc = document as DocumentWithFullscreen;
    const fullscreenElement =
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    setIsFullscreen(fullscreenElement === divRef.current);
  };

  return {
    isFullscreen,
    isSupported,
    isIOS: isIOS(),
    activateFullscreen,
    exitFullscreen,
    divRef,
  };
};
