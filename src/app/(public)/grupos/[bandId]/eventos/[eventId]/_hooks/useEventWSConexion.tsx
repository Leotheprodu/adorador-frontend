import { Server1API } from '@global/config/constants';
import {
  $event,
  $eventAdminName,
  $eventLiveMessage,
  $eventSelectedSongId,
  $eventSocket,
  $lyricSelected,
  $selectedSongData,
  $selectedSongLyricLength,
} from '@stores/event';
import { $user } from '@stores/users';
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  getValidAccessToken,
  isTokenExpired,
  getTokens,
} from '@global/utils/jwtUtils';
import {
  isCompressedMessage,
  decompressMessage,
  toLegacyLyricFormat,
  toLegacyEventSongFormat,
  toLegacyLiveMessageFormat,
  toLegacySongUpdateFormat,
  isValidLyricMessage,
  isValidEventSongMessage,
  isValidLiveMessage,
  isValidSongUpdateMessage,
  isLegacyLyricMessage,
  isLegacyEventSongMessage,
} from '@global/interfaces/websocket-messages.interface';

interface OptimizedSocketConfig {
  forceNew: boolean;
  reconnection: boolean;
  timeout: number;
  reconnectionAttempts: number;
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  maxReconnectionAttempts: number;
  randomizationFactor: number;
  auth?: {
    token: string;
  };
}

