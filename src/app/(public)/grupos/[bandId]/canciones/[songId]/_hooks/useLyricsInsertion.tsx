import { useState } from 'react';

export const useLyricsInsertion = () => {
    const [insertPosition, setInsertPosition] = useState<number | null>(null);

    const openInsertAt = (position: number) => {
        setInsertPosition(position);
    };

    const closeInsert = () => {
        setInsertPosition(null);
    };

    return {
        insertPosition,
        openInsertAt,
        closeInsert,
    };
};
