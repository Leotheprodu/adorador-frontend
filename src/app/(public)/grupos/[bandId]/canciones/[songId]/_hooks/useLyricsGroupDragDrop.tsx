import { useState, useEffect } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { updateLyricsPositionsService } from '../_services/songIdServices';
import toast from 'react-hot-toast';
import { LyricsPositionUpdate } from '../_interfaces/lyricsInterfaces';

interface UseLyricsGroupDragDropProps {
    lyrics: LyricsProps[];
    params: { bandId: string; songId: string };
    refetchLyricsOfCurrentSong: () => void;
}

export const useLyricsGroupDragDrop = ({
    lyrics,
    params,
    refetchLyricsOfCurrentSong,
}: UseLyricsGroupDragDropProps) => {
    const [lyricsOrder, setLyricsOrder] = useState<LyricsProps[]>([]);

    const {
        mutate: mutateUpdateLyricsPositions,
        status: statusUpdateLyricsPositions,
    } = updateLyricsPositionsService({ params });

    useEffect(() => {
        setLyricsOrder([...lyrics].sort((a, b) => a.position - b.position));
    }, [lyrics]);

    useEffect(() => {
        if (statusUpdateLyricsPositions === 'success') {
            toast.success('Orden actualizado');
            refetchLyricsOfCurrentSong();
        }
    }, [statusUpdateLyricsPositions, refetchLyricsOfCurrentSong]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updatedLyrics = [...lyricsOrder];
        const [removed] = updatedLyrics.splice(result.source.index, 1);
        updatedLyrics.splice(result.destination.index, 0, removed);

        // Encontrar la posición base (la menor posición en este grupo)
        const basePosition = Math.min(...lyricsOrder.map((l) => l.position));

        // Actualizar las posiciones manteniendo el orden relativo al grupo
        const reorderedLyrics = updatedLyrics.map((lyric, index) => ({
            ...lyric,
            position: basePosition + index,
        }));

        setLyricsOrder(reorderedLyrics);

        // Enviar solo las letras que cambiaron de posición
        const newPositions: LyricsPositionUpdate[] = reorderedLyrics
            .filter((lyric, index) => {
                const originalLyric = lyricsOrder[index];
                return originalLyric.id !== lyric.id; // Cambió de posición
            })
            .map((lyric) => ({
                id: lyric.id,
                position: lyric.position,
            }));

        if (newPositions.length > 0) {
            mutateUpdateLyricsPositions(newPositions);
        }
    };

    return {
        lyricsOrder,
        handleDragEnd,
    };
};
