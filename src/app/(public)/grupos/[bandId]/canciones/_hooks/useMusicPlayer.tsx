import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { $PlayList, $SelectedSong } from '@stores/player';
import { formatDuration, formatProgress } from '../_utils/timeFormatters';

export const useMusicPlayer = () => {
    const playlist = useStore($PlayList);
    const selectedBeat = useStore($SelectedSong);
    const playerRef = useRef<ReactPlayer>(null);

    const [playing, setPlaying] = useState<boolean>(true);
    const [ended, setEnded] = useState<boolean>(false);
    const [progressDuration, setProgressDuration] = useState<string>('0:00');
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<string>('0:00');
    const [volume, setVolume] = useState<number>(0.5);

    const handlePlay = () => {
        setEnded(false);
        setPlaying(true);
    };

    const handleDuration = (seconds: number) => {
        setDuration(formatDuration(seconds));
    };

    const handleProgress = ({
        played,
        playedSeconds,
    }: {
        played: number;
        playedSeconds: number;
    }) => {
        setProgress(played);
        setProgressDuration(formatProgress(playedSeconds));
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

    const handleSeek = (value: number) => {
        if (!playerRef.current) return;
        playerRef.current.seekTo(value * playerRef.current.getDuration());
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

    // Auto-play next song when current ends
    useEffect(() => {
        if (ended) {
            handleNextSong();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ended]);

    // Reset state when song changes
    useEffect(() => {
        if (selectedBeat) {
            setEnded(false);
            setPlaying(true);
        }
    }, [selectedBeat]);

    return {
        // State
        playlist,
        selectedBeat,
        playing,
        progress,
        progressDuration,
        duration,
        volume,
        playerRef,

        // Handlers
        handlePlay,
        handleDuration,
        handleProgress,
        handlePlayButtonClick,
        handleSeek,
        handleNextSong,
        handlePrevSong,
        setEnded,
        setVolume,
    };
};
