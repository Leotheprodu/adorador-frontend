'use client';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { Card, CardBody, Tab, Tabs, Button, Slider } from '@heroui/react';
import { PlayIcon } from '@global/icons/PlayIcon';
import { TrashIcon } from '@global/icons/TrashIcon';
import { PauseIcon } from '@global/icons/PauseIcon';
import { CheckIcon } from '@global/icons/CheckIcon';
import { useSongPlayer } from '../_hooks/useSongPlayer';
import { useTempoMapper } from '../_hooks/useTempoMapper';
import { useLyricsMapper } from '../_hooks/useLyricsMapper';
import { TimelineVisualizer } from './TimelineVisualizer';
import { MetronomeControls } from './MetronomeControls';
import { BeatMapperSettings } from './BeatMapperSettings';
import { LyricsSidebar } from './LyricsSidebar';
import { SongProps } from '@bands/[bandId]/canciones/_interfaces/songsInterface';

interface SongToolsProps {
  songData: SongProps;
  bandId: string;
}

export const SongTools = ({ songData, bandId }: SongToolsProps) => {
  const [activeMode, setActiveMode] = useState<'tempo' | 'lyrics' | 'chords'>(
    'tempo',
  );

  // 1. Shared Player State
  const {
    isMounted,
    playerRef,
    playing,
    togglePlay,
    handleProgress,
    handleDuration,
    handleSeek,
    currentTime,
    duration,
  } = useSongPlayer();

  // 2. Tempo Logic (Always instantiated to maintain state)
  const tempoTools = useTempoMapper({
    songId: songData.id.toString(),
    bandId,
    initialBpm: songData.tempo,
    initialStartTime: songData.startTime,
    currentTime,
    duration,
  });

  // 3. Lyrics Logic
  const lyricsTools = useLyricsMapper({
    songId: songData.id.toString(),
    bandId,
    initialLyrics: songData.lyrics,
    currentTime,
  });

  // Helper for empty state
  if (!songData.youtubeLink) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-content2 p-8 text-center text-white/50">
        <p>No hay video de YouTube configurado para esta canción.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-2 lg:flex-row">
      {/* LEFT COLUMN: Player & Shared Timeline */}
      <div className="custom-scrollbar flex h-[50%] min-h-0 min-w-0 flex-col gap-4 overflow-y-auto lg:h-auto lg:flex-1">
        {/* Helper/Status Bar */}
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 px-4">
          {activeMode === 'tempo' && (
            <div className="text-sm text-white/70">
              <span className="font-bold text-white">Modo Tempo:</span> Presiona{' '}
              <span className="text-brand-yellow-400 font-bold">'B'</span> en el
              tiempo 1.
            </div>
          )}
          {activeMode === 'lyrics' && (
            <div className="text-sm text-white/70">
              <span className="font-bold text-white">Modo Letras:</span>{' '}
              Presiona{' '}
              <span className="font-bold text-brand-purple-400">'L'</span> para
              asignar línea.
            </div>
          )}
          {activeMode === 'chords' && (
            <div className="text-sm text-white/70">
              Modo Acordes (Próximamente)
            </div>
          )}

          {/* BPM display always visible if set */}
          {tempoTools.bpm && (
            <div className="flex flex-col items-end leading-none">
              <span className="text-[10px] uppercase text-white/50">BPM</span>
              <span className="text-xl font-bold text-brand-purple-400">
                {tempoTools.bpm}
              </span>
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-black shadow-2xl lg:max-h-[45vh]">
          {isMounted && (
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${songData.youtubeLink}`}
              playing={playing}
              controls={false}
              width="100%"
              height="100%"
              onProgress={handleProgress}
              onDuration={handleDuration}
              progressInterval={50}
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

        {/* Controls & Visualizer */}
        <Card className="shrink-0 bg-content2 dark:bg-content1">
          <CardBody className="flex flex-col gap-3">
            {/* Render Controls based on Active Mode */}
            {activeMode === 'tempo' && (
              <MetronomeControls
                playing={playing}
                onPlayPause={togglePlay}
                onTap={tempoTools.handleTapMeasure}
                onApply={tempoTools.applyProjection}
                measureTapsCount={tempoTools.measureTaps.length}
                bpm={tempoTools.bpm}
              />
            )}
            {activeMode === 'lyrics' && (
              <div className="flex items-center gap-4">
                <Button
                  isIconOnly
                  className="h-12 w-12 rounded-full"
                  color={playing ? 'warning' : 'success'}
                  variant="shadow"
                  onPress={togglePlay}
                >
                  {playing ? (
                    <PauseIcon className="h-6 w-6 text-white" />
                  ) : (
                    <PlayIcon className="ml-1 h-6 w-6 text-white" />
                  )}
                </Button>
                <div className="flex flex-col">
                  <span className="font-bold text-white">Reproductor</span>
                  <span className="text-xs text-white/50">
                    Usa 'Espacio' para pausar.
                  </span>
                </div>

                <div className="mx-2 h-8 w-px bg-white/10" />

                <Button
                  color="secondary"
                  variant="shadow"
                  className="max-w-[200px] flex-1 animate-pulse font-bold"
                  onPress={lyricsTools.handleRecordLine}
                  startContent={
                    <div className="h-2 w-2 rounded-full bg-white" />
                  }
                >
                  GRABAR LÍNEA (L)
                </Button>
              </div>
            )}

            {/* Zoom Control (Shared) */}
            <div className="flex items-center gap-4 px-2">
              <span className="shrink-0 text-xs font-bold uppercase text-white/50">
                Zoom
              </span>
              <Slider
                size="sm"
                step={0.1}
                minValue={0.5}
                maxValue={10}
                value={tempoTools.zoomLevel}
                onChange={(v) => tempoTools.setZoomLevel(v as number)}
                aria-label="Zoom Level"
                className="max-w-xs"
                color="foreground"
              />
            </div>

            <TimelineVisualizer
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              measureTaps={tempoTools.measureTaps}
              beats={tempoTools.beats}
              startTime={
                activeMode === 'tempo'
                  ? tempoTools.startTime
                  : songData.startTime || 0
              }
              zoomLevel={tempoTools.zoomLevel}
              lyrics={lyricsTools.lyrics} // Pass lyrics for visualization
            />
          </CardBody>
        </Card>
      </div>

      {/* RIGHT COLUMN: Sidebar / Mode Selector */}
      {/* Mobile: flex-1 to fill remaining vertical space (the other ~50%). */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-hidden lg:h-full lg:w-80 lg:flex-none">
        <Tabs
          aria-label="Herramientas"
          selectedKey={activeMode}
          onSelectionChange={(key) => setActiveMode(key as any)}
          className="w-full"
          fullWidth
          size="sm"
        >
          <Tab key="tempo" title="Tempo" />
          <Tab key="lyrics" title="Letras" />
          <Tab key="chords" title="Acordes" isDisabled />
        </Tabs>

        {activeMode === 'tempo' && (
          <Card className="h-full overflow-hidden bg-content2 dark:bg-content1">
            <CardBody className="flex h-full flex-col overflow-hidden p-4">
              {/* Header similar to LyricsSidebar */}
              <div className="mb-4 flex shrink-0 items-center justify-between border-b border-white/10 pb-2">
                <div className="flex flex-col">
                  <h3 className="font-bold text-white">Tempo</h3>
                  <p className="text-white/50 text-tiny">
                    Configuración de BPM
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={tempoTools.handleClear}
                    title="Borrar compases marcados"
                    isDisabled={tempoTools.measureTaps.length === 0}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={tempoTools.handleSave}
                    isLoading={tempoTools.isSaving}
                    startContent={
                      !tempoTools.isSaving && <CheckIcon className="h-4 w-4" />
                    }
                  >
                    Guardar
                  </Button>
                </div>
              </div>

              <BeatMapperSettings
                timeSignature={tempoTools.timeSignature}
                setTimeSignature={tempoTools.setTimeSignature}
                startTime={tempoTools.startTime}
                onAdjustStartTime={tempoTools.adjustStartTime}
              />

              {/* Grid Preview List */}
              <div className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto rounded bg-black/20 p-2">
                <div className="flex justify-between border-b border-white/10 pb-1 text-xs font-bold text-white/50">
                  <span className="w-12">Compás</span>
                  <span className="text-right">Tiempo (s)</span>
                </div>
                {tempoTools.measureTaps.map((time, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded px-2 py-1 text-xs ${
                      idx % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                    }`}
                  >
                    <span className="font-bold text-brand-purple-300">
                      #{idx + 1}
                    </span>
                    <span className="font-mono text-white/70">
                      {time.toFixed(3)}s
                    </span>
                  </div>
                ))}
                {tempoTools.measureTaps.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-white/30">
                    <div className="text-2xl">🎹</div>
                    <p className="max-w-[180px] text-xs">
                      Reproduce la canción y presiona{' '}
                      <span className="text-brand-yellow-400 font-bold">
                        'B'
                      </span>{' '}
                      o{' '}
                      <span className="text-brand-yellow-400 font-bold">
                        TAP
                      </span>{' '}
                      justo en el{' '}
                      <span className="font-bold text-white">GOLPE 1</span> de
                      cada compás.
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {activeMode === 'lyrics' && (
          <LyricsSidebar
            lyrics={lyricsTools.lyrics}
            activeLineId={lyricsTools.activeLineId}
            onSave={lyricsTools.handleSave}
            isSaving={lyricsTools.isSaving}
            onClearDetail={lyricsTools.handleClearDetail}
            onClearAll={lyricsTools.handleClearAll}
            onSeek={handleSeek}
            onManualAdjust={lyricsTools.handleManualAdjust}
            isLineDirty={lyricsTools.isLineDirty}
          />
        )}
      </div>
    </div>
  );
};
