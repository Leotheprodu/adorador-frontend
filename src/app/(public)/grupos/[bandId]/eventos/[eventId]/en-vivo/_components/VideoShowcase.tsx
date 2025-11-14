import { initialVideo, videoBackgroundIds } from '@global/config/constants';
import { useStore } from '@nanostores/react';
import { $eventConfig, $selectedSongData } from '@stores/event';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export const VideoShowcase = ({
  props,
}: {
  props: { type: 'eventIntro' | 'eventBackground' };
}) => {
  const { type } = props;

  const [video, setVideo] = useState(
    () => initialVideo[Math.floor(Math.random() * initialVideo.length)],
  );
  const eventConfig = useStore($eventConfig);
  const selectedSongData = useStore($selectedSongData);
  const songType = selectedSongData?.song.songType;
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  useEffect(() => {
    setPlaying(false);
    if (eventConfig.isProjectorMode && eventConfig.showGreetingScreen) {
      setVideo(initialVideo[Math.floor(Math.random() * initialVideo.length)]);
      setPlaying(true);
    } else if (eventConfig.isProjectorMode && !eventConfig.showGreetingScreen) {
      const backgroundVideos = videoBackgroundIds[songType || 'worship'];
      setVideo(
        backgroundVideos[Math.floor(Math.random() * backgroundVideos.length)],
      );
      setPlaying(true);
    }
  }, [eventConfig, songType, selectedSongData?.song.id]);
  return (
    <div
      className={`pointer-events-none absolute h-full w-full ${type === 'eventIntro' ? 'scale-125' : 'scale-150'} ${eventConfig.showGreetingScreen ? 'opacity-100' : 'opacity-30'}`}
    >
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${video}?modestbranding=1&rel=0`}
        ref={playerRef}
        playing={playing}
        width="100%"
        height="100%"
        loop={true}
        volume={0}
        muted={true}
        controls={false}
        fullscreen={true}
        /* onPlay={handlePlay}
            onPause={handlePause} */
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
      />
    </div>
  );
};
