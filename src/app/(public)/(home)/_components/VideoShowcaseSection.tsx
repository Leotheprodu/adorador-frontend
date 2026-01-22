'use client';

import { appName } from '@global/config/constants';
import ReactPlayer from 'react-player';
import { useRef, useState } from 'react';
import { VIDEO_CHAPTERS } from '../_constants/videoShowcase.constants';
import { VideoChaptersList } from './VideoShowcase/VideoChaptersList';
import { VideoHighlights } from './VideoShowcase/VideoHighlights';
import { YouTubeThumbnail } from '@global/components/YouTubeThumbnail';
import { extractYouTubeId, getYouTubeThumbnail } from '@global/utils/formUtils';

export const VideoShowcaseSection = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [pendingSeekTime, setPendingSeekTime] = useState<number | null>(null);

  const videoUrl = 'https://www.youtube.com/watch?v=NGFYbOixTMo';
  const youtubeId = extractYouTubeId(videoUrl);
  const thumbnail = getYouTubeThumbnail(youtubeId, 'maxresdefault');

  // Handle seeking when a chapter is clicked
  const handleSeek = (seconds: number, id: number) => {
    setCurrentChapterId(id);

    // Ensure player is visible
    if (!showPlayer) {
      setShowPlayer(true);
      setPendingSeekTime(seconds);
      setIsPlaying(true);
      return;
    }

    // If player is active, seek and play
    setIsPlaying(true);
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
    }
  };

  const handlePlayerReady = () => {
    if (pendingSeekTime !== null && playerRef.current) {
      playerRef.current.seekTo(pendingSeekTime, 'seconds');
      setPendingSeekTime(null);
    }
  };

  const handlePlayVideo = () => {
    setShowPlayer(true);
    setIsPlaying(true);
  };

  // Optional: Track progress to update active chapter
  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    // Find the chapter that matches the current time
    // We want the last chapter that has seconds <= playedSeconds
    const activeChapter = [...VIDEO_CHAPTERS]
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
            <div className="sticky top-24 aspect-video h-full overflow-hidden rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-gray-900/10">
              {!showPlayer ? (
                <YouTubeThumbnail
                  thumbnail={thumbnail}
                  title="Showcase Video"
                  onPlay={handlePlayVideo}
                />
              ) : (
                <div className="relative h-full w-full">
                  <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    playing={isPlaying}
                    controls={true}
                    width="100%"
                    height="100%"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onProgress={handleProgress}
                    onReady={handlePlayerReady}
                    config={{
                      youtube: {
                        playerVars: {
                          modestbranding: 1,
                          rel: 0,
                          autoplay: 1,
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Chapters List Column */}
          <VideoChaptersList
            currentChapterId={currentChapterId}
            onChapterClick={handleSeek}
          />
        </div>

        {/* Additional Highlights (Core Selling Points from prompt) */}
        <VideoHighlights />
      </div>
    </section>
  );
};