export const useEventWSConexion = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  // Reconexión inteligente cuando expira el token
  const handleTokenExpiredReconnection = useCallback(async () => {
    console.log('[WebSocket] Intentando reconexión con token renovado...');

    // Limpiar timeout existente
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Esperar un poco antes de reconectar
    reconnectTimeoutRef.current = setTimeout(async () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Recrear el socket será manejado por el useEffect
    }, 2000);
  }, []);

  const createOptimizedSocket =
    useCallback(async (): Promise<Socket | null> => {
      try {
        // Evitar conexiones múltiples simultáneas
        if (isConnectingRef.current) {
          return null;
        }
        isConnectingRef.current = true;

        // Obtener token si está disponible (para usuarios logueados)
        // Pero permitir conexión sin token para streaming público
        const token = await getValidAccessToken();

        // Configuración optimizada para tiempo real
        const socketConfig: OptimizedSocketConfig = {
          forceNew: true,
          reconnection: true,
          timeout: 5000, // Timeout reducido para conexión rápida
          reconnectionAttempts: 10,
          reconnectionDelay: 1000, // Reconectar rápido inicialmente
          reconnectionDelayMax: 3000, // Máximo delay de reconexión
          maxReconnectionAttempts: 10,
          randomizationFactor: 0.5,
        };

        // Solo incluir auth si hay token (usuarios logueados)
        if (token) {
          socketConfig.auth = {
            token: token,
          };
        } else {
        }

        const newSocket = io(Server1API, socketConfig);

        // IMPORTANTE: Los listeners específicos se configurarán después
        // usando setupSocketListeners que maneja el formato correcto

        // Eventos de conexión optimizados
        newSocket.on('connect', () => {
          console.log(
            '[WebSocket] Socket conectado - esperando confirmación del servidor...',
          );
          isConnectingRef.current = false;
        });

        // Evento especial cuando el servidor está listo para enviar estado
        newSocket.on(
          'connection_ready',
          (data: {
            messagesAvailable: number;
            userId?: number;
            userName: string;
            isAuthenticated: boolean;
          }) => {
            console.log(
              `[WebSocket] Servidor listo. Usuario: ${data.userName}, Autenticado: ${data.isAuthenticated}, Mensajes disponibles: ${data.messagesAvailable}`,
            );
            // NO hacer nada aquí - esperar a que setupSocketListeners emita listeners_ready
          },
        );

        // Confirmación de que el estado actual fue enviado
        newSocket.on(
          'current_state_sent',
          (data: { messagesCount: number }) => {
            console.log(
              `[WebSocket SYNC] ✅ Estado actual recibido: ${data.messagesCount} mensajes procesados`,
            );
            if (data.messagesCount === 0) {
              console.warn(
                '[WebSocket SYNC] ⚠️ No hay estado previo guardado en el servidor. Inicializando estado limpio...',
              );
              // Solo resetear si no hay mensajes previos
              $lyricSelected.set({ position: 0, action: 'forward' });
              $eventAdminName.set('');
              $eventSelectedSongId.set(0);
              console.log('[WebSocket SYNC] ✅ Estado inicial configurado');
            } else {
              console.log(
                `[WebSocket SYNC] ✅ Estado sincronizado con ${data.messagesCount} mensajes del servidor`,
              );
            }
          },
        );

        newSocket.on('connect_error', (error) => {
          console.error('[WebSocket] Error de conexión:', error);
          isConnectingRef.current = false;
        });

        // Manejo inteligente de desconexión
        newSocket.on('disconnect', (reason) => {
          console.warn('[WebSocket] Desconectado:', reason);

          // Si es desconexión por el servidor, puede ser por token expirado
          if (reason === 'io server disconnect') {
            handleTokenExpiredReconnection();
          }
        });

        // Escuchar reconexión exitosa
        newSocket.on('reconnect', (attemptNumber) => {
          console.log(
            `[WebSocket] Reconectado después de ${attemptNumber} intentos`,
          );
        });

        // Manejo de errores de autenticación
        newSocket.on('error', (error: unknown) => {
          console.error('[WebSocket] Error:', error);
          const errorObj = error as { message?: string; m?: string };

          // Solo reconectar si es problema de token, no si es "No auth" para invitados
          if (
            errorObj.message?.includes('token') ||
            (errorObj.message?.includes('auth') &&
              !errorObj.m?.includes('No auth'))
          ) {
            handleTokenExpiredReconnection();
          } else if (errorObj.m === 'No auth') {
            // Usuario invitado intentó hacer una acción que requiere auth
            console.warn(
              '[WebSocket] Acción requiere autenticación - usuario en modo lectura',
            );
          }
        });

        // Acknowledgment de mensajes para confirmar recepción
        newSocket.on('messageAck', (data) => {
          console.log('[WebSocket] Mensaje confirmado:', data);
        });

        // Listener para errores específicos de permisos (no desconectar)
        newSocket.on('error', (errorData: { m?: string }) => {
          if (errorData.m === 'No perms') {
            console.warn(
              '[WebSocket] Sin permisos para administrar este evento',
            );
          } else if (errorData.m === 'Rate limit') {
            console.warn(
              '[WebSocket] Rate limit aplicado - reducir frecuencia de mensajes',
            );
          }
        });

        return newSocket;
      } catch (error) {
        console.error('[WebSocket] Error creando socket:', error);
        isConnectingRef.current = false;
        return null;
      }
    }, [handleTokenExpiredReconnection]);

  // Configurar listeners ultra-optimizados para mensajes comprimidos
  const setupSocketListeners = useCallback(
    (socket: Socket) => {
      // Limpiar listeners anteriores
      socket.off(`lyricSelected-${params.eventId}`);
      socket.off(`eventSelectedSong-${params.eventId}`);
      socket.off(`eventManagerChanged-${params.eventId}`);
      socket.off(`eventSongsUpdated-${params.eventId}`);
      socket.off(`songUpdated-${params.eventId}`);
      socket.off(`liveMessage-${params.eventId}`);

      // Listener optimizado para letras con soporte para formatos legacy y nuevos
      socket.on(`lyricSelected-${params.eventId}`, (data) => {
        console.log(
          `[WebSocket SYNC] 🎵 Recibido lyricSelected-${params.eventId}:`,
          data,
        );
        try {
          let lyricMessage;
          let adminName = 'Unknown';

          // Detectar si es formato comprimido o legacy
          if (isCompressedMessage(data)) {
            const decompressed = decompressMessage(data);
            adminName = decompressed.userName;

            // Convertir mensaje optimizado a formato legacy para compatibilidad
            if (isValidLyricMessage(decompressed.message)) {
              lyricMessage = toLegacyLyricFormat(decompressed.message);
            }
          } else {
            // Formato legacy directo
            console.log(
              '[WebSocket DEBUG] Procesando mensaje legacy:',
              data.message,
            );
            console.log(
              '[WebSocket DEBUG] isLegacyLyricMessage:',
              isLegacyLyricMessage(data.message),
            );
            if (data.message && isLegacyLyricMessage(data.message)) {
              lyricMessage = data.message;
              console.log(
                '[WebSocket DEBUG] Lyric message asignado:',
                lyricMessage,
              );
            }
            if (data.eventAdmin) {
              adminName = data.eventAdmin;
            }
          }

          if (lyricMessage) {
            console.log(
              '[WebSocket DEBUG] Actualizando $lyricSelected con:',
              lyricMessage,
            );
            $lyricSelected.set(lyricMessage);
            $eventAdminName.set(adminName);
          } else {
            console.warn(
              '[WebSocket DEBUG] lyricMessage es null/undefined, no se actualiza el store',
            );
          }
        } catch (error) {
          console.warn('[WebSocket] Error procesando lyric message:', error);
        }
      });

      // Listener optimizado para selección de canciones
      socket.on(`eventSelectedSong-${params.eventId}`, (data) => {
        console.log(
          `[WebSocket SYNC] 🎼 Recibido eventSelectedSong-${params.eventId}:`,
          data,
        );
        try {
          let songId;
          let adminName = 'Unknown';

          // Detectar formato
          if (isCompressedMessage(data)) {
            const decompressed = decompressMessage(data);
            adminName = decompressed.userName;

            if (isValidEventSongMessage(decompressed.message)) {
              songId = toLegacyEventSongFormat(decompressed.message);
            }
          } else {
            // Formato legacy
            console.log(
              '[WebSocket DEBUG] Procesando songId legacy:',
              data.message,
            );
            console.log(
              '[WebSocket DEBUG] isLegacyEventSongMessage:',
              isLegacyEventSongMessage(data.message),
            );
            if (isLegacyEventSongMessage(data.message)) {
              songId = data.message;
              console.log('[WebSocket DEBUG] Song ID asignado:', songId);
            }
            if (data.eventAdmin) {
              adminName = data.eventAdmin;
            }
          }

          if (songId !== undefined) {
            console.log(
              '[WebSocket DEBUG] Actualizando $eventSelectedSongId con:',
              songId,
            );

            // Verificar si la canción cambió
            const previousSongId = $eventSelectedSongId.get();
            const isSongChange =
              previousSongId !== songId && previousSongId !== 0;

            // Actualizar el id y el nombre del admin
            $eventSelectedSongId.set(songId);
            $eventAdminName.set(adminName);

            // Además, actualizar los stores derivados para forzar la sincronía
            // con la UI de los viewers (selected song data y longitud de letra)
            try {
              const currentEvent = $event.get ? $event.get() : null;
              const songsList = currentEvent?.songs || [];
              const matched = songsList.find((s) => s?.song?.id === songId);
              if (matched) {
                $selectedSongData.set(matched);
                const lyricsLength = matched.song?.lyrics?.length || 0;
                $selectedSongLyricLength.set(lyricsLength);

                // SOLO reiniciar la posición si la canción cambió (no en la carga inicial)
                if (isSongChange) {
                  console.log(
                    '[WebSocket DEBUG] Canción cambió, reseteando posición a 0',
                  );
                  $lyricSelected.set({ position: 0, action: 'backward' });
                } else {
                  console.log(
                    '[WebSocket DEBUG] Misma canción o carga inicial, manteniendo posición actual',
                  );
                }
              }
            } catch (err) {
              console.warn(
                '[WebSocket SYNC] Error actualizando stores derivados:',
                err,
              );
            }
          }
        } catch (error) {
          console.warn('[WebSocket] Error procesando song message:', error);
        }
      });

      // Listener para cambios de event manager
      socket.on(`eventManagerChanged-${params.eventId}`, (data) => {
        console.log(
          `[WebSocket] 👑 Cambio de Event Manager recibido para evento ${params.eventId}:`,
          data,
        );
        try {
          const { newEventManagerId, newEventManagerName, bandId } = data;

          // Actualizar el nombre del admin del evento
          $eventAdminName.set(newEventManagerName);

          // Actualizar el store del usuario para reflejar el cambio
          const currentUser = $user.get();
          if (currentUser && currentUser.membersofBands) {
            const updatedUser = {
              ...currentUser,
              membersofBands: currentUser.membersofBands.map((band) => {
                if (band.band.id === parseInt(bandId)) {
                  return {
                    ...band,
                    isEventManager: currentUser.id === newEventManagerId,
                  };
                }
                return band;
              }),
            };

            console.log(
              '[WebSocket] Actualizando usuario por cambio de event manager:',
              updatedUser,
            );
            $user.set(updatedUser);

            // Actualizar localStorage también
            import('@global/utils/handleLocalStorage').then(
              ({ setLocalStorage }) => {
                setLocalStorage('user', updatedUser);
              },
            );
          }

          // Mostrar notificación si el usuario actual es el nuevo admin
          if (currentUser && currentUser.id === newEventManagerId) {
            import('react-hot-toast').then((toast) => {
              toast.default.success('¡Ahora eres el administrador del evento!');
            });
          } else if (
            currentUser &&
            currentUser.membersofBands?.some(
              (band) =>
                band.band.id === parseInt(bandId) && band.isEventManager,
            )
          ) {
            // Si el usuario actual perdió los permisos de admin
            import('react-hot-toast').then((toast) => {
              toast.default(
                `${newEventManagerName} es ahora el administrador del evento`,
              );
            });
          }
        } catch (error) {
          console.warn(
            '[WebSocket] Error procesando cambio de event manager:',
            error,
          );
        }
      });

      // Listener para cambios en las canciones del evento
      socket.on(`eventSongsUpdated-${params.eventId}`, (data) => {
        console.log(
          `[WebSocket] 🎵 Cambios en canciones del evento ${params.eventId}:`,
          data,
        );
        try {
          const { changeType, message } = data;

          // La invalidación de la query se manejará desde el componente padre

          // Mostrar notificación sobre el cambio
          import('react-hot-toast').then((toast) => {
            toast.default(
              message || 'Se actualizaron las canciones del evento',
            );
          });

          // Como alternativa, podemos disparar un evento personalizado que capture el componente padre
          window.dispatchEvent(
            new CustomEvent('eventSongsUpdated', {
              detail: { eventId: params.eventId, changeType, message },
            }),
          );
        } catch (error) {
          console.warn(
            '[WebSocket] Error procesando cambio de canciones:',
            error,
          );
        }
      });

      // Listener para actualizaciones de canciones individuales (letras, metadata, etc.)
      socket.on(`songUpdated-${params.eventId}`, (data) => {
        console.log(
          `[WebSocket] 🎼 Canción actualizada en evento ${params.eventId}:`,
          data,
        );
        try {
          let songId: number;
          let changeType: 'lyrics' | 'info' | 'all' = 'all';

          // Detectar si es formato comprimido o legacy
          if (isCompressedMessage(data)) {
            const decompressed = decompressMessage(data);
            if (isValidSongUpdateMessage(decompressed.message)) {
              const songUpdate = toLegacySongUpdateFormat(decompressed.message);
              songId = songUpdate.songId;
              changeType = songUpdate.changeType;
            } else {
              console.warn('[WebSocket] Mensaje de actualización inválido');
              return;
            }
          } else if (
            data &&
            typeof data === 'object' &&
            'songId' in data &&
            typeof data.songId === 'number'
          ) {
            // Formato legacy
            songId = data.songId;
            changeType =
              'changeType' in data &&
              (data.changeType === 'lyrics' ||
                data.changeType === 'info' ||
                data.changeType === 'all')
                ? data.changeType
                : 'all';
          } else {
            console.warn(
              '[WebSocket] Formato de mensaje de actualización desconocido',
            );
            return;
          }

          // Verificar si la canción actualizada está en el evento actual
          const event = $event.get();
          const songInEvent = event.songs.find(
            (eventSong) => eventSong.song.id === songId,
          );

          if (songInEvent) {
            console.log(
              `[WebSocket] ✅ Canción ID ${songId} está en el evento - tipo de cambio: ${changeType}`,
            );

            // Mostrar notificación según el tipo de cambio
            const changeMessages: Record<typeof changeType, string> = {
              lyrics: '🎵 Letras actualizadas',
              info: 'ℹ️ Información actualizada',
              all: '🔄 Canción actualizada',
            };

            import('react-hot-toast').then((toast) => {
              toast.default(
                `${changeMessages[changeType]}: "${songInEvent.song.title}"`,
                { duration: 4000 },
              );
            });

            // Disparar evento personalizado para refrescar el evento
            window.dispatchEvent(
              new CustomEvent('eventSongsUpdated', {
                detail: {
                  eventId: params.eventId,
                  changeType: 'songUpdated',
                  songId,
                  updateType: changeType,
                  message: `Canción "${songInEvent.song.title}" actualizada`,
                },
              }),
            );
          } else {
            console.log(
              `[WebSocket] ℹ️ Canción ID ${songId} actualizada pero no está en este evento`,
            );
          }
        } catch (error) {
          console.warn(
            '[WebSocket] Error procesando actualización de canción:',
            error,
          );
        }
      });

      // Listener para mensajes en vivo
      socket.on(`liveMessage-${params.eventId}`, (data) => {
        console.log(
          `[WebSocket] Recibido liveMessage-${params.eventId}:`,
          data,
        );
        try {
          let message;

          if (isCompressedMessage(data)) {
            const decompressed = decompressMessage(data);
            if (isValidLiveMessage(decompressed.message)) {
              message = toLegacyLiveMessageFormat(decompressed.message);
            }
          } else {
            // Formato legacy directo
            message = data;
          }

          if (message) {
            $eventLiveMessage.set(message);
          }
        } catch (error) {
          console.warn('[WebSocket] Error procesando live message:', error);
        }
      });

      // Emitir evento para indicar que todos los listeners están configurados
      console.log(
        '[WebSocket] Todos los listeners configurados - emitiendo listeners_ready y solicitando estado',
      );
      socket.emit('listeners_ready');

      // Solicitar el estado actual inmediatamente después de configurar listeners
      // El servidor enviará los mensajes guardados a través de los listeners ya configurados
      setTimeout(() => {
        console.log(
          '[WebSocket SYNC] 🔄 Solicitando estado actual del servidor...',
        );
        socket.emit('request_current_state');
      }, 50); // Pequeño delay para asegurar que listeners_ready se procese primero
    },
    [params.eventId],
  );

  useEffect(() => {
    let mounted = true;

    const initializeSocket = async () => {
      // IMPORTANTE: NO resetear estados aquí - esperaremos el estado del servidor
      // Solo resetearemos si el servidor confirma que no hay estado previo

      // Crear socket optimizado
      const socket = await createOptimizedSocket();

      if (socket && mounted) {
        socketRef.current = socket;
        $eventSocket.set(socket);
        setupSocketListeners(socket);
      }
    };

    // Verificar token antes de inicializar
    const tokens = getTokens();
    if (!tokens || isTokenExpired(tokens)) {
      console.warn(
        '[WebSocket] Token expirado, intentando renovar antes de conectar...',
      );
    }

    initializeSocket();

    // Cleanup
    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, [params.eventId, createOptimizedSocket, setupSocketListeners]);

  return {};
};
