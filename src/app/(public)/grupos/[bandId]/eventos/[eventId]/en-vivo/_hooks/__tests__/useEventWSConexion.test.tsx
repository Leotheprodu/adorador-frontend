import { renderHook, waitFor } from '@testing-library/react';
import { io } from 'socket.io-client';
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

// Mock the event stores with inline factory
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
  let eventAdminNameValue = '';
  let selectedSongDataValue: EventSongsProps | undefined = undefined;
  let selectedSongLyricLengthValue = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let eventSocketValue: any = null;
  let eventLiveMessageValue = '';

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
    $eventAdminName: {
      get: () => eventAdminNameValue,
      set: (newValue: string) => {
        eventAdminNameValue = newValue;
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
    $eventSocket: {
      get: () => eventSocketValue,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (newValue: any) => {
        eventSocketValue = newValue;
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

// Mock socket.io-client
jest.mock('socket.io-client');

// Import after mocks
import { useEventWSConexion } from '../useEventWSConexion';
import {
  $lyricSelected,
  $eventSelectedSongId,
  $eventAdminName,
  $selectedSongData,
  $selectedSongLyricLength,
  $event,
} from '@stores/event';

// Mock JWT utils
jest.mock('@global/utils/jwtUtils', () => ({
  getValidAccessToken: jest.fn().mockResolvedValue('mock-token'),
  isTokenExpired: jest.fn().mockReturnValue(false),
  getTokens: jest.fn().mockReturnValue({ accessToken: 'mock-token' }),
}));

describe('useEventWSConexion - Sincronización de estado', () => {
  let mockSocket: Record<string, jest.Mock>;
  let mockEmit: jest.Mock;
  let mockOn: jest.Mock;
  let mockOff: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    // Reset all stores to initial state
    $lyricSelected.set({ position: 0, action: 'forward' });
    $eventSelectedSongId.set(0);
    $eventAdminName.set('');
    $selectedSongData.set(undefined);
    $selectedSongLyricLength.set(0);
    $event.set({
      id: 17,
      title: 'Test Event',
      date: '2025-11-06',
      bandId: 1,
      songs: [
        {
          transpose: 0,
          order: 1,
          song: {
            id: 17,
            title: 'Test Song',
            artist: 'Test Artist',
            songType: 'worship' as const,
            key: 'C',
            lyrics: [
              {
                id: 1,
                lyrics: 'Line 1',
                position: 1,
                chords: [],
                structure: { id: 1, title: 'verse' },
              },
              {
                id: 2,
                lyrics: 'Line 2',
                position: 2,
                chords: [],
                structure: { id: 1, title: 'verse' },
              },
              {
                id: 3,
                lyrics: 'Line 3',
                position: 3,
                chords: [],
                structure: { id: 2, title: 'chorus' },
              },
              {
                id: 4,
                lyrics: 'Line 4',
                position: 4,
                chords: [],
                structure: { id: 2, title: 'chorus' },
              },
            ],
          },
        },
      ],
    });

    // Mock socket instance
    mockEmit = jest.fn();
    mockOn = jest.fn();
    mockOff = jest.fn();
    mockDisconnect = jest.fn();

    mockSocket = {
      emit: mockEmit,
      on: mockOn,
      off: mockOff,
      disconnect: mockDisconnect,
    };

    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Carga inicial - sincronización desde servidor', () => {
    it('debe mantener la posición actual cuando llegan mensajes del servidor en la carga inicial', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      // Simular que los listeners están configurados
      const setupComplete = mockOn.mock.calls.find(
        ([event]) => event === 'connect',
      );
      expect(setupComplete).toBeDefined();

      // Obtener los listeners registrados
      const lyricListener = mockOn.mock.calls.find(
        ([event]) => event === 'lyricSelected-17',
      )?.[1];
      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      expect(lyricListener).toBeDefined();
      expect(songListener).toBeDefined();

      // 1. Primero llega lyricSelected con position: 4
      lyricListener({
        message: { position: 4, action: 'forward' },
        eventAdmin: 'Leo',
      });

      // Verificar que la posición se actualizó
      expect($lyricSelected.get()).toEqual({ position: 4, action: 'forward' });
      expect($eventAdminName.get()).toBe('Leo');

      // 2. Luego llega eventSelectedSong con la misma canción
      songListener({
        message: 17,
        eventAdmin: 'Leo',
      });

      // Verificar que la posición NO se resetea (mantiene position: 4)
      await waitFor(() => {
        expect($lyricSelected.get()).toEqual({
          position: 4,
          action: 'forward',
        });
        expect($eventSelectedSongId.get()).toBe(17);
      });
    });

    it('debe resetear a 0 cuando no hay mensajes previos del servidor', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      // Obtener listener de current_state_sent
      const stateListener = mockOn.mock.calls.find(
        ([event]) => event === 'current_state_sent',
      )?.[1];

      expect(stateListener).toBeDefined();

      // Servidor confirma que no hay mensajes previos
      stateListener({ messagesCount: 0 });

      // Verificar que se resetea a posición 0
      await waitFor(() => {
        expect($lyricSelected.get()).toEqual({
          position: 0,
          action: 'forward',
        });
        expect($eventSelectedSongId.get()).toBe(0);
        expect($eventAdminName.get()).toBe('');
      });
    });
  });

  describe('Cambio de canción durante evento activo', () => {
    it('debe resetear la posición a 0 cuando la canción cambia', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      expect(songListener).toBeDefined();

      // Estado inicial: canción 17 en posición 4
      $eventSelectedSongId.set(17);
      $lyricSelected.set({ position: 4, action: 'forward' });

      // Cambiar a una canción diferente (agregar segunda canción al evento)
      $event.set({
        ...$event.get(),
        songs: [
          ...$event.get().songs,
          {
            transpose: 0,
            order: 2,
            song: {
              id: 18,
              title: 'Another Song',
              artist: 'Another Artist',
              songType: 'praise' as const,
              key: 'D',
              lyrics: [
                {
                  id: 5,
                  lyrics: 'Another Line',
                  position: 1,
                  chords: [],
                  structure: { id: 1, title: 'verse' },
                },
              ],
            },
          },
        ],
      });

      // Simular cambio de canción
      songListener({
        message: 18,
        eventAdmin: 'Leo',
      });

      // Verificar que la posición se resetea a 0 porque la canción cambió
      await waitFor(() => {
        expect($eventSelectedSongId.get()).toBe(18);
        expect($lyricSelected.get()).toEqual({
          position: 0,
          action: 'backward',
        });
      });
    });

    it('debe mantener la posición cuando llega la misma canción múltiples veces', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const lyricListener = mockOn.mock.calls.find(
        ([event]) => event === 'lyricSelected-17',
      )?.[1];
      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      expect(lyricListener).toBeDefined();
      expect(songListener).toBeDefined();

      // Estado inicial
      $eventSelectedSongId.set(17);
      $lyricSelected.set({ position: 3, action: 'forward' });

      // Llega la misma canción otra vez
      songListener({
        message: 17,
        eventAdmin: 'Leo',
      });

      // Verificar que la posición NO se resetea
      await waitFor(() => {
        expect($eventSelectedSongId.get()).toBe(17);
        expect($lyricSelected.get()).toEqual({
          position: 3,
          action: 'forward',
        });
      });

      // Luego cambia la posición
      lyricListener({
        message: { position: 4, action: 'forward' },
        eventAdmin: 'Leo',
      });

      // Verificar que la nueva posición se aplica
      await waitFor(() => {
        expect($lyricSelected.get()).toEqual({
          position: 4,
          action: 'forward',
        });
      });
    });
  });

  describe('Sincronización de stores derivados', () => {
    it('debe actualizar selectedSongData y lyricLength cuando cambia la canción', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      expect(songListener).toBeDefined();

      // Simular selección de canción
      songListener({
        message: 17,
        eventAdmin: 'Leo',
      });

      // Verificar que los stores derivados se actualizan
      await waitFor(() => {
        expect($selectedSongData.get()?.song?.id).toBe(17);
        expect($selectedSongLyricLength.get()).toBe(4);
      });
    });
  });

  describe('Manejo de formatos de mensajes', () => {
    it('debe procesar correctamente mensajes en formato legacy', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const lyricListener = mockOn.mock.calls.find(
        ([event]) => event === 'lyricSelected-17',
      )?.[1];

      expect(lyricListener).toBeDefined();

      // Mensaje en formato legacy
      lyricListener({
        message: { position: 2, action: 'backward' },
        eventAdmin: 'TestAdmin',
      });

      await waitFor(() => {
        expect($lyricSelected.get()).toEqual({
          position: 2,
          action: 'backward',
        });
        expect($eventAdminName.get()).toBe('TestAdmin');
      });
    });
  });

  describe('Solicitud de estado actual', () => {
    it('debe emitir request_current_state después de configurar listeners', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockEmit).toHaveBeenCalledWith('listeners_ready');
      });

      // Esperar a que se emita request_current_state (hay un setTimeout de 50ms)
      await waitFor(
        () => {
          expect(mockEmit).toHaveBeenCalledWith('request_current_state');
        },
        { timeout: 200 },
      );
    });
  });
});
