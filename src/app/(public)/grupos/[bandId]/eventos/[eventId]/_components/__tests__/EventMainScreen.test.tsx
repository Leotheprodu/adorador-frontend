import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type {
  EventByIdInterface,
  EventSongsProps,
} from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import type { lyricSelectedProps } from '@stores/event';
import type { LoggedUser } from '@auth/login/_interfaces/LoginInterface';

// Mock @nanostores/react FIRST
jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: (store: any) => store.get(),
}));

// Mock users store
jest.mock('@stores/users', () => {
  let userValue: LoggedUser = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    status: 'inactive',
    roles: [],
    memberships: [],
    membersofBands: [],
    isLoggedIn: false,
  };

  return {
    $user: {
      get: () => userValue,
      set: (newValue: LoggedUser) => {
        userValue = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// Mock event stores
jest.mock('@stores/event', () => {
  let eventValue: EventByIdInterface = {
    id: 0,
    title: '',
    date: '',
    bandId: 0,
    songs: [],
  };
  let lyricSelectedValue: lyricSelectedProps = {
    position: 0,
    action: 'forward',
  };
  let eventSelectedSongIdValue = 0;
  let selectedSongDataValue: EventSongsProps | undefined = undefined;
  let selectedSongLyricLengthValue = 0;
  let eventLiveMessageValue = '';
  let eventConfigValue = {
    showChords: false,
    showKey: false,
    backgroundImage: 1,
    showStructure: false,
    lyricsScale: 1,
    swipeLocked: false,
  };

  return {
    $event: {
      get: () => eventValue,
      set: (newValue: EventByIdInterface) => {
        eventValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $lyricSelected: {
      get: () => lyricSelectedValue,
      set: (newValue: lyricSelectedProps) => {
        lyricSelectedValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $eventSelectedSongId: {
      get: () => eventSelectedSongIdValue,
      set: (newValue: number) => {
        eventSelectedSongIdValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $selectedSongData: {
      get: () => selectedSongDataValue,
      set: (newValue: EventSongsProps | undefined) => {
        selectedSongDataValue = newValue;
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
    $eventConfig: {
      get: () => eventConfigValue,
      set: (newValue: typeof eventConfigValue) => {
        eventConfigValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $eventLiveMessage: {
      get: () => eventLiveMessageValue,
      set: (newValue: string) => {
        eventLiveMessageValue = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// Mocks
const mockSendMessage = jest.fn();
const mockActivateFullscreen = jest.fn();

// Variable controlable para isFullscreen
// eslint-disable-next-line prefer-const
let mockIsFullscreen = false;

jest.mock('@bands/[bandId]/eventos/[eventId]/_hooks/useEventGateway', () => ({
  useEventGateway: () => ({
    sendMessage: mockSendMessage,
  }),
}));

jest.mock('@bands/[bandId]/eventos/[eventId]/_hooks/useFullscreen', () => ({
  useFullscreen: () => ({
    isFullscreen: mockIsFullscreen,
    isSupported: true,
    activateFullscreen: mockActivateFullscreen,
    exitFullscreen: jest.fn(),
    divRef: { current: null },
  }),
}));

jest.mock(
  '@bands/[bandId]/eventos/[eventId]/_hooks/useHandleEventLeft',
  () => ({
    useHandleEventLeft: () => ({
      eventDateLeft: '2 horas',
    }),
  }),
);

jest.mock(
  '@bands/[bandId]/eventos/[eventId]/_components/LyricsShowcase',
  () => ({
    LyricsShowcase: () => <div data-testid="lyrics-showcase">Lyrics</div>,
  }),
);

// Import after mocks
import { EventMainScreen } from '../EventMainScreen';
import {
  $event,
  $eventSelectedSongId,
  $lyricSelected,
  $selectedSongData,
  $selectedSongLyricLength,
  $eventConfig,
  $eventLiveMessage,
} from '@stores/event';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';

const mockEventData = {
  id: 1,
  title: 'Culto de Adoración',
  date: '2025-11-06',
  bandId: 1,
  songs: [
    {
      song: {
        id: 1,
        title: 'Canción 1',
        artist: 'Artista 1',
        lyrics: [
          {
            id: 1,
            position: 1,
            lyrics: 'Verso 1',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
          {
            id: 2,
            position: 2,
            lyrics: 'Verso 2',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
          {
            id: 3,
            position: 3,
            lyrics: 'Verso 3',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
          {
            id: 4,
            position: 4,
            lyrics: 'Verso 4',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
          {
            id: 5,
            position: 5,
            lyrics: 'Verso 5',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
        ],
        key: 'C',
        songType: 'worship' as const,
      },
      order: 1,
      transpose: 0,
    },
    {
      song: {
        id: 2,
        title: 'Canción 2',
        artist: null,
        lyrics: [
          {
            id: 6,
            position: 1,
            lyrics: 'Verso A',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
          {
            id: 7,
            position: 2,
            lyrics: 'Verso B',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
        ],
        key: 'G',
        songType: 'praise' as const,
      },
      order: 2,
      transpose: 0,
    },
    {
      song: {
        id: 3,
        title: 'Canción 3',
        artist: 'Artista 3',
        lyrics: [
          {
            id: 8,
            position: 1,
            lyrics: 'Verso X',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
          {
            id: 9,
            position: 2,
            lyrics: 'Verso Y',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
          {
            id: 10,
            position: 3,
            lyrics: 'Verso Z',
            structure: { id: 1, title: 'Verso' },
            chords: [],
          },
        ],
        key: 'D',
        songType: 'worship' as const,
      },
      order: 3,
      transpose: 0,
    },
  ],
};

describe('EventMainScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fullscreen state
    mockIsFullscreen = true; // Por defecto en fullscreen para los tests existentes
    // Reset stores
    $event.set(mockEventData);
    $eventSelectedSongId.set(2);
    $lyricSelected.set({ position: 0, action: 'forward' });
    $selectedSongLyricLength.set(2);
    $selectedSongData.set(mockEventData.songs[1]);
    $eventConfig.set({
      showChords: false,
      showKey: false,
      backgroundImage: 1,
      showStructure: false,
      lyricsScale: 1,
      swipeLocked: false,
    });
    $eventLiveMessage.set('');
    $user.set({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '',
      birthdate: '',
      status: 'active',
      isLoggedIn: true,
      roles: [userRoles.admin.id],
      memberships: [],
      membersofBands: [
        {
          id: 1,
          isActive: true,
          isAdmin: true,
          isEventManager: true,
          role: 'member',
          band: { id: 1, name: 'Mi Banda' },
        },
      ],
    });
  });

  describe('Permisos de Event Manager', () => {
    it('debería mostrar botones de navegación cuando el usuario es admin', () => {
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(
        screen.getByRole('button', { name: /iniciar canción/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });

    it('debería mostrar botones de navegación cuando el usuario es event manager', () => {
      $user.set({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '',
        birthdate: '',
        status: 'active',
        isLoggedIn: true,
        roles: [],
        memberships: [],
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: true,
            role: 'member',
            band: { id: 1, name: 'Mi Banda' },
          },
        ],
      });
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(
        screen.getByRole('button', { name: /iniciar canción/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });

    it('NO debería mostrar botones cuando el usuario no es event manager', () => {
      $user.set({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '',
        birthdate: '',
        status: 'active',
        isLoggedIn: true,
        roles: [],
        memberships: [],
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: false,
            role: 'member',
            band: { id: 1, name: 'Mi Banda' },
          },
        ],
      });
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(
        screen.queryByRole('button', { name: /iniciar canción/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
      expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
    });

    it('NO debería mostrar botones cuando NO está en fullscreen (aunque sea admin)', () => {
      mockIsFullscreen = false;
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(
        screen.queryByRole('button', { name: /iniciar canción/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
      expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
    });

    it('NO debería mostrar botones cuando NO está en fullscreen (aunque sea event manager)', () => {
      mockIsFullscreen = false;
      $user.set({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '',
        birthdate: '',
        status: 'active',
        isLoggedIn: true,
        roles: [],
        memberships: [],
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: true,
            role: 'member',
            band: { id: 1, name: 'Mi Banda' },
          },
        ],
      });
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(
        screen.queryByRole('button', { name: /iniciar canción/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
      expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
    });

    it('debería mostrar botones SOLO cuando está en fullscreen Y es event manager', () => {
      mockIsFullscreen = true;
      $user.set({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '',
        birthdate: '',
        status: 'active',
        isLoggedIn: true,
        roles: [],
        memberships: [],
        membersofBands: [
          {
            id: 1,
            isActive: true,
            isAdmin: false,
            isEventManager: true,
            role: 'member',
            band: { id: 1, name: 'Mi Banda' },
          },
        ],
      });
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(
        screen.getByRole('button', { name: /iniciar canción/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });
  });

  describe('Navegación entre canciones', () => {
    it('debería mostrar solo botón "Siguiente" cuando estamos en la primera canción', () => {
      $eventSelectedSongId.set(1);
      $selectedSongData.set(mockEventData.songs[0]);
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });

    it('debería mostrar ambos botones cuando estamos en una canción intermedia', () => {
      $eventSelectedSongId.set(2);
      $selectedSongData.set(mockEventData.songs[1]);
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });

    it('debería mostrar solo botón "Anterior" cuando estamos en la última canción', () => {
      $eventSelectedSongId.set(3);
      $selectedSongData.set(mockEventData.songs[2]);
      $selectedSongLyricLength.set(3);
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
    });

    it('debería cambiar a la canción anterior al hacer clic', () => {
      $eventSelectedSongId.set(2);
      $selectedSongData.set(mockEventData.songs[1]);
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      const previousButton = screen.getByText('Anterior');
      fireEvent.click(previousButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'eventSelectedSong',
        data: 1,
      });
      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 0,
          action: 'forward',
        },
      });
    });

    it('debería cambiar a la canción siguiente al hacer clic', () => {
      $eventSelectedSongId.set(2);
      $selectedSongData.set(mockEventData.songs[1]);
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      const nextButton = screen.getByText('Siguiente');
      fireEvent.click(nextButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'eventSelectedSong',
        data: 3,
      });
      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 0,
          action: 'forward',
        },
      });
    });

    it('debería iniciar la canción al hacer clic en el botón de inicio', () => {
      $eventSelectedSongId.set(1);
      $selectedSongData.set(mockEventData.songs[0]);
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      const startButton = screen.getByRole('button', {
        name: /iniciar canción/i,
      });
      fireEvent.click(startButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 1,
          action: 'forward',
        },
      });
    });
  });

  describe('Pantalla "Fin" y navegación', () => {
    it('debería mostrar "Fin" cuando position === selectedSongLyricLength + 1', () => {
      $lyricSelected.set({ position: 3, action: 'forward' });
      $selectedSongLyricLength.set(2);
      render(<EventMainScreen />);

      expect(screen.getByText('Fin')).toBeInTheDocument();
    });

    it('debería mostrar botones de navegación en la pantalla "Fin"', () => {
      $eventSelectedSongId.set(2);
      $selectedSongData.set(mockEventData.songs[1]);
      $selectedSongLyricLength.set(2);
      $lyricSelected.set({ position: 3, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.getByText('Fin')).toBeInTheDocument();
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });

    it('debería mostrar botón de reiniciar en la pantalla "Fin"', () => {
      $eventSelectedSongId.set(1);
      $selectedSongData.set(mockEventData.songs[0]);
      $selectedSongLyricLength.set(2);
      $lyricSelected.set({ position: 3, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.getByText('Fin')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /reiniciar canción/i }),
      ).toBeInTheDocument();
    });

    it('debería reiniciar la canción al hacer clic en el botón de reiniciar', () => {
      $eventSelectedSongId.set(1);
      $selectedSongData.set(mockEventData.songs[0]);
      $selectedSongLyricLength.set(2);
      $lyricSelected.set({ position: 3, action: 'forward' });
      render(<EventMainScreen />);

      const restartButton = screen.getByRole('button', {
        name: /reiniciar canción/i,
      });
      fireEvent.click(restartButton);

      expect(mockSendMessage).toHaveBeenCalledWith({
        type: 'lyricSelected',
        data: {
          position: 1,
          action: 'forward',
        },
      });
    });

    it('NO debería mostrar botones en pantalla "Fin" cuando NO está en fullscreen', () => {
      mockIsFullscreen = false;
      $eventSelectedSongId.set(2);
      $selectedSongData.set(mockEventData.songs[1]);
      $selectedSongLyricLength.set(2);
      $lyricSelected.set({ position: 3, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.getByText('Fin')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /reiniciar canción/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
      expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
    });

    it('debería mostrar botones en pantalla "Fin" SOLO cuando está en fullscreen Y es event manager', () => {
      mockIsFullscreen = true;
      $eventSelectedSongId.set(2);
      $selectedSongData.set(mockEventData.songs[1]);
      $selectedSongLyricLength.set(2);
      $lyricSelected.set({ position: 3, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.getByText('Fin')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /reiniciar canción/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });
  });

  describe('Visualización de letras', () => {
    it('debería mostrar LyricsShowcase cuando estamos mostrando letras', () => {
      $lyricSelected.set({ position: 1, action: 'forward' });
      $selectedSongLyricLength.set(5);
      render(<EventMainScreen />);

      expect(screen.getByTestId('lyrics-showcase')).toBeInTheDocument();
    });

    it('NO debería mostrar LyricsShowcase en position 0', () => {
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.queryByTestId('lyrics-showcase')).not.toBeInTheDocument();
    });

    it('NO debería mostrar LyricsShowcase en la pantalla "Fin"', () => {
      $lyricSelected.set({ position: 3, action: 'forward' });
      $selectedSongLyricLength.set(2);
      render(<EventMainScreen />);

      expect(screen.getByText('Fin')).toBeInTheDocument();
      expect(screen.queryByTestId('lyrics-showcase')).not.toBeInTheDocument();
    });
  });

  describe('Renderizado de información del evento', () => {
    it('debería mostrar el título de la canción en position 0', () => {
      $lyricSelected.set({ position: 0, action: 'forward' });
      render(<EventMainScreen />);

      expect(screen.getByText('Canción 2')).toBeInTheDocument();
    });

    it('debería mostrar LyricsShowcase cuando position > 0 y < selectedSongLyricLength + 1', () => {
      $lyricSelected.set({ position: 1, action: 'forward' });
      $selectedSongLyricLength.set(5);
      render(<EventMainScreen />);

      expect(screen.getByTestId('lyrics-showcase')).toBeInTheDocument();
    });

    it('debería aplicar imagen de fondo correcta', () => {
      const { container } = render(<EventMainScreen />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.style.backgroundImage).toContain('paisaje_1.avif');
    });

    it('debería cambiar imagen de fondo según eventConfig', () => {
      $eventConfig.set({
        showChords: false,
        showKey: false,
        backgroundImage: 3,
        showStructure: false,
        lyricsScale: 1,
        swipeLocked: false,
      });
      const { container } = render(<EventMainScreen />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv.style.backgroundImage).toContain('paisaje_3.avif');
    });
  });

  describe('Botón de pantalla completa', () => {
    it('debería mostrar botón de pantalla completa cuando no está en fullscreen', () => {
      mockIsFullscreen = false; // Asegurar que NO está en fullscreen
      render(<EventMainScreen />);

      const fullscreenButton = screen.getByLabelText(
        'Activar pantalla completa',
      );
      expect(fullscreenButton).toBeInTheDocument();
    });

    it('debería llamar activateFullscreen al hacer clic', () => {
      mockIsFullscreen = false; // Asegurar que NO está en fullscreen
      render(<EventMainScreen />);

      const fullscreenButton = screen.getByLabelText(
        'Activar pantalla completa',
      );
      fireEvent.click(fullscreenButton);

      expect(mockActivateFullscreen).toHaveBeenCalled();
    });
  });

  describe('Mensajes en vivo', () => {
    it('debería mostrar mensaje cuando eventLiveMessage no está vacío', async () => {
      $eventLiveMessage.set('¡Alabemos juntos!');
      render(<EventMainScreen />);

      await waitFor(() => {
        expect(screen.getByText('¡Alabemos juntos!')).toBeInTheDocument();
      });
    });

    it('debería ocultar el mensaje después de 5 segundos', async () => {
      jest.useFakeTimers();
      $eventLiveMessage.set('Mensaje temporal');
      render(<EventMainScreen />);

      expect(screen.getByText('Mensaje temporal')).toBeInTheDocument();

      jest.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.queryByText('Mensaje temporal')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });
});
