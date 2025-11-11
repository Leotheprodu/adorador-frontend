import { render, screen, fireEvent } from '@testing-library/react';
import type { lyricSelectedProps } from '@stores/event';

// Mock @nanostores/react FIRST
jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: (store: any) => store.get(),
}));

// Mock event stores
jest.mock('@stores/event', () => {
  let lyricSelectedValue: lyricSelectedProps = {
    position: 0,
    action: 'forward',
  };
  let selectedSongLyricLengthValue = 0;

  return {
    $lyricSelected: {
      get: () => lyricSelectedValue,
      set: (newValue: lyricSelectedProps) => {
        lyricSelectedValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $selectedSongLyricLength: {
      get: () => selectedSongLyricLengthValue,
      set: (newValue: number) => {
        selectedSongLyricLengthValue = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// Mock del hook useEventGateway
const mockSendMessage = jest.fn();
jest.mock('@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventGateway', () => ({
  useEventGateway: () => ({
    sendMessage: mockSendMessage,
  }),
}));

import { EventControlsButtonsLirics } from '../EventControlsButtonsLirics';
import { $lyricSelected, $selectedSongLyricLength } from '@stores/event';

describe('EventControlsButtonsLirics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset stores to default values
    $lyricSelected.set({ position: 0, action: 'forward' });
    $selectedSongLyricLength.set(10);
  });

  describe('Navegación hacia atrás', () => {
    it('debería estar deshabilitado cuando position es 0', () => {
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventControlsButtonsLirics />);

      const backButton = screen.getAllByRole('button')[0];
      expect(backButton).toBeDisabled();
    });

    it('debería retroceder 1 posición cuando position <= 4', () => {
      $lyricSelected.set({ position: 3, action: 'forward' });
      render(<EventControlsButtonsLirics />);

      const backButton = screen.getAllByRole('button')[0];
      fireEvent.click(backButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 2,
          action: 'backward',
        },
      });
    });

    it('debería retroceder 4 posiciones cuando position > 4', () => {
      $lyricSelected.set({ position: 8, action: 'forward' });
      render(<EventControlsButtonsLirics />);

      const backButton = screen.getAllByRole('button')[0];
      fireEvent.click(backButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 4,
          action: 'backward',
        },
      });
    });
  });

  describe('Navegación hacia adelante', () => {
    it('debería estar deshabilitado cuando position es selectedSongLyricLength + 1', () => {
      $lyricSelected.set({ position: 11, action: 'forward' });
      $selectedSongLyricLength.set(10);
      render(<EventControlsButtonsLirics />);

      const forwardButton = screen.getAllByRole('button')[1];
      expect(forwardButton).toBeDisabled();
    });

    it('debería estar deshabilitado cuando selectedSongLyricLength es 0', () => {
      $lyricSelected.set({ position: 0, action: 'forward' });
      $selectedSongLyricLength.set(0);
      render(<EventControlsButtonsLirics />);

      const forwardButton = screen.getAllByRole('button')[1];
      expect(forwardButton).toBeDisabled();
    });

    it('debería ir a "Fin" cuando estamos en la última letra', () => {
      $lyricSelected.set({ position: 10, action: 'forward' });
      $selectedSongLyricLength.set(10);
      render(<EventControlsButtonsLirics />);

      const forwardButton = screen.getAllByRole('button')[1];
      fireEvent.click(forwardButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 11,
          action: 'forward',
        },
      });
    });

    it('debería avanzar 4 posiciones cuando hay suficientes letras', () => {
      $lyricSelected.set({ position: 2, action: 'forward' });
      $selectedSongLyricLength.set(10);
      render(<EventControlsButtonsLirics />);

      const forwardButton = screen.getAllByRole('button')[1];
      fireEvent.click(forwardButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 6,
          action: 'forward',
        },
      });
    });

    it('debería ir a posición 1 cuando selectedSongLyricLength < 4 y position < 1', () => {
      $lyricSelected.set({ position: 0, action: 'forward' });
      $selectedSongLyricLength.set(3);
      render(<EventControlsButtonsLirics />);

      const forwardButton = screen.getAllByRole('button')[1];
      fireEvent.click(forwardButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 1,
          action: 'forward',
        },
      });
    });

    it('debería ir a la última posición cuando estamos cerca del final pero no podemos avanzar 4', () => {
      $lyricSelected.set({ position: 8, action: 'forward' });
      $selectedSongLyricLength.set(10);
      render(<EventControlsButtonsLirics />);

      const forwardButton = screen.getAllByRole('button')[1];
      fireEvent.click(forwardButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 10,
          action: 'forward',
        },
      });
    });
  });

  describe('Renderizado de componentes', () => {
    it('debería renderizar ambos botones', () => {
      render(<EventControlsButtonsLirics />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('debería aplicar estilos correctos al contenedor', () => {
      const { container } = render(<EventControlsButtonsLirics />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex', 'h-full', 'flex-col');
    });
  });
});
