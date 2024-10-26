import { useEffect, useRef, useState } from 'react';

export const useFullscreen = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const activateFullscreen = () => {
    if (divRef.current) {
      if (divRef.current.requestFullscreen) {
        divRef.current.requestFullscreen().catch((err) => console.error(err));
      }
    }
  };
  /*   const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }; */

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement === divRef.current);
  };

  return {
    isFullscreen,
    activateFullscreen,
    divRef,
  };
};
