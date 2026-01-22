'use client';

import { VIDEO_HIGHLIGHTS } from '../../_constants/videoShowcase.constants';
import { VideoHighlightItem } from './VideoHighlightItem';

export const VideoHighlights = () => {
  return (
    <div className="mt-16 grid gap-6 md:grid-cols-3">
      {VIDEO_HIGHLIGHTS.map((highlight, index) => (
        <VideoHighlightItem
          key={index}
          iconName={highlight.icon}
          title={highlight.title}
          desc={highlight.desc}
          color={highlight.color}
        />
      ))}
    </div>
  );
};
