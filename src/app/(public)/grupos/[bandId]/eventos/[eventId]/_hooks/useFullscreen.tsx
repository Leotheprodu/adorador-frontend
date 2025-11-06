import { useEffect, useRef, useState } from 'react';

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
  webkitRequestFullscreen?: () => Promise<void>;
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

// Detectar soporte para fullscreen
const hasFullscreenSupport = () => {
  // Verificar que estamos en el cliente antes de acceder a document
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  const doc = document as DocumentWithFullscreen;
  return !!(
    document.fullscreenEnabled ||
    doc.webkitFullscreenEnabled ||
    doc.mozFullScreenEnabled ||
    doc.msFullscreenEnabled
  );
};

export const useFullscreen = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar soporte en el cliente
    setIsSupported(hasFullscreenSupport() && !isIOS());

    // Agregar listeners para todos los navegadores
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'msfullscreenchange',
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
    if (!divRef.current || !isSupported) {
      // Para iOS, mostrar instrucciones o usar alternativa
      if (isIOS()) {
        alert(
          'En iOS, usa el botón de pantalla completa de Safari (ícono de cuadrados en la barra de navegación) o rota el dispositivo a landscape.',
        );
        return;
      }
      console.warn('Pantalla completa no soportada en este dispositivo');
      return;
    }

    try {
      const element = divRef.current as ElementWithFullscreen;

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
