import { useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $lyricSelected, $eventConfig } from '@stores/event';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventGateway';

interface UseEventControlsProps {
  isFullscreen: boolean;
  isEventManager: boolean;
  selectedSongLyricLength: number;
}

export function useEventControls({
  isFullscreen,
  isEventManager,
  selectedSongLyricLength,
}: UseEventControlsProps) {
  const lyricSelected = useStore($lyricSelected);
  const eventConfig = useStore($eventConfig);
  const { sendMessage } = useEventGateway();

  const navigateToLyric = useCallback(
    (position: number, action: 'forward' | 'backward') => {
      sendMessage({
        type: 'lyricSelected',
        data: {
          position,
          action,
        },
      });
    },
    [sendMessage],
  );

  const handleSwipeUp = useCallback(() => {
    if (lyricSelected.position === selectedSongLyricLength) {
      // Si estamos en la última letra, ir a "Fin"
      navigateToLyric(selectedSongLyricLength + 1, 'forward');
    } else if (
      lyricSelected.position < selectedSongLyricLength &&
      selectedSongLyricLength > 4 &&
      lyricSelected.position + 3 <= selectedSongLyricLength
    ) {
      const newPosition =
        lyricSelected.position < selectedSongLyricLength - 3 &&
        lyricSelected.position < 1
          ? lyricSelected.position + 1
          : lyricSelected.position + 4;
      navigateToLyric(newPosition, 'forward');
    } else if (
      lyricSelected.position < selectedSongLyricLength &&
      selectedSongLyricLength > 0 &&
      selectedSongLyricLength < 4
    ) {
      navigateToLyric(1, 'forward');
    } else if (
      lyricSelected.position < selectedSongLyricLength &&
      lyricSelected.position + 3 > selectedSongLyricLength
    ) {
      // Si estamos cerca del final pero no podemos avanzar 4, ir a la última posición
      navigateToLyric(selectedSongLyricLength, 'forward');
    }
  }, [lyricSelected.position, selectedSongLyricLength, navigateToLyric]);

  const handleSwipeDown = useCallback(() => {
    if (lyricSelected.position > 0) {
      const newPosition =
        lyricSelected.position <= 4
          ? lyricSelected.position - 1
          : lyricSelected.position - 4;
      navigateToLyric(newPosition, 'backward');
    }
  }, [lyricSelected.position, navigateToLyric]);

  // Touch events para swipe
  useEffect(() => {
    if (!isFullscreen || !isEventManager || eventConfig.swipeLocked) {
      return;
    }

    let startY = 0;
    let endY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      startY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      endY = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (startY - endY > 50) {
        // Deslizar hacia arriba
        handleSwipeUp();
      } else if (endY - startY > 50) {
        // Deslizar hacia abajo
        handleSwipeDown();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    isFullscreen,
    isEventManager,
    eventConfig.swipeLocked,
    handleSwipeUp,
    handleSwipeDown,
  ]);

  // Keyboard events
  useEffect(() => {
    if (!isFullscreen || !isEventManager || eventConfig.swipeLocked) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        handleSwipeUp();
      } else if (event.key === 'ArrowUp') {
        handleSwipeDown();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isFullscreen,
    isEventManager,
    eventConfig.swipeLocked,
    handleSwipeUp,
    handleSwipeDown,
  ]);
}
