import { motion } from 'framer-motion';
import { useEffect, useRef, memo } from 'react';
import ReactPlayer from 'react-player';
import { XMarkIcon } from '@global/icons/XMarkIcon';
import { MetronomeIcon, MicrophoneIcon } from '@global/icons';
import { useStore } from '@nanostores/react';
import { getNoteByType } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/getNoteByType';
import {
  $ActiveChord,
  $SongChords,
  $SongLyrics,
  $ActiveLyricId,
  SongChordContext,
  SongLyricContext,
} from '@/stores/activeChord';
import { $SelectedSong } from '@global/stores/player';
import { getSongLyrics } from '@bands/[bandId]/canciones/[songId]/_services/songIdServices';
import { $chordPreferences } from '@stores/event';
import { structureLib } from '@global/config/constants';

interface FloatingPlayerToolsProps {
  tempo: number;
  startTime: number;
  playerRef: React.RefObject<ReactPlayer>;
  playing: boolean;
  onClose: () => void;
  tonality?: string;
  showMetronome: boolean;
  showLyrics: boolean;
}

export const FloatingPlayerTools = memo(
  ({
    tempo,
    startTime,
    playerRef,
    playing,
    onClose,
    tonality,
    showMetronome,
    showLyrics,
  }: FloatingPlayerToolsProps) => {
    const selectedSong = useStore($SelectedSong);
    const preferences = useStore($chordPreferences);

    // Use Refs for direct DOM manipulation
    const viewportRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const lyricsDisplayRef = useRef<HTMLDivElement>(null);
    const chordsRef = useRef<readonly SongChordContext[]>([]);
    const lyricsRef = useRef<readonly SongLyricContext[]>([]);
    const lastLyricId = useRef<number | null>(null);

    // Subscribe to song chords and lyrics stores
    useEffect(() => {
      const unsubChords = $SongChords.subscribe((chords) => {
        chordsRef.current = chords;
      });
      const unsubLyrics = $SongLyrics.subscribe((lyrics) => {
        lyricsRef.current = lyrics;
      });
      return () => {
        unsubChords();
        unsubLyrics();
      };
    }, []);

    // Lazy Data Fetching with Hook
    const shouldFetch =
      !!selectedSong?.id &&
      !!selectedSong?.bandId &&
      (showMetronome || showLyrics);

    // Check if we already have data to avoid re-fetching if not needed (optional optimization,
    // but React Query handles caching. We mostly care about 'enabled' to prevent fetch on mount if closed)

    const { data: lyricsData } = getSongLyrics({
      params: {
        bandId: selectedSong?.bandId ?? '',
        songId: selectedSong?.id?.toString() ?? '',
      },
      isEnabled: shouldFetch,
    });

    // Populate stores when data is available
    useEffect(() => {
      if (lyricsData) {
        // Populate Chords
        const flattenedChords = lyricsData.flatMap((l) =>
          l.chords.map((c) => ({
            ...c,
            startTime: c.startTime ?? l.startTime, // fallback
          })),
        );

        $SongChords.set(flattenedChords);

        // Populate Lyrics
        const formattedLyrics = lyricsData.map((l) => ({
          id: l.id,
          lyrics: l.lyrics,
          startTime: l.startTime,
          structureTitle:
            l.structure?.title &&
            structureLib[l.structure.title as keyof typeof structureLib]?.es
              ? structureLib[l.structure.title as keyof typeof structureLib].es
              : l.structure?.title,
        }));
        $SongLyrics.set(formattedLyrics);
      }
    }, [lyricsData]);

    // Metronome & Lyrics Logic
    useEffect(() => {
      if (!playing) {
        if (timelineRef.current) timelineRef.current.innerHTML = '';
        if (lyricsDisplayRef.current) lyricsDisplayRef.current.innerHTML = '';
        return;
      }

      let animationFrameId: number;
      const secondsPerBeat = 60 / (tempo || 120);
      const slotWidth = 48;
      const windowSize = 8;

      // Pre-create slots for Metronome
      if (
        showMetronome &&
        timelineRef.current &&
        timelineRef.current.children.length === 0
      ) {
        for (let i = 0; i < windowSize + 2; i++) {
          const div = document.createElement('div');
          div.className =
            'absolute top-0 flex items-center justify-center transition-all duration-75';
          div.style.width = `${slotWidth}px`;
          div.style.height = '100%';
          div.innerHTML = '<div class="slot-content"></div>';
          timelineRef.current.appendChild(div);
        }
      }

      const loop = () => {
        const currentTime = playerRef.current?.getCurrentTime() || 0;

        // 1. Update Metronome if visible
        if (showMetronome && timelineRef.current && tempo > 0) {
          const relativeTime = currentTime - startTime;
          const currentFractionalBeat = relativeTime / secondsPerBeat;
          const currentIntBeat = Math.floor(currentFractionalBeat);
          const startBeat = currentIntBeat - 4;
          const children = timelineRef.current.children;

          for (let i = 0; i < children.length; i++) {
            const b = startBeat + i;
            const slot = children[i] as HTMLDivElement;
            const contentDiv = slot.querySelector(
              '.slot-content',
            ) as HTMLDivElement;
            if (!contentDiv) continue;

            const beatStartTime = b * secondsPerBeat + startTime;
            const chordAtBeat = chordsRef.current.find(
              (c) =>
                Math.abs(c.startTime - beatStartTime) < secondsPerBeat * 0.4,
            );

            const isCenter = b === currentIntBeat;
            const beatPhase = currentFractionalBeat % 1;
            const isPulse = isCenter && beatPhase < 0.2;
            const beatInMeasure = (((b % 4) + 4) % 4) + 1;
            const isFirstBeat = beatInMeasure === 1;

            let newContent = '';
            if (chordAtBeat) {
              const root = getNoteByType(
                chordAtBeat.rootNote,
                $ActiveChord.get()?.transpose ?? 0,
                preferences,
              );
              const slash = chordAtBeat.slashChord
                ? getNoteByType(
                    chordAtBeat.slashChord,
                    $ActiveChord.get()?.transpose ?? 0,
                    preferences,
                  )
                : null;
              newContent = `
                  <div class="flex items-baseline justify-center font-bold text-brand-purple-400 leading-none">
                      <span class="text-base">${root}${chordAtBeat.chordQuality || ''}</span>
                      ${slash ? `<span class="text-[10px] opacity-70 ml-0.5">/${slash}</span>` : ''}
                  </div>`;
            } else {
              newContent = `<div class="h-1.5 w-1.5 rounded-full ${isPulse ? 'bg-brand-purple-400 scale-[2]' : isFirstBeat ? 'bg-white/40' : 'bg-white/10'}"></div>`;
            }

            if (contentDiv.innerHTML !== newContent)
              contentDiv.innerHTML = newContent;
            slot.style.left = `${(b - startBeat) * slotWidth}px`;
            slot.style.opacity = isCenter ? '1' : '0.4';
            slot.style.transform = `scale(${isPulse ? 1.4 : 1})`;
          }

          const offset = -(currentFractionalBeat % 1) * slotWidth;
          const centerShift = 192 - 4 * slotWidth;
          timelineRef.current.style.transform = `translateX(${centerShift + offset}px)`;
        }

        // 2. Update Lyrics if visible
        if (showLyrics && lyricsDisplayRef.current) {
          const currentLyric = lyricsRef.current.findLast(
            (l) => l.startTime <= currentTime,
          );
          if (currentLyric && currentLyric.id !== lastLyricId.current) {
            lastLyricId.current = currentLyric.id;
            $ActiveLyricId.set(currentLyric.id);
            lyricsDisplayRef.current.innerHTML = `
                <div class="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span class="text-[9px] uppercase tracking-widest text-brand-purple-400 font-bold mb-1">${currentLyric.structureTitle || ''}</span>
                  <p class="text-sm font-medium text-white text-center line-clamp-2 leading-tight">${currentLyric.lyrics}</p>
                </div>
              `;
          } else if (!currentLyric && lastLyricId.current !== null) {
            lyricsDisplayRef.current.innerHTML = '';
            lastLyricId.current = null;
          }
        }

        animationFrameId = requestAnimationFrame(loop);
      };

      loop();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [
      tempo,
      startTime,
      playerRef,
      playing,
      preferences,
      showMetronome,
      showLyrics,
    ]);

    return (
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9, y: 0, x: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute bottom-24 right-4 z-[1000] flex w-[24rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl"
      >
        {/* Header / Drag Handle */}
        <div className="flex cursor-move items-center justify-between bg-white/5 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            {showMetronome ? (
              <MetronomeIcon className="h-3.5 w-3.5" />
            ) : (
              <MicrophoneIcon className="h-3.5 w-3.5 text-brand-purple-400" />
            )}
            <span>
              {showMetronome ? 'Metrónomo inteligente' : 'Letra en vivo'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex min-h-[5rem] flex-col items-center justify-center p-4">
          {showMetronome && (
            <div
              ref={viewportRef}
              className="relative mb-2 h-14 w-full overflow-hidden rounded-xl bg-white/5"
            >
              {/* Sliding Container */}
              <div
                ref={timelineRef}
                className="absolute top-0 flex h-full will-change-transform"
              >
                {/* Slots will be injected here */}
              </div>
            </div>
          )}

          {showLyrics && (
            <div
              ref={lyricsDisplayRef}
              className={`flex w-full items-center justify-center ${showMetronome ? 'mt-4 border-t border-white/5 pt-4' : ''}`}
            >
              {/* Lyrics will be injected here */}
            </div>
          )}

          {/* Bottom Info */}
          <div className="mt-3 flex w-full items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-brand-purple-500"></span>
                <span>{tempo} BPM</span>
              </div>
              {tonality && (
                <div className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-brand-purple-500"></span>
                  <span>
                    escala:{' '}
                    {getNoteByType(
                      tonality,
                      $ActiveChord.get()?.transpose ?? 0,
                      preferences,
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

FloatingPlayerTools.displayName = 'FloatingPlayerTools';
