'use client';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Card, CardBody, Tab, Tabs, Button, Slider } from '@heroui/react';
import { PlayIcon } from '@global/icons/PlayIcon';
import { TrashIcon } from '@global/icons/TrashIcon';
import { PauseIcon } from '@global/icons/PauseIcon';
import { CheckIcon } from '@global/icons/CheckIcon';
import { useSongPlayer } from '../_hooks/useSongPlayer';
import { useTempoMapper } from '../_hooks/useTempoMapper';
import { useLyricsMapper } from '../_hooks/useLyricsMapper';
import { useChordsMapper } from '../_hooks/useChordsMapper';
import { TimelineVisualizer } from './TimelineVisualizer';
import { MetronomeControls } from './MetronomeControls';
import { BeatMapperSettings } from './BeatMapperSettings';
import { LyricsSidebar } from './LyricsSidebar';
import { ChordsSidebar } from './ChordsSidebar';
import { SongToolsData } from '../_services/getSongService';

interface SongToolsProps {
  songData: SongToolsData;
  bandId: string;
}

export const SongTools = ({ songData, bandId }: SongToolsProps) => {
  const [activeMode, setActiveMode] = useState<'tempo' | 'lyrics' | 'chords'>(
    'tempo',
  );
  const [audioOnly, setAudioOnly] = useState(false);

  // 1. Shared Player State
  const {
    isMounted,
    playerRef,
    playing,
    togglePlay,
    handleProgress,
    handleDuration,
    handleSeek,
    currentTimeRef, // Use Ref
    duration,
  } = useSongPlayer();

  // 2. Tempo Logic (Always instantiated to maintain state)
  const tempoTools = useTempoMapper({
    songId: songData.id.toString(),
    bandId,
    initialBpm: songData.tempo,
    initialStartTime: songData.startTime,
    currentTimeRef,
    duration,
  });

  // 3. Lyrics Logic
  const lyricsTools = useLyricsMapper({
    songId: songData.id.toString(),
    bandId,
    initialLyrics: songData.lyrics,
    currentTimeRef,
  });

  // 4. Chords Logic
  const chordsTools = useChordsMapper({
    songId: songData.id.toString(),
    bandId,
    initialLyrics: songData.lyrics,
    currentTimeRef,
    beats: tempoTools.beats,
    bpm: tempoTools.bpm,
    onSeek: handleSeek,
  });

  // 5. Global Keyboard Shortcuts (Space to Play/Pause)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        togglePlay();
      }

      // Seek Measure (Arrow Left/Right)
      if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        e.preventDefault();
        const bpm = tempoTools.bpm || 120; // Default to 120 if not set
        const beatsPerMeasure = 4; // Assume 4/4 for simple nav, or use timeSignature if available
        const secondsPerBeat = 60 / bpm;
        const jumpSeconds = secondsPerBeat * beatsPerMeasure;

        const direction = e.code === 'ArrowRight' ? 1 : -1;
        // Use Ref for current time base
        handleSeek(currentTimeRef.current + jumpSeconds * direction);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [togglePlay, currentTimeRef, handleSeek, tempoTools.bpm]); // Depend on Ref object (stable)

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
              <span className="text-brand-yellow-400 font-bold">
                &apos;B&apos;
              </span>{' '}
              en el tiempo 1.
            </div>
          )}
          {activeMode === 'lyrics' && (
            <div className="text-sm text-white/70">
              <span className="font-bold text-white">Modo Letras:</span>{' '}
              Presiona{' '}
              <span className="font-bold text-brand-purple-400">
                &apos;L&apos;
              </span>{' '}
              para asignar línea.
            </div>
          )}
          {activeMode === 'chords' && (
            <div className="text-sm text-white/70">
              <span className="font-bold text-white">Modo Acordes:</span>{' '}
              Presiona{' '}
              <span className="font-bold text-brand-purple-400">
                &apos;A&apos;
              </span>{' '}
              para asignar acorde.
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
        <div
          className={`relative w-full shrink-0 overflow-hidden rounded-xl bg-black shadow-2xl transition-all duration-500 ease-in-out ${audioOnly ? 'h-0 opacity-0' : 'aspect-video lg:max-h-[45vh]'}`}
        >
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

        {/* Toggle Audio Only Button (Small, discrete) */}
        <div className="flex justify-end px-1">
          <button
            onClick={() => setAudioOnly(!audioOnly)}
            className="flex items-center gap-1 text-[10px] font-bold uppercase text-white/30 transition-colors hover:text-white"
          >
            {audioOnly ? '📺 Mostrar Video' : '📻 Modo Solo Audio (Más Rápido)'}
          </button>
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
                    Usa &apos;Espacio&apos; para pausar.
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

            {activeMode === 'chords' && (
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
                    Usa &apos;Espacio&apos; para pausar.
                  </span>
                </div>

                <div className="mx-2 h-8 w-px bg-white/10" />

                <Button
                  color="secondary"
                  variant="shadow"
                  className="max-w-[200px] flex-1 animate-pulse font-bold"
                  onPress={chordsTools.handleRecordChord}
                  startContent={
                    <div className="h-2 w-2 rounded-full bg-white" />
                  }
                >
                  GRABAR ACORDE (A)
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
              currentTimeRef={currentTimeRef}
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
              // Strict visibility based on user request:
              // - Tempo: Hide Lyrics AND Chords (implied by activeMode logic below)
              // - Lyrics: Hide Chords
              // - Chords: Hide Lyrics
              lyrics={activeMode === 'lyrics' ? lyricsTools.lyrics : []}
              chords={activeMode === 'chords' ? chordsTools.chords : []}
              playing={playing}
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
          onSelectionChange={(key) =>
            setActiveMode(key as 'tempo' | 'lyrics' | 'chords')
          }
          className="w-full"
          fullWidth
          size="sm"
        >
          <Tab key="tempo" title="Tempo" />
          <Tab key="lyrics" title="Letras" />
          <Tab key="chords" title="Acordes" />
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
                zoomLevel={tempoTools.zoomLevel}
                setZoomLevel={tempoTools.setZoomLevel}
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
                        &apos;B&apos;
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
            currentTimeRef={currentTimeRef}
            playing={playing}
          />
        )}

        {activeMode === 'chords' && (
          <ChordsSidebar
            chords={chordsTools.chords}
            lyrics={lyricsTools.lyrics}
            activeChordId={chordsTools.activeChordId}
            onSave={chordsTools.handleSave}
            isSaving={chordsTools.isSaving}
            onClearDetail={chordsTools.handleClearDetail}
            onClearAll={chordsTools.handleClearAll}
            onSeek={handleSeek}
            onManualAdjust={chordsTools.handleManualAdjust}
            isChordDirty={chordsTools.isChordDirty}
            adjustmentUnit={chordsTools.adjustmentUnit}
            quantizationMode={chordsTools.quantizationMode}
            setQuantizationMode={chordsTools.setQuantizationMode}
          />
        )}
      </div>
    </div>
  );
};
