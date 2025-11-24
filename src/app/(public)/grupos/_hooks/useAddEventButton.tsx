'use client';

import { useState, useEffect } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '@nanostores/react';
import toast from 'react-hot-toast';
import { $user } from '@global/stores/users';
import { userRoles } from '@global/config/constants';
import { handleOnChange } from '@global/utils/formUtils';
import { addEventsToBandService } from '@bands/[bandId]/eventos/_services/eventsOfBandService';

export const useAddEventButton = (bandId: string) => {
    const queryClient = useQueryClient();
    const user = useStore($user);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const formInit = {
        title: '',
        date: tomorrow.toISOString().slice(0, 16),
    };
    const [form, setForm] = useState(formInit);

    const { mutate: mutateAddEventToBand, status: statusAddEventToBand } =
        addEventsToBandService({ bandId });

    // Verificar si el usuario es admin de la banda
    const isAdminBand =
        user.isLoggedIn &&
        user.membersofBands.some(
            (band) => band.band.id === Number(bandId) && band.isAdmin,
        );
    const isSystemAdmin = user?.roles.includes(userRoles.admin.id);
    const hasPermission = isAdminBand || isSystemAdmin;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleOnChange(setForm, e);
    };

    const handleAddEvent = () => {
        if (form.title === '') {
            toast.error('El título del evento es obligatorio');
            return;
        }
        if (!form.date) {
            toast.error('La fecha del evento es obligatoria');
            return;
        }
        mutateAddEventToBand({
            title: form.title,
            date: new Date(form.date),
        });
    };

    const handleClear = () => {
        setForm(formInit);
    };

    useEffect(() => {
        if (statusAddEventToBand === 'success') {
            toast.success('Evento creado correctamente');
            // Invalidar queries para que se actualicen las listas de eventos
            queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
            queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
            // Invalidar la lista de grupos del usuario (donde se muestran los eventos en las cards)
            queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
            // Cerrar el modal y resetear el formulario
            onClose();
            setForm(formInit);
        }
        if (statusAddEventToBand === 'error') {
            toast.error('Error al crear el evento');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusAddEventToBand, bandId, queryClient, onClose]);

    return {
        isOpen,
        onOpen,
        onOpenChange,
        onClose,
        form,
        setForm,
        handleChange,
        handleAddEvent,
        handleClear,
        hasPermission,
        isSubmitting: statusAddEventToBand === 'pending',
        isSuccess: statusAddEventToBand === 'success',
    };
};
