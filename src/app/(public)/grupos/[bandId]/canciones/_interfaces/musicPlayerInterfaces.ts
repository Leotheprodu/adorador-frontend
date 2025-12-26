// Interfaces para el MusicPlayer y sus componentes

export interface Beat {
  id: number;
  name: string;
  youtubeLink?: string;
}

export interface PlayerProgressBarProps {
  progress: number;
  progressDuration: string;
  duration: string;
  onSeek: (value: number) => void;
}

export interface PlayerControlsProps {
  playing: boolean;
  hasSelectedBeat: boolean;
  hasMultipleSongs: boolean;
  onPlayPause: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleTools?: () => void;
  isToolsOpen?: boolean;
}

export interface PlayerVolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export interface PlayerToastProps {
  selectedBeat: Beat | null;
}
