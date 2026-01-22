'use client';

import { VIDEO_CHAPTERS } from '../../_constants/videoShowcase.constants';
import { VideoChapterItem } from './VideoChapterItem';

import { VideoChaptersListProps } from '../../_interfaces/videoShowcase.interfaces';

export const VideoChaptersList = ({
  currentChapterId,
  onChapterClick,
}: VideoChaptersListProps) => {
  return (
    <div className="custom-scrollbar max-h-[600px] overflow-y-auto pr-2 lg:col-span-5 xl:col-span-4">
      <div className="space-y-3">
        {VIDEO_CHAPTERS.map((chapter) => (
          <VideoChapterItem
            key={chapter.id}
            {...chapter}
            isActive={currentChapterId === chapter.id}
            onClick={onChapterClick}
          />
        ))}
      </div>
    </div>
  );
};
