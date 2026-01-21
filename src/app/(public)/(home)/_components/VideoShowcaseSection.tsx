'use client';

import { appName } from '@global/config/constants';
import { YouTubePlayer } from '@global/components/YouTubePlayer';
import ReactPlayer from 'react-player';
import { useRef, useState } from 'react';

const videoChapters = [
  {
    id: 1,
    label: 'Intro: El problema y la solución',
    timestamp: '0:00',
    seconds: 0,
    desc: `Origen de ${appName}: Resolver la proyección de letras y acordes simultáneamente.`,
  },
  {
    id: 2,
    label: 'Registro y Login vía WhatsApp',
    timestamp: '3:52',
    seconds: 232,
    desc: 'Sistema de autenticación seguro y sin costo usando un Bot de WhatsApp.',
  },
  {
    id: 3,
    label: 'Creación de Grupos y Miembros',
    timestamp: '5:57',
    seconds: 357,
    desc: 'Administración de equipos de alabanza e invitación de músicos.',
  },
  {
    id: 4,
    label: 'Gestión de Planes y Pagos',
    timestamp: '8:45',
    seconds: 525,
    desc: 'Suscripciones, métodos de pago (Sinpe/PayPal) y activación.',
  },
  {
    id: 5,
    label: 'Creando un Evento (Culto)',
    timestamp: '10:21',
    seconds: 621,
    desc: 'Armar el setlist, ordenar canciones y preparar el servicio.',
  },
  {
    id: 6,
    label: 'Modo en Vivo: Proyector vs. Músicos',
    timestamp: '12:06',
    seconds: 726,
    desc: 'Sincronización real-time: el público ve letras, los músicos ven acordes.',
  },
  {
    id: 7,
    label: 'Visualización Estructurada (Colores)',
    timestamp: '16:25',
    seconds: 985,
    desc: 'Diferenciación visual de Versos, Coros y Puentes para anticipar cambios.',
  },
  {
    id: 8,
    label: 'Feed Social y Compartir Canciones',
    timestamp: '19:00',
    seconds: 1140,
    desc: 'Comunidad para compartir cifrados, dar "Bless" y solicitar canciones.',
  },
  {
    id: 9,
    label: 'Sincronización Automática (Autoscroll)',
    timestamp: '21:20',
    seconds: 1280,
    desc: 'La app sigue la música automáticamente, marcando el acorde actual.',
  },
  {
    id: 10,
    label: 'Metrónomo Visual y Audio',
    timestamp: '23:32',
    seconds: 1412,
    desc: 'Herramientas de práctica integradas con el cifrado.',
  },
  {
    id: 11,
    label: 'Editor de Canciones',
    timestamp: '27:14',
    seconds: 1634,
    desc: 'Modificar letras, cambiar acordes y personalizar cifrados.',
  },
];

export const VideoShowcaseSection = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pendingSeekTime, setPendingSeekTime] = useState<number | null>(null);

  // Handle seeking when a chapter is clicked
  const handleSeek = (seconds: number, id: number) => {
    setCurrentChapterId(id);

    // If player is active and ready, seek immediately
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
      setIsPlaying(true);
    } else {
      // If player is not active (thumbnail mode) or not playing,
      // we set pending seek time and force play
      setPendingSeekTime(seconds);
      setIsPlaying(true);
    }
  };

  const handlePlayerReady = () => {
    if (pendingSeekTime !== null && playerRef.current) {
      playerRef.current.seekTo(pendingSeekTime, 'seconds');
      setPendingSeekTime(null);
    }
  };

  // Optional: Track progress to update active chapter
  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    // Find the chapter that matches the current time
    // We want the last chapter that has seconds <= playedSeconds
    const activeChapter = [...videoChapters]
      .reverse()
      .find((chapter) => chapter.seconds <= playedSeconds + 1); // +1 buffer

    if (activeChapter && activeChapter.id !== currentChapterId) {
      setCurrentChapterId(activeChapter.id);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/50 py-24 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <div className="absolute -right-[10%] -top-[20%] h-[600px] w-[600px] rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -left-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-purple-400/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Descubre todo lo que{' '}
            <span className="text-indigo-600 dark:text-indigo-400">
              {appName}
            </span>{' '}
            puede hacer
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-400">
            Explora las funcionalidades clave en video. Selecciona un tema para
            ir directo a la acción.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Video Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-24 aspect-video overflow-hidden rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-gray-900/10">
              <YouTubePlayer
                playerRef={playerRef}
                youtubeUrl="https://www.youtube.com/watch?v=NGFYbOixTMo"
                uniqueId="showcase-video"
                onProgress={handleProgress}
                showControls={true}
                className="h-full w-full"
                autoplay={isPlaying}
                onReady={handlePlayerReady}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>

          {/* Chapters List Column */}
          <div className="custom-scrollbar max-h-[600px] overflow-y-auto pr-2 lg:col-span-5 xl:col-span-4">
            <div className="space-y-3">
              {videoChapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleSeek(chapter.seconds, chapter.id)}
                  className={`w-full rounded-xl border border-transparent p-4 text-left transition-all duration-300 ${
                    currentChapterId === chapter.id
                      ? 'scale-[1.02] border-indigo-100 bg-white shadow-lg dark:border-indigo-900/50 dark:bg-gray-800'
                      : 'border-gray-100 bg-white/50 hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-800'
                  } `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        currentChapterId === chapter.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      } `}
                    >
                      {chapter.timestamp}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-semibold ${
                          currentChapterId === chapter.id
                            ? 'text-indigo-900 dark:text-indigo-100'
                            : 'text-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {chapter.label}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                        {chapter.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Highlights (Core Selling Points from prompt) */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 2a10 10 0 0 1 10 10h-10V2z" opacity="0.5"></path>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
              Sincronización en Tiempo Real
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lo que cambia el líder se refleja instantáneamente en el proyector
              y los dispositivos de todos los músicos.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
              Vistas Diferenciadas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Letra grande y fondos animados para el <strong>Público</strong>.
              Acordes y fondo oscuro para <strong>Músicos</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
              Login vía WhatsApp
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Autenticación simple, segura y sin contraseñas. Ideal para
              gestionar voluntarios rápidamente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
