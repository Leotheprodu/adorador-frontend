'use client';

import { useState, useEffect } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { addSongsToBandService } from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { handleOnChange } from '@global/utils/formUtils';

export const useAddSongButton = (bandId: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const formInit: SongPropsWithoutId = {
        title: '',
        artist: '',
        songType: 'worship',
        youtubeLink: '',
        key: '',
        tempo: 0,
    };
    const [form, setForm] = useState<SongPropsWithoutId>(formInit);

    const {
        data: newSong,
        mutate: mutateAddSongToChurch,
        status: statusAddSongToChurch,
    } = addSongsToBandService({ bandId });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleOnChange(setForm, e);
    };

    const handleAddSong = () => {
        if (form.title === '') {
            toast.error('El título de la canción es obligatorio');
            return;
        }
        mutateAddSongToChurch(form);
    };

    const handleClear = () => {
        setForm(formInit);
    };

    useEffect(() => {
        if (statusAddSongToChurch === 'success') {
            // Invalidar queries para que se actualicen las listas de canciones
            queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
            queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
            // Invalidar la lista de grupos del usuario (donde se muestra el contador de canciones)
            queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
            // Redirigir a la nueva canción
            router.push(`/grupos/${bandId}/canciones/${newSong?.id}`);
        }
        if (statusAddSongToChurch === 'error') {
            toast.error('Error al crear la canción');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusAddSongToChurch, bandId, queryClient, router, newSong]);

    return {
        isOpen,
        onOpen,
        onOpenChange,
        onClose,
        form,
        setForm,
        handleChange,
        handleAddSong,
        handleClear,
        isSubmitting: statusAddSongToChurch === 'pending',
        isSuccess: statusAddSongToChurch === 'success',
    };
};
