import { useState } from 'react';

export const useFileUpload = () => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        onFileSelect: (file: File) => void,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type === 'text/plain') {
            onFileSelect(file);
        } else {
            alert('Por favor, arrastra un archivo .txt');
        }
    };

    const handleFileInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        onFileSelect: (file: File) => void,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return {
        isDragging,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileInput,
    };
};
