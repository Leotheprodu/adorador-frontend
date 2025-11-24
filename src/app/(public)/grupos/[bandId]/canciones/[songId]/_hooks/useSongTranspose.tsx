import { useEffect, useState } from 'react';

export const useSongTranspose = (songId: string) => {
    const [transpose, setTranspose] = useState(0);

    useEffect(() => {
        const storageKey = `songTranspose_${songId}`;

        const loadTranspose = () => {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                setTranspose(parseInt(stored));
            } else {
                setTranspose(0);
            }
        };

        loadTranspose();

        // Listener para cambios en localStorage (desde otro componente)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === storageKey) {
                loadTranspose();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Polling interval para detectar cambios locales
        const interval = setInterval(loadTranspose, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [songId]);

    return transpose;
};
