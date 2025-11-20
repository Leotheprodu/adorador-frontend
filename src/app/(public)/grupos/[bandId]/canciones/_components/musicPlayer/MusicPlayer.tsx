/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player';
import { Button } from '@nextui-org/react';
import { $PlayList, $SelectedSong } from '@stores/player';
import { PlayIcon } from '@global/icons/PlayIcon';
import { PauseIcon } from '@global/icons/PauseIcon';
import { ForwardIcon } from '@global/icons/ForwardIcon';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';
import { getYouTubeThumbnail } from '@global/utils/formUtils';

export const MusicPlayer = () => {
  const playlist = useStore($PlayList);
  const selectedBeat = useStore($SelectedSong);
  const [playing, setPlaying] = useState<boolean>(true);
  const [ended, setEnded] = useState<boolean>(false);
  const [progressDuration, setprogressDuration] = useState<string>('0:00');
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<string>('0:00');
  const playerRef = useRef(null);
  const [volume, setVolume] = useState<number>(0.5);
  const handlePlay = () => {
    setEnded(false);
    setPlaying(true);
  };
  const handleDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60) - 1;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    setDuration(`${minutes}:${formattedSeconds}`);
  };
  const handleProgress = ({
    played,
    playedSeconds,
  }: {
    played: number;
    playedSeconds: number;
  }) => {
    setProgress(played);
    let minutes = 0;
    const remainingSeconds = Math.ceil(playedSeconds % 60) % 60;
    if (playedSeconds < 59 && minutes === 0) {
      minutes = Math.floor(playedSeconds / 60);
    } else if (remainingSeconds === 0 && minutes === 0 && playedSeconds > 0) {
      minutes = Math.floor(playedSeconds / 60) + 1;
    } else if (remainingSeconds === 0 && playedSeconds >= 60) {
      minutes = Math.floor(playedSeconds / 60) + 1;
    } else {
      minutes = Math.floor(playedSeconds / 60);
    }

    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    setprogressDuration(`${minutes}:${formattedSeconds}`);
  };
  const handlePlayButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedBeat) {
      if (playlist[0]) $SelectedSong.set(playlist[0]);
    }
    if (playing) {
      setPlaying(false);
    } else {
      setPlaying(true);
    }
    setEnded(false);
  };

  const handleonChangeRange = (e: any) => {
    if (!playerRef.current) return;

    (playerRef.current as ReactPlayer).seekTo(
      e.target.value * (playerRef.current as ReactPlayer).getDuration(),
    );
  };
  const handleNextSong = () => {
    if (!selectedBeat) {
      $SelectedSong.set(playlist[0]);
      setPlaying(true);
      setEnded(false);
    } else {
      const currentIndex = playlist.findIndex(
        (beat) => beat.id === selectedBeat.id,
      );
      setPlaying(true);
      setEnded(false);

      if (currentIndex === playlist.length - 1) {
        $SelectedSong.set(playlist[0]);
      } else {
        $SelectedSong.set(playlist[currentIndex + 1]);
      }
    }
  };
  useEffect(() => {
    if (ended) {
      handleNextSong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ended]);

  useEffect(() => {
    if (selectedBeat) {
      setEnded(false);
      setPlaying(true);
    }
  }, [selectedBeat]);

  useEffect(() => {
    if (selectedBeat) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } group pointer-events-auto relative mt-[3rem] flex flex-col rounded-lg bg-primario p-2 shadow-lg ring-1 ring-black ring-opacity-5`}
          >
            <button
              onClick={() => toast.remove('beat-toast')}
              className="invisible absolute right-2 top-2 m-0 flex h-4 w-4 items-center justify-center rounded-full bg-white p-1 text-center duration-200 group-hover:visible"
            >
              <DeleteMusicIcon className="text-danger-500" />
            </button>
            <div className="flex flex-col justify-center">
              <img
                src={getYouTubeThumbnail(
                  selectedBeat?.youtubeLink,
                  'mqdefault',
                )}
                alt={`imagen de ${selectedBeat.name}`}
                className="h-[5rem] w-full rounded-xl object-cover"
              />
              <div className="flex flex-col items-baseline gap-1 py-1">
                <h3 className="font-semibold text-secundario/80">
                  {selectedBeat.name}
                </h3>
              </div>
            </div>
          </div>
        ),
        { id: 'beat-toast', duration: 5000, position: 'top-right' },
      );
    }

    return () => {
      toast.remove('beat-toast');
    };
  }, [selectedBeat]);
  const handlePrevSong = () => {
    if (!selectedBeat) {
      $SelectedSong.set(playlist[0]);

      setPlaying(true);
      setEnded(false);
    } else {
      const currentIndex = playlist.findIndex(
        (beat) => beat.id === selectedBeat.id,
      );
      setPlaying(true);
      setEnded(false);

      if (currentIndex === 0) {
        $SelectedSong.set(playlist[playlist.length - 1]);
      } else {
        $SelectedSong.set(playlist[currentIndex - 1]);
      }
    }
  };

  return (
    <>
      {selectedBeat && (
        <section className="sticky bottom-0 z-[999] flex h-[4rem] w-full items-center justify-center bg-negro [grid-area:musicPlayer]">
          <div className="peer absolute z-30 flex w-full overflow-hidden duration-200 top-[-2rem] h-[2rem]">
            <div
              className="absolute left-0 z-40 h-[2rem] bg-brand-blue-700 duration-1000 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute left-0 z-30 h-[2rem] bg-brand-purple-700"
              style={{ width: `${100}%` }}
            />
            <p className="absolute top-[.2rem] z-50 ml-4 flex text-white">
              {progressDuration}
            </p>
            <p className="absolute right-0 top-[.2rem] z-50 mr-4 flex text-white">
              {duration}
            </p>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={progress}
              onChange={handleonChangeRange}
              className="absolute z-50 h-[4rem] w-full cursor-pointer opacity-0"
            />
          </div>

          {/* <div
            className="pointer-events-none absolute top-[-.4rem] z-30 h-[.7rem] w-[.7rem] rounded-full bg-primary-200 opacity-100 peer-hover:opacity-0"
            style={{
              left: `${progress * 100 - 0.3}%`,
              transition: 'left 1s linear',
            }}
          /> */}

          <div className="absolute flex h-[4rem] w-full items-center justify-center overflow-hidden">
            <div className="pointer-events-none absolute z-10 h-screen w-screen blur-3xl">
              <ReactPlayer
                className="scale-x-150 opacity-10"
                width="100%"
                height="100%"
                url={`https://www.youtube.com/watch?v=${selectedBeat?.youtubeLink}`}
                config={{
                  youtube: {
                    playerVars: {
                      fs: 1,
                      controls: 0,
                      modestbranding: 1,
                      autoplay: true,
                    },
                  },
                }}
                ref={playerRef}
                playing={playing}
                onPlay={handlePlay}
                onEnded={() => setEnded(true)}
                onDuration={handleDuration}
                onProgress={handleProgress}
                volume={volume}
              />
            </div>
          </div>
          <div className="z-20 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-5">
              {playlist.length > 1 && (
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full p-1 opacity-75 duration-75 ease-in-out hover:opacity-100 active:scale-90"
                  onClick={handlePrevSong}
                >
                  <BackwardIcon className="text-primary-200" />
                </button>
              )}
              <Button
                type="button"
                radius="full"
                className="m-0 flex h-10 w-10 min-w-0 items-center justify-center bg-primario p-0 opacity-75 duration-75 ease-in-out hover:opacity-100"
                onClick={handlePlayButtonClick}
              >
                {playing && selectedBeat && (
                  <PauseIcon className="scale-125 text-primary-500" />
                )}
                {(!playing || !selectedBeat) && (
                  <PlayIcon className="scale-125 text-primary-500" />
                )}
              </Button>
              {playlist.length > 1 && (
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full p-1 opacity-75 duration-75 ease-in-out hover:opacity-100 active:scale-90"
                  onClick={handleNextSong}
                >
                  <ForwardIcon className="text-primary-200" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-center gap-1">
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume !== null ? volume : 0.5}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="MusicPlayer-volumen opacity-75 duration-75 hover:opacity-100"
              />
            </div>
            {selectedBeat && (
              <div className="absolute bottom-1/2 left-2 flex translate-y-1/2 transform flex-col gap-1">
                <p className="text-sm text-terciario opacity-60 duration-100 hover:opacity-100">
                  {selectedBeat.name}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};
