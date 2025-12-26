import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { XMarkIcon } from '@global/icons/XMarkIcon';
import { MetronomeIcon } from '@global/icons';

interface FloatingPlayerToolsProps {
  tempo: number;
  startTime: number;
  currentTime: number;
  onClose: () => void;
}

export const FloatingPlayerTools = ({
  tempo,
  startTime,
  currentTime,
  onClose,
}: FloatingPlayerToolsProps) => {
  const [isBeat, setIsBeat] = useState(false);
  const [beatNumber, setBeatNumber] = useState(0);

  // Metronome Logic
  useEffect(() => {
    if (!tempo || tempo <= 0) return;

    const secondsPerBeat = 60 / tempo;
    const relativeTime = currentTime - startTime;

    if (relativeTime < 0) {
      setIsBeat(false);
      return;
    }

    const totalBeats = Math.floor(relativeTime / secondsPerBeat);
    const currentBeatInMeasure = (totalBeats % 4) + 1;

    // Phase within the current beat (0.0 to 1.0)
    const beatPhase = (relativeTime % secondsPerBeat) / secondsPerBeat;

    // Flash for first 15% of the beat
    const isFlash = beatPhase < 0.15;

    if (isFlash !== isBeat) {
      setIsBeat(isFlash);
      if (isFlash) {
        setBeatNumber(currentBeatInMeasure);
      }
    }
  }, [currentTime, tempo, startTime, isBeat]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, y: 0, x: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bottom-24 right-4 z-[1000] flex w-48 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-xl"
    >
      {/* Header / Drag Handle */}
      <div className="flex cursor-move items-center justify-between bg-white/5 px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
          <MetronomeIcon className="h-3.5 w-3.5" />
          <span>Herramientas</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <XMarkIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center p-4">
        {/* Metronome Visual */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] uppercase text-white/50">Tempo</span>
            <span className="font-mono text-xl font-bold text-white">
              {tempo}
            </span>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-75 ${
              isBeat
                ? 'scale-110 bg-brand-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                : 'bg-white/10'
            }`}
          >
            <span
              className={`text-xl font-bold ${
                isBeat ? 'text-white' : 'text-white/50'
              }`}
            >
              {beatNumber || '-'}
            </span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-white/30">Metrónomo Visual</div>
      </div>
    </motion.div>
  );
};
