'use client';
import { useParams } from 'next/navigation';
import { Card, CardBody, Button } from '@heroui/react';
import { CheckIcon } from '@global/icons/CheckIcon';
import ReactPlayer from 'react-player';
import { BeatMapperProps } from '../_interfaces/beatMapperInterfaces';
import { useBeatMapper } from '../_hooks/useBeatMapper';
import { MetronomeControls } from './MetronomeControls';
import { TimelineVisualizer } from './TimelineVisualizer';
import { BeatMapperSettings } from './BeatMapperSettings';

// Helper component for loading state or missing video
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex h-64 w-full items-center justify-center rounded-xl bg-content2 p-8 text-center text-white/50">
    <p>{message}</p>
  </div>
);

type ExtendedBeatMapperProps = BeatMapperProps & {
  initialBpm?: number;
  initialStartTime?: number;
};

// Helper function for time formatting
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
};

export const BeatMapper = ({
  youtubeLink,
  songId,
  initialBpm,
  initialStartTime,
}: ExtendedBeatMapperProps) => {
  const params = useParams();
  const bandId = params?.bandId as string;

  const {
    isMounted,
    playerRef,
    playing,
    togglePlay,
    handleProgress,
    handleDuration,
    handleSeek,
    currentTime,
    currentTimeRef,
    duration,
    startTime,
    beats,
    measureTaps,
    handleTapMeasure,
    bpm,
    applyProjection,
    adjustStartTime,
    handleClear,
    handleSave,
    isSaving,
    timeSignature,
    setTimeSignature,
    zoomLevel,
    setZoomLevel,
  } = useBeatMapper({
    songId,
    bandId,
    initialBpm,
    initialStartTime,
  });

  if (!youtubeLink)
    return (
      <EmptyState message="No hay video de YouTube configurado para esta canción." />
    );

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-2 lg:flex-row">
      {/* Left Column: Player & Timeline */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {/* Helper Info */}
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 px-4">
          <div className="text-sm text-white/70">
            <span className="font-bold text-white">Instrucciones:</span>
            <span className="hidden md:inline">
              {' '}
              Reproduce y presiona &quot;TAP&quot; (o Tecla B) en el{' '}
              <span className="text-brand-yellow-400 font-bold">
                tiempo 1
              </span>{' '}
              de cada compás.
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {bpm && (
              <div className="animate-in fade-in zoom-in flex items-center gap-2 duration-300">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[10px] uppercase text-white/50">
                    BPM
                  </span>
                  <span className="text-2xl font-bold text-brand-purple-400">
                    {bpm}{' '}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-black shadow-2xl lg:max-h-[45vh]">
          {isMounted && (
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${youtubeLink}`}
              playing={playing}
              controls={false}
              width="100%"
              height="100%"
              onProgress={handleProgress}
              onDuration={handleDuration}
              progressInterval={50}
              onEnded={() => {
                /* Consider exposing a handler if needed */
              }}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    fs: 0,
                    controls: 0,
                    disablekb: 1,
                  },
                },
              }}
            />
          )}
        </div>

        {/* Custom Timeline Controls */}
        <Card className="shrink-0 bg-content2 dark:bg-content1">
          <CardBody className="flex flex-col gap-3">
            <MetronomeControls
              playing={playing}
              onPlayPause={togglePlay}
              onTap={handleTapMeasure}
              onClear={handleClear}
              onApply={applyProjection}
              measureTapsCount={measureTaps.length}
              bpm={bpm}
              onAdjustCtx={adjustStartTime}
            />

            <TimelineVisualizer
              currentTimeRef={currentTimeRef}
              duration={duration}
              onSeek={handleSeek}
              measureTaps={measureTaps}
              beats={beats}
              startTime={startTime}
              zoomLevel={zoomLevel}
              playing={playing}
            />

            <div className="flex justify-between px-1 text-xs text-white/50">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right Column: Settings & List */}
      <div className="flex w-full flex-col gap-4 lg:w-80">
        <Card className="h-full bg-content2 dark:bg-content1">
          <CardBody>
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-bold text-white">Configuración</h3>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={handleSave}
                isLoading={isSaving}
                startContent={!isSaving && <CheckIcon className="h-4 w-4" />}
              >
                Guardar
              </Button>
            </div>

            <BeatMapperSettings
              timeSignature={timeSignature}
              setTimeSignature={setTimeSignature}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              startTime={startTime}
              onAdjustStartTime={adjustStartTime}
            />

            <div className="custom-scrollbar mt-4 flex-1 overflow-y-auto pr-2">
              {/* List Start Time explicitly */}
              {startTime > 0 && (
                <div className="mb-4 rounded border border-green-500/20 bg-green-500/10 p-2">
                  <span className="block text-xs font-bold uppercase text-green-400">
                    Inicio Canción (Grid)
                  </span>
                  <span className="font-mono text-lg text-white">
                    {startTime.toFixed(3)}s
                  </span>
                </div>
              )}

              {/* List Beats Preview */}
              <h4 className="mb-2 text-xs font-bold uppercase text-white/50">
                Grid Preview
              </h4>
              <div className="flex flex-col gap-1">
                {beats
                  .slice(0, 60)
                  .filter((b) => b.label === 1)
                  .slice(0, 15)
                  .map((beat) => (
                    <div
                      key={beat.id}
                      className="flex items-center justify-between rounded bg-brand-blue-500/20 px-3 py-2 text-xs text-brand-blue-300"
                    >
                      <div className="flex gap-2">
                        <span className="font-bold">Compas {beat.measure}</span>
                      </div>
                      <span className="font-mono opacity-50">
                        {beat.time.toFixed(3)}s
                      </span>
                    </div>
                  ))}
                {beats.length > 15 && (
                  <div className="mt-2 text-center text-xs italic text-white/30">
                    ... {beats.length - 15} beats más
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
