import { ArrowLeftIcon } from '@global/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@global/icons/ArrowRightIcon';
import { ForwardIcon } from '@global/icons/ForwardIcon';
import { BackwardIcon } from '@global/icons/BackwardIcon';

interface SongNavigationButtonsProps {
  hasPreviousSong: boolean;
  hasNextSong: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMainAction: () => void;
  mainActionIcon: 'start' | 'restart';
  isEventManager: boolean;
}

export const SongNavigationButtons = ({
  hasPreviousSong,
  hasNextSong,
  onPrevious,
  onNext,
  onMainAction,
  mainActionIcon,
  isEventManager,
}: SongNavigationButtonsProps) => {
  if (!isEventManager) return null;

  const MainIcon = mainActionIcon === 'start' ? ForwardIcon : BackwardIcon;
  const mainTitle =
    mainActionIcon === 'start' ? 'Iniciar Canción' : 'Reiniciar Canción';

  return (
    <div className="flex w-full max-w-3xl items-center justify-center gap-4">
      {/* Botón anterior */}
      {hasPreviousSong && (
        <button
          onClick={onPrevious}
          className="group relative overflow-hidden rounded-xl border-2 border-brand-purple-500/30 bg-gradient-to-br from-brand-purple-500/10 to-brand-blue-500/10 px-5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-brand-purple-500/60 hover:from-brand-purple-500/20 hover:to-brand-blue-500/20 hover:shadow-lg active:scale-95"
          title="Ir a canción anterior"
          aria-label="Ir a canción anterior"
        >
          <div className="flex items-center gap-2">
            <ArrowLeftIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-sm font-semibold text-white/90 transition-colors duration-300 group-hover:text-white">
              Anterior
            </span>
          </div>
        </button>
      )}

      {/* Botón principal (redondo) */}
      <button
        onClick={onMainAction}
        className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-brand-purple-500/30 bg-gradient-to-br from-brand-purple-500/10 to-brand-blue-500/10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-brand-purple-500/60 hover:from-brand-purple-500/20 hover:to-brand-blue-500/20 hover:shadow-xl active:scale-95"
        title={mainTitle}
        aria-label={mainTitle}
      >
        <MainIcon className="h-8 w-8 text-white/90 transition-colors duration-300 group-hover:text-white" />
      </button>

      {/* Botón siguiente */}
      {hasNextSong && (
        <button
          onClick={onNext}
          className="group relative overflow-hidden rounded-xl border-2 border-brand-purple-500/30 bg-gradient-to-br from-brand-purple-500/10 to-brand-blue-500/10 px-5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-brand-purple-500/60 hover:from-brand-purple-500/20 hover:to-brand-blue-500/20 hover:shadow-lg active:scale-95"
          title="Ir a canción siguiente"
          aria-label="Ir a canción siguiente"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/90 transition-colors duration-300 group-hover:text-white">
              Siguiente
            </span>
            <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </button>
      )}
    </div>
  );
};
