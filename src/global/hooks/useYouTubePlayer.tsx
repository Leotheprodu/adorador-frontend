import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import {
    $activeYouTubePlayer,
    setActivePlayer,
    pauseActivePlayer,
} from '@global/stores/youtubePlayer';
import { extractYouTubeId, getYouTubeThumbnail } from '@global/utils/formUtils';

interface UseYouTubePlayerProps {
    youtubeUrl: string;
    uniqueId: string;
}

export const useYouTubePlayer = ({
    youtubeUrl,
    uniqueId,
}: UseYouTubePlayerProps) => {
    const activePlayer = useStore($activeYouTubePlayer);
    const playerRef = useRef<ReactPlayer>(null);
    const [showPlayer, setShowPlayer] = useState(false);

    // Extraer el ID de YouTube
    const youtubeId = extractYouTubeId(youtubeUrl);
    const thumbnail = getYouTubeThumbnail(youtubeUrl);

    const isActive = activePlayer?.id === uniqueId;
    const isPlaying = isActive && activePlayer?.isPlaying;

    // Efecto para manejar cuando otro reproductor toma el control
    useEffect(() => {
        if (showPlayer && !isActive) {
            // Otro reproductor está activo, pausar este
            setShowPlayer(false);
        }
    }, [activePlayer, isActive, showPlayer]);

    const handlePlayPause = () => {
        if (!showPlayer) {
            // Mostrar el reproductor y activarlo
            setShowPlayer(true);
            setActivePlayer({
                id: uniqueId,
                youtubeId: youtubeId || '',
                isPlaying: true,
            });
        } else if (isPlaying) {
            // Pausar
            pauseActivePlayer();
        } else {
            // Reanudar
            setActivePlayer({
                id: uniqueId,
                youtubeId: youtubeId || '',
                isPlaying: true,
            });
        }
    };

    const handlePlay = () => {
        // Asegurarse de que este sea el reproductor activo
        if (!isActive) {
            setActivePlayer({
                id: uniqueId,
                youtubeId: youtubeId || '',
                isPlaying: true,
            });
        }
    };

    const handlePause = () => {
        pauseActivePlayer();
    };

    return {
        playerRef,
        showPlayer,
        youtubeId,
        thumbnail,
        isPlaying,
        handlePlayPause,
        handlePlay,
        handlePause,
    };
};
