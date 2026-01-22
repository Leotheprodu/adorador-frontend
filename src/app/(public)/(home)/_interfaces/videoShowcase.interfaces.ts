export type HighlightColor = 'blue' | 'indigo' | 'purple';

export interface VideoHighlightItemProps {
  iconName: string;
  title: string;
  desc: string;
  color: string;
}

export interface VideoChapterItemProps {
  id: number;
  label: string;
  timestamp: string;
  seconds: number;
  desc: string;
  isActive: boolean;
  onClick: (seconds: number, id: number) => void;
}

export interface VideoChaptersListProps {
  currentChapterId: number;
  onChapterClick: (seconds: number, id: number) => void;
}
