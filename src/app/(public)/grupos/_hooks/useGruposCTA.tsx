'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { useDisclosure } from "@heroui/react";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { updateUserFromToken } from '@global/utils/updateUserFromToken';
import { BandsProps } from '@bands/_interfaces/bandsInterface';


interface CreateBandResponse {
    band: BandsProps;
    accessToken: string;
    refreshToken: string;
}

export const useGruposCTA = () => {
    const user = useStore($user);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const router = useRouter();
    const [bandName, setBandName] = useState('');

    const {
        data: response,
        mutate: createBand,
        status: createBandStatus,
    } = PostData<CreateBandResponse, { name: string }>({
        key: 'CreateBand',
        url: `${Server1API}/bands`,
        method: 'POST',
    });

    const handleCreateBand = () => {
        if (bandName.trim() === '') {
            toast.error('El nombre del grupo es obligatorio');
            return;
        }

        createBand({ name: bandName });
    };

    useEffect(() => {
        const handleSuccess = async () => {
            if (createBandStatus === 'success' && response) {
                toast.success('Grupo creado exitosamente');

                // Guardar los nuevos tokens que vienen del backend
                if (typeof window !== 'undefined') {
                    const tokens = {
                        accessToken: response.accessToken,
                        refreshToken: response.refreshToken,
                        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutos
                    };
                    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
                }

                // Actualizar el store del usuario con los datos del nuevo token
                updateUserFromToken();

                // Cerrar modal y limpiar
                onClose();
                setBandName('');

                // Redirigir a la página del grupo
                router.push(`/grupos/${response.band.id}`);
            }
        };

        handleSuccess();

        if (createBandStatus === 'error') {
            toast.error('Error al crear el grupo');
        }
    }, [createBandStatus, response, router, onClose]);

    const handleClear = () => {
        setBandName('');
    };

    return {
        isLoggedIn: user.isLoggedIn,
        isOpen,
        onOpen,
        onOpenChange,
        onClose,
        bandName,
        setBandName,
        handleCreateBand,
        handleClear,
        isCreating: createBandStatus === 'pending',
        isSuccess: createBandStatus === 'success',
    };
};
